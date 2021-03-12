import { Component, OnInit, Output, EventEmitter, Input, HostListener, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserModel } from '../../models/user-model';
import { NicknameMatcher } from '../../forms-matchers/nickname';
import { UtilsService } from '../../services/utils/utils.service';
import { Publisher } from 'openvidu-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { IDevice, CameraType } from '../../types/device-type';
import { DevicesService } from '../../services/devices/devices.service';
import { Subscription } from 'rxjs';
import { AvatarType } from '../../types/chat-type';
import { LoggerService } from '../../services/logger/logger.service';
import { ILogger } from '../../types/logger-type';
import { ScreenType } from '../../types/video-type';
import { ExternalConfigModel } from '../../models/external-config';
import { VideoSettingsModel } from '../../models/video-settings';
import { StorageService } from '../../services/storage/storage.service';
import { Storage } from '../../types/storage-type';
import { OpenViduErrorName } from 'openvidu-browser/lib/OpenViduInternal/Enums/OpenViduError';
import { WebrtcService } from '../../services/webrtc/webrtc.service';
import { LocalUsersService } from '../../services/local-users/local-users.service';
import { TokenService } from '../../services/token/token.service';
import { AvatarService } from '../../services/avatar/avatar.service';

@Component({
  selector: 'app-room-config',
  templateUrl: './room-config.component.html',
  styleUrls: ['./room-config.component.css']
})
export class RoomConfigComponent implements OnInit, OnDestroy {
  @ViewChild('bodyCard') bodyCard: ElementRef;

  @Input() externalConfig: ExternalConfigModel;
  @Input() videoSettings: VideoSettingsModel;
  @Output() join = new EventEmitter<any>();
  @Output() leaveSession = new EventEmitter<any>();

  // Webcomponent event
  @Output() publisherCreated = new EventEmitter<any>();

  mySessionId: string;

  cameras: IDevice[];
  microphones: IDevice[];
  camSelected: IDevice;
  micSelected: IDevice;
  isVideoActive = true;
  isAudioActive = true;
  screenShareEnabled: boolean;
  localUsers: UserModel[] = [];
  openviduAvatar: string;
  capturedAvatar: string;
  avatarTypeEnum = AvatarType;
  avatarSelected: AvatarType;
  columns: number;

  nicknameFormControl = new FormControl('', [Validators.maxLength(25), Validators.required]);
  matcher = new NicknameMatcher();
  hasVideoDevices: boolean;
  hasAudioDevices: boolean;
  showConfigCard: boolean;
  private log: ILogger;

