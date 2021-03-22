import { Component, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import {
  Publisher,
  Subscriber,
  Session,
  StreamEvent,
  StreamPropertyChangedEvent,
  SessionDisconnectedEvent,
  PublisherSpeakingEvent,
  ConnectionEvent
} from 'openvidu-browser';

import { MatSidenav } from '@angular/material/sidenav';
import { UserModel } from '../shared/models/user-model';
import { ChatComponent } from '../shared/components/chat/chat.component';
import { VideoSettingsModel } from '../shared/models/video-settings';
import { ExternalConfigModel } from '../shared/models/external-config';
import { ScreenType, VideoType } from '../shared/types/video-type';
import { UserName } from '../shared/types/username-type';
import { LayoutType } from '../shared/types/layout-type';
import { Storage } from '../shared/types/storage-type';
import { ILogger } from '../shared/types/logger-type';

// Services
import { DevicesService } from '../shared/services/devices/devices.service';
import { LoggerService } from '../shared/services/logger/logger.service';
import { LocalUsersService } from '../shared/services/local-users/local-users.service';
import { RemoteUsersService } from '../shared/services/remote-users/remote-users.service';
import { UtilsService } from '../shared/services/utils/utils.service';
import { ChatService } from '../shared/services/chat/chat.service';
import { StorageService } from '../shared/services/storage/storage.service';
import { VideoLayoutService } from '../shared/services/layout/layout.service';
import { TokenService } from '../shared/services/token/token.service';
import { WebrtcService } from '../shared/services/webrtc/webrtc.service';

@Component({
  selector: 'app-video-conferencing',
  templateUrl: './video-conferencing.component.html',
  styleUrls: ['./video-conferencing.component.css']
})
export class VideoConferencingComponent implements OnInit, OnDestroy {
  // Config from webcomponent or angular-library
  @Input() externalConfig: ExternalConfigModel;
  @ViewChild('chatComponent') chatComponent: ChatComponent;
  @ViewChild('sidenav') chatSidenav: MatSidenav;

  videoSettings: VideoSettingsModel;
  compact = false;
  sidenavMode: 'side' | 'over' = 'side';
  lightTheme: boolean;
  showConfigRoomCard = true;
  session: Session;
  sessionScreen: Session;
  localUsers: UserModel[] = [];
  remoteUsers: UserModel[] = [];
  participantsNameList: UserName[] = [];
  isConnectionLost: boolean;
  isAutoLayout = false;
  hasVideoDevices: boolean;
  hasAudioDevices: boolean;
  private log: ILogger;
  private usersSubscription: Subscription;
  private remoteUsersSubscription: Subscription;
  private chatSubscription: Subscription;
  private remoteUserNameSubscription: Subscription;

  constructor(
    private router: Router,
    private devicesService: DevicesService,
    private loggerSrv: LoggerService,
    private localUsersService: LocalUsersService,
    private remoteUsersService: RemoteUsersService,
    private utilsSrv: UtilsService,
    private chatService: ChatService,
    private storageSrv: StorageService,
    private videoLayout: VideoLayoutService,
    private tokenService: TokenService,
    private webRTCService: WebrtcService
  ) {
    this.log = this.loggerSrv.get('VideoConferencingComponent');
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.leaveSession();
  }

  @HostListener('window:resize')
  sizeChange() {
    this.videoLayout.update();
    this.checkSizeComponent();
  }

  async ngOnInit() {
    this.localUsersService.initialize();
    this.webRTCService.initialize();

    this.lightTheme = false;
    this.videoSettings = new VideoSettingsModel();
    this.videoSettings.setScreenSharing(this.videoSettings.hasScreenSharing() && !this.utilsSrv.isMobile());
  }

  ngOnDestroy() {
    // Reconnecting session is received in Firefox
    // To avoid 'Connection lost' message uses session.off()
    this.session?.off('reconnecting');
    this.remoteUsersService.clear();
    this.videoLayout.clear();
    this.localUsersService.clear();
    this.session = null;
    this.sessionScreen = null;
    this.localUsers = [];
    this.remoteUsers = [];
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    if (this.remoteUsersSubscription) {
      this.remoteUsersSubscription.unsubscribe();
    }
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
    if (this.remoteUserNameSubscription) {
      this.remoteUserNameSubscription.unsubscribe();
    }
  }

  onConfigRoomJoin() {
    this.hasVideoDevices = this.devicesService.hasVideoDeviceAvailable();
    this.hasAudioDevices = this.devicesService.hasAudioDeviceAvailable();
    this.showConfigRoomCard = false;
    this.subscribeToLocalUsers();
    this.subscribeToRemoteUsers();
    this.tokenService.initialize(this.videoSettings);

    setTimeout(() => {
      this.videoLayout.initialize();
      this.checkSizeComponent();
      this.joinToSession();
    }, 50);
  }

  async joinToSession() {
    this.webRTCService.initSessions();
    this.session = this.webRTCService.getWebcamSession();
    this.sessionScreen = this.webRTCService.getScreenSession();
    this.subscribeToConnectionCreatedAndDestroyed();
    this.subscribeToStreamCreated();
    this.subscribeToStreamDestroyed();
    this.subscribeToStreamPropertyChange();
    this.subscribeToNicknameChanged();
    this.chatService.setChatComponent(this.chatSidenav);
    this.chatService.subscribeToChat();
    this.subscribeToChatComponent();
    this.subscribeToReconnection();
    await this.connectToSession();
    // Workaround, firefox does not have audio when publisher join with muted camera
    if (this.utilsSrv.isFirefox() && !this.localUsersService.hasWebcamVideoActive()) {
      this.webRTCService.publishWebcamVideo(true);
      this.webRTCService.publishWebcamVideo(false);
    }
  }

  leaveSession() {
    this.log.d('Leaving session...');
    this.webRTCService.disconnect();
    this.router.navigate(['']);
  }

  onNicknameUpdate(nickname: string) {
    this.localUsersService.updateUsersNickname(nickname);
    this.storageSrv.set(Storage.USER_NAME, nickname);
    this.webRTCService.sendNicknameSignal();
  }

  toggleMic() {
    if (this.localUsersService.isWebCamEnabled()) {
      this.webRTCService.publishWebcamAudio(!this.localUsersService.hasWebcamAudioActive());
      return;
    }
    this.webRTCService.publishScreenAudio(!this.localUsersService.hasScreenAudioActive());
  }

  async toggleCam() {
    const publishVideo = !this.localUsersService.hasWebcamVideoActive();

    // Disabling webcam
    if (this.localUsersService.areBothConnected()) {
      this.webRTCService.publishWebcamVideo(publishVideo);
      this.localUsersService.disableWebcamUser();
      this.webRTCService.unpublishWebcamPublisher();
      return;
    }
    // Enabling webcam
    if (this.localUsersService.isOnlyScreenConnected()) {
      const hasAudio = this.localUsersService.hasScreenAudioActive();

      if (!this.webRTCService.isWebcamSessionConnected()) {
        await this.connectWebcamSession();
      }
      await this.webRTCService.publishWebcamPublisher();
      this.webRTCService.publishScreenAudio(false);
      this.webRTCService.publishWebcamAudio(hasAudio);
      this.localUsersService.enableWebcamUser();
    }
    // Muting/unmuting webcam
    this.webRTCService.publishWebcamVideo(publishVideo);
  }

  async toggleScreenShare() {
    // Disabling screenShare
    if (this.localUsersService.areBothConnected()) {
      this.removeScreen();
      return;
    }

    // Enabling screenShare
    if (this.localUsersService.isOnlyWebcamConnected()) {
      const screenPublisher = this.initScreenPublisher();

      screenPublisher.once('accessAllowed', async (event) => {
        // Listen to event fired when native stop button is clicked
        screenPublisher.stream
          .getMediaStream()
          .getVideoTracks()[0]
          .addEventListener('ended', () => {
            this.log.d('Clicked native stop button. Stopping screen sharing');
            this.toggleScreenShare();
          });
        this.log.d('ACCESS ALOWED screenPublisher');
        this.localUsersService.enableScreenUser(screenPublisher);

        if (!this.webRTCService.isScreenSessionConnected()) {
          await this.connectScreenSession();
        }
        await this.webRTCService.publishScreenPublisher();
        this.webRTCService.sendNicknameSignal();
        if (!this.localUsersService.hasWebcamVideoActive()) {
          // Disabling webcam
          this.localUsersService.disableWebcamUser();
          this.webRTCService.unpublishWebcamPublisher();
        }
      });

      screenPublisher.once('accessDenied', (event) => {
        this.log.w('ScreenShare: Access Denied');
      });
      return;
    }

    // Disabling screnShare and enabling webcam
    const hasAudio = this.localUsersService.hasScreenAudioActive();
    await this.webRTCService.publishWebcamPublisher();
    this.webRTCService.publishScreenAudio(false);
    this.webRTCService.publishWebcamAudio(hasAudio);
    this.localUsersService.enableWebcamUser();
    this.removeScreen();
  }

  toggleSpeakerLayout() {
    if (!this.localUsersService.isScreenShareEnabled()) {
      this.isAutoLayout = !this.isAutoLayout;

      this.log.d('Automatic Layout ', this.isAutoLayout ? 'Disabled' : 'Enabled');
      if (this.isAutoLayout) {
        this.subscribeToSpeechDetection();
        return;
      }
      this.log.d('Unsubscribe to speech detection');
      this.session.off('publisherStartSpeaking');
      this.resetAllBigElements();
      this.videoLayout.update();
      return;
    }
    this.log.w('Screen is enabled. Speech detection has been rejected');
  }

  onReplaceScreenTrack(event) {
    this.webRTCService.replaceScreenTrack();
  }

  checkSizeComponent() {
    this.compact = document.getElementById('room-container')?.offsetWidth <= 790;
    this.sidenavMode = this.compact ? 'over' : 'side';
  }

  onToggleVideoSize(event: { element: HTMLElement; connectionId?: string; resetAll?: boolean }) {
    const element = event.element;
    if (!!event.resetAll) {
      this.resetAllBigElements();
    }

    this.utilsSrv.toggleBigElementClass(element);

    // Has been mandatory change the user zoom property here because of
    // zoom icons and cannot handle publisherStartSpeaking event in other component
    if (!!event?.connectionId) {
      if (this.webRTCService.isMyOwnConnection(event.connectionId)) {
        this.localUsersService.toggleZoom(event.connectionId);
      } else {
        this.remoteUsersService.toggleUserZoom(event.connectionId);
      }
    }
    this.videoLayout.update();
  }

  toolbarMicIconEnabled(): boolean {
    if (this.localUsersService.isWebCamEnabled()) {
      return this.localUsersService.hasWebcamAudioActive();
    }
    return this.localUsersService.hasScreenAudioActive();
  }

  private async connectToSession(): Promise<void> {
    try {
      // Initialize tokens from externalConfig or create new ones
      await this.tokenService.initTokens(this.externalConfig);
    } catch (error) {
      this.log.e('There was an error initializing the token:', error.status, error.message);
      this.utilsSrv.showErrorMessage('There was an error initializing the token:', error.error || error.message);
    }

    if (this.localUsersService.areBothConnected()) {
      await this.connectWebcamSession();
      await this.connectScreenSession();
      await this.webRTCService.publishWebcamPublisher();
      await this.webRTCService.publishScreenPublisher();
    } else if (this.localUsersService.isOnlyScreenConnected()) {
      await this.connectScreenSession();
      await this.webRTCService.publishScreenPublisher();
    } else {
      await this.connectWebcamSession();
      await this.webRTCService.publishWebcamPublisher();
    }
    this.videoLayout.update();
  }

  private async connectScreenSession() {
    try {
      await this.webRTCService.connectScreenSession(this.tokenService.getScreenToken());
    } catch (error) {
      this.log.e('There was an error connecting to the session:', error.code, error.message);
      this.utilsSrv.showErrorMessage('There was an error connecting to the session:', error?.error || error?.message);
    }
  }

  private async connectWebcamSession() {
    try {
      await this.webRTCService.connectWebcamSession(this.tokenService.getWebcamToken());
    } catch (error) {
      this.log.e('There was an error connecting to the session:', error.code, error.message);
      this.utilsSrv.showErrorMessage('There was an error connecting to the session:', error?.error || error?.message);
    }
  }

  private subscribeToConnectionCreatedAndDestroyed() {
    this.session.on('connectionCreated', (event: ConnectionEvent) => {
      if (this.webRTCService.isMyOwnConnection(event.connection.connectionId)) {
        return;
      }

      const nickname: string = this.utilsSrv.getNicknameFromConnectionData(event.connection.data);
      this.remoteUsersService.addUserName(event);

      // Adding participant when connection is created
      if (!nickname?.includes('_' + VideoType.SCREEN)) {
        this.remoteUsersService.add(event, null);
        this.webRTCService.sendNicknameSignal(event.connection);
      }
    });

    this.session.on('connectionDestroyed', (event: ConnectionEvent) => {
      if (this.webRTCService.isMyOwnConnection(event.connection.connectionId)) {
        return;
      }
      this.remoteUsersService.deleteUserName(event);
      const nickname: string = this.utilsSrv.getNicknameFromConnectionData(event.connection.data);
      // Deleting participant when connection is destroyed
      if (!nickname?.includes('_' + VideoType.SCREEN)) {
        this.remoteUsersService.removeUserByConnectionId(event.connection.connectionId);
      }
    });
  }

  private subscribeToStreamCreated() {
    this.session.on('streamCreated', (event: StreamEvent) => {
      const connectionId = event.stream.connection.connectionId;

      if (this.webRTCService.isMyOwnConnection(connectionId)) {
        return;
      }

      const subscriber: Subscriber = this.session.subscribe(event.stream, undefined);
      this.remoteUsersService.add(event, subscriber);
      // this.oVSessionService.sendNicknameSignal(event.stream.connection);
    });
  }

  private subscribeToStreamDestroyed() {
    this.session.on('streamDestroyed', (event: StreamEvent) => {
      const connectionId = event.stream.connection.connectionId;
      this.remoteUsersService.removeUserByConnectionId(connectionId);
      // event.preventDefault();
    });
  }

  // Emit publisher to webcomponent
  //emitPublisher(publisher: Publisher) {
  //  this._publisher.emit(publisher);
  //}

  private subscribeToStreamPropertyChange() {
    this.session.on('streamPropertyChanged', (event: StreamPropertyChangedEvent) => {
      const connectionId = event.stream.connection.connectionId;
      if (this.webRTCService.isMyOwnConnection(connectionId)) {
        return;
      }
      if (event.changedProperty === 'videoActive') {
        this.remoteUsersService.updateUsers();
      }
    });
  }

  private subscribeToNicknameChanged() {
    this.session.on('signal:nicknameChanged', (event: any) => {
      const connectionId = event.from.connectionId;
      if (this.webRTCService.isMyOwnConnection(connectionId)) {
        return;
      }
      const nickname = this.utilsSrv.getNicknameFromConnectionData(event.data);
      this.remoteUsersService.updateNickname(connectionId, nickname);
    });
  }

  private subscribeToSpeechDetection() {
    this.log.d('Subscribe to speech detection', this.session);
    // Has been mandatory change the user zoom property here because of
    // zoom icons and cannot handle publisherStartSpeaking event in other component
    this.session.on('publisherStartSpeaking', (event: PublisherSpeakingEvent) => {
      const someoneIsSharingScreen = this.remoteUsersService.someoneIsSharingScreen();
      if (!this.localUsersService.isScreenShareEnabled() && !someoneIsSharingScreen) {
        const elem = event.connection.stream.streamManager.videos[0].video;
        const element = this.utilsSrv.getHTMLElementByClassName(elem, LayoutType.ROOT_CLASS);
        this.resetAllBigElements();
        this.remoteUsersService.setUserZoom(event.connection.connectionId, true);
        this.onToggleVideoSize({ element });
      }
    });
  }

  private removeScreen() {
    this.localUsersService.disableScreenUser();
    this.webRTCService.unpublishScreenPublisher();
  }

  private subscribeToChatComponent() {
    this.chatSubscription = this.chatService.toggleChatObs.subscribe((opened) => {
      const timeout = 0;
      this.videoLayout.update(timeout);
    });
  }

  private subscribeToReconnection() {
    this.session.on('reconnecting', () => {
      this.log.w('Connection lost: Reconnecting');
      this.isConnectionLost = true;
      this.utilsSrv.showErrorMessage('Connection Problem', 'Oops! Trying to reconnect to the session ...', true);
    });
    this.session.on('reconnected', () => {
      this.log.w('Connection lost: Reconnected');
      this.isConnectionLost = false;
      this.utilsSrv.closeDialog();
    });
    this.session.on('sessionDisconnected', (event: SessionDisconnectedEvent) => {
      if (event.reason === 'networkDisconnect') {
        this.utilsSrv.closeDialog();
        this.leaveSession();
      }
    });
  }

  private initScreenPublisher(): Publisher {
    const videoSource = ScreenType.SCREEN;
    const audioSource = this.hasAudioDevices ? undefined : null;
    const willThereBeWebcam = this.localUsersService.isWebCamEnabled() && this.localUsersService.hasWebcamVideoActive();
    const hasAudio = willThereBeWebcam ? false : this.hasAudioDevices && this.localUsersService.hasWebcamAudioActive();
    const properties = this.webRTCService.createPublisherProperties(videoSource, audioSource, true, hasAudio, false);

    try {
      return this.webRTCService.initPublisher(undefined, properties);
    } catch (error) {
      this.log.e(error);
      this.utilsSrv.handleScreenShareError(error);
    }
  }

  private resetAllBigElements() {
    this.utilsSrv.removeAllBigElementClass();
    this.remoteUsersService.resetUsersZoom();
    this.localUsersService.resetUsersZoom();
  }

  private subscribeToLocalUsers() {
    this.usersSubscription = this.localUsersService.Users.subscribe((users: UserModel[]) => {
      this.localUsers = users;
      this.videoLayout.update();
    });
  }

  private subscribeToRemoteUsers() {
    this.remoteUsersSubscription = this.remoteUsersService.remoteUsers.subscribe((users: UserModel[]) => {
      this.remoteUsers = [...users];
      this.videoLayout.update();
    });

    this.remoteUserNameSubscription = this.remoteUsersService.remoteUserNameList.subscribe((names: UserName[]) => {
      this.participantsNameList = [...names];
    });
  }
}