  private usersSubscription: Subscription;
  private screenShareStateSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private utilsSrv: UtilsService,
    private webRTCService: WebrtcService,
    private localUsersService: LocalUsersService,
    private tokenService: TokenService,
    private devicesService: DevicesService,
    private loggerSrv: LoggerService,
    private storageSrv: StorageService,
    private avatarService: AvatarService
  ) {
    this.log = this.loggerSrv.get('RoomConfigComponent');
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.close();
  }

  async ngOnInit() {
    this.subscribeToLocalUsersEvents();
    this.initNicknameAndSubscribeToChanges();
    this.openviduAvatar = this.avatarService.getVideoAvatar();
    this.columns = window.innerWidth > 900 ? 2 : 1;
    this.setSessionName();
    await this.devicesService.initDevices();
    this.setDevicesInfo();
    if (this.hasAudioDevices || this.hasVideoDevices) {
      await this.initwebcamPublisher();
    } else {
      // Emit publisher to webcomponent and angular-library
      this.emitPublisher(null);
      this.showConfigCard = true;
    }
  }

  ngOnDestroy() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }

    if (this.screenShareStateSubscription) {
      this.screenShareStateSubscription.unsubscribe();
    }
    this.devicesService.clear();
  }

  async onCameraSelected(event: any) {
    const videoSource = event?.value;
    if (!!videoSource) {
      // Is New deviceId different from the old one?
      if (this.devicesService.needUpdateVideoTrack(videoSource)) {
        const mirror = this.devicesService.cameraNeedsMirror(videoSource);
        await this.webRTCService.replaceTrack(videoSource, null, mirror);
        this.devicesService.setCamSelected(videoSource);
        this.camSelected = this.devicesService.getCamSelected();
      }
      // Publish Webcam
      this.webRTCService.publishWebcamVideo(true);
      this.isVideoActive = true;
      return;
    }
    // Unpublish webcam
    this.webRTCService.publishWebcamVideo(false);
    this.isVideoActive = false;
  }

  async onMicrophoneSelected(event: any) {
    const audioSource = event?.value;

    if (!!audioSource) {
      // Is New deviceId different than older?
      if (this.devicesService.needUpdateAudioTrack(audioSource)) {
        console.log(this.camSelected);
        const mirror = this.devicesService.cameraNeedsMirror(this.camSelected.device);
        await this.webRTCService.replaceTrack(null, audioSource, mirror);
        this.devicesService.setMicSelected(audioSource);
        this.micSelected = this.devicesService.getMicSelected();
      }
      // Publish microphone
      this.publishAudio(true);
      this.isAudioActive = true;
      return;
    }
    // Unpublish microhpone
    this.publishAudio(false);
    this.isAudioActive = false;
  }

  toggleCam() {
    this.isVideoActive = !this.isVideoActive;
    this.webRTCService.publishWebcamVideo(this.isVideoActive);

    if (this.localUsersService.areBothConnected()) {
      this.localUsersService.disableWebcamUser();
      this.webRTCService.publishScreenAudio(this.isAudioActive);
      // !this.subscribeToVolumeChange(<Publisher>this.localUsers[0].getStreamManager());
    } else if (this.localUsersService.isOnlyScreenConnected()) {
      // (<Publisher>this.localUsers[0].getStreamManager()).off('streamAudioVolumeChange');
      this.localUsersService.enableWebcamUser();
    }
  }

  toggleScreenShare() {
    // Disabling screenShare
    if (this.localUsersService.areBothConnected()) {
      this.localUsersService.disableScreenUser();
      return;
    }

    // Enabling screenShare
    if (this.localUsersService.isOnlyWebcamConnected()) {
      const screenPublisher = this.initScreenPublisher();

      screenPublisher.on('accessAllowed', (event) => {
        screenPublisher.stream
          .getMediaStream()
          .getVideoTracks()[0]
          .addEventListener('ended', () => {
            this.log.d('Clicked native stop button. Stopping screen sharing');
            this.toggleScreenShare();
          });
        this.localUsersService.enableScreenUser(screenPublisher);
        if (!this.localUsersService.hasWebcamVideoActive()) {
          this.localUsersService.disableWebcamUser();
        }
      });

      screenPublisher.on('accessDenied', (event) => {
        this.log.w('ScreenShare: Access Denied');
      });
      return;
    }

    // Disabling screnShare and enabling webcam
    this.localUsersService.enableWebcamUser();
    this.localUsersService.disableScreenUser();
  }

  toggleMic() {
    this.isAudioActive = !this.isAudioActive;
    this.publishAudio(this.isAudioActive);
  }

  captureAvatar() {
    this.capturedAvatar = this.avatarService.createCapture();
  }

  initNicknameAndSubscribeToChanges() {
    if (this.externalConfig) {
      this.nicknameFormControl.setValue(this.externalConfig.getNickname());
      this.localUsersService.updateUsersNickname(this.externalConfig.getNickname());
      return;
    }
    const nickname = this.storageSrv.get(Storage.USER_NICKNAME) || this.utilsSrv.generateNickname();
    this.nicknameFormControl.setValue(nickname);
    this.localUsersService.updateUsersNickname(nickname);

    this.nicknameFormControl.valueChanges.subscribe((value) => {
      this.localUsersService.updateUsersNickname(value);
      this.storageSrv.set(Storage.USER_NICKNAME, value);
    });
  }

  eventKeyPress(event) {
    if (event && event.keyCode === 13 && this.nicknameFormControl.valid) {
      this.joinSession();
    }
  }

  onResize(event) {
    this.columns = event.target.innerWidth > 900 ? 2 : 1;
  }

  joinSession() {
    if (this.nicknameFormControl.valid) {
      this.avatarService.setFinalAvatar(this.avatarSelected);
      return this.join.emit();
    }
    this.scrollToBottom();
  }

  close() {
    this.leaveSession.emit();
    this.showConfigCard = false;
  }

  onSelectAvatar(type: AvatarType) {
    this.avatarSelected = type;
  }

  private setDevicesInfo() {
    this.hasVideoDevices = this.devicesService.hasVideoDeviceAvailable();
    this.hasAudioDevices = this.devicesService.hasAudioDeviceAvailable();
    this.microphones = this.devicesService.getMicrophones();
    this.cameras = this.devicesService.getCameras();
    this.camSelected = this.devicesService.getCamSelected();
    this.micSelected = this.devicesService.getMicSelected();
  }

  private setSessionName() {
    this.route.params.subscribe((params: Params) => {
      this.mySessionId = this.externalConfig ? this.externalConfig.getSessionName() : params.roomName;
      this.tokenService.setSessionId(this.mySessionId);
    });
  }

  private scrollToBottom(): void {
    try {
      this.bodyCard.nativeElement.scrollTop = this.bodyCard.nativeElement.scrollHeight;
    } catch (err) { }
  }

  private initScreenPublisher(): Publisher {
    const videoSource = ScreenType.SCREEN;
    const audioSource = this.hasAudioDevices ? undefined : null;
    const willThereBeWebcam = this.localUsersService.isWebCamEnabled() && this.localUsersService.hasWebcamVideoActive();
    const hasAudio = willThereBeWebcam ? false : this.hasAudioDevices && this.isAudioActive;
    const properties = this.webRTCService.createPublisherProperties(videoSource, audioSource, true, hasAudio, false);

    try {
      return this.webRTCService.initPublisher(undefined, properties);
    } catch (error) {
      this.log.e(error);
      this.utilsSrv.handleScreenShareError(error);
    }
  }

  private publishAudio(audio: boolean) {
    this.localUsersService.isWebCamEnabled()
      ? this.webRTCService.publishWebcamAudio(audio)
      : this.webRTCService.publishScreenAudio(audio);
  }

  private subscribeToLocalUsersEvents() {
    this.usersSubscription = this.localUsersService.Users.subscribe((users) => {
      this.localUsers = users;
    });
    this.screenShareStateSubscription = this.localUsersService.screenShareState.subscribe((enabled) => {
      this.screenShareEnabled = enabled;
    });
  }

  private async initwebcamPublisher() {
    const micStorageDevice = this.micSelected?.device || undefined;
    const camStorageDevice = this.camSelected?.device || undefined;

    const videoSource = this.hasVideoDevices ? camStorageDevice : false;
    const audioSource = this.hasAudioDevices ? micStorageDevice : false;
    const publishAudio = this.hasAudioDevices ? this.isAudioActive : false;
    const publishVideo = this.hasVideoDevices ? this.isVideoActive : false;
    const mirror = this.camSelected && this.camSelected.type === CameraType.FRONT;
    const properties = this.webRTCService.createPublisherProperties(
      videoSource,
      audioSource,
      publishVideo,
      publishAudio,
      mirror
    );
    const publisher = await this.webRTCService.initPublisherAsync(undefined, properties);
    this.localUsersService.setWebcamPublisher(publisher);
    this.handlePublisherSuccess(publisher);
    this.handlePublisherError(publisher);
  }

  private emitPublisher(publisher) {
    this.publisherCreated.emit(publisher);
  }

  private handlePublisherSuccess(publisher: Publisher) {
    publisher.once('accessAllowed', async () => {
      if (this.devicesService.areEmptyLabels()) {
        await this.devicesService.initDevices();
        if (this.hasAudioDevices) {
          const audioLabel = publisher?.stream?.getMediaStream()?.getAudioTracks()[0]?.label;
          this.devicesService.setMicSelected(audioLabel);
        }

        if (this.hasVideoDevices) {
          const videoLabel = publisher?.stream?.getMediaStream()?.getVideoTracks()[0]?.label;
          this.devicesService.setCamSelected(videoLabel);
        }
        this.setDevicesInfo();
      }
      // Emit publisher to webcomponent and angular-library
      this.emitPublisher(publisher);

      if (this.videoSettings.isAutoPublish()) {
        this.joinSession();
        return;
      }
      this.showConfigCard = true;
    });
  }

  private handlePublisherError(publisher: Publisher) {
    publisher.once('accessDenied', (e: any) => {
      let message: string;
      if (e.name === OpenViduErrorName.DEVICE_ALREADY_IN_USE) {
        this.log.w('Video device already in use. Disabling video device...');
        // Allow access to the room with only mic if camera device is already in use
        this.hasVideoDevices = false;
        this.devicesService.disableVideoDevices();
        return this.initwebcamPublisher();
      }
      if (e.name === OpenViduErrorName.DEVICE_ACCESS_DENIED) {
        message = 'Access to media devices was not allowed.';
      } else if (e.name === OpenViduErrorName.NO_INPUT_SOURCE_SET) {
        message = 'No video or audio devices have been found. Please, connect at least one.';
      }
      this.utilsSrv.showErrorMessage(e.name.replace(/_/g, ' '), message, true);
      this.log.e(e.message);
    });
  }
}
