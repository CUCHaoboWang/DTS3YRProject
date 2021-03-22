import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ILogger } from '../shared/types/logger-type';
import { LoggerService } from '../shared/services/logger/logger.service';
import { StorageService } from '../shared/services/storage/storage.service';
import { SignalRService } from '../shared/services/webrtc-signalr/signalr.service';
import { WebrtcSignalRService } from '../shared/services/webrtc-signalr/webrtc-signalr.service';
import { ChatMessage, PeerData, SignalInfo, UserInfo } from '../shared/services/webrtc-signalr/signalr.interface';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayerLocal') videoPlayerLocal: ElementRef;
  @ViewChild('videoPlayerRemote') videoPlayerRemote: ElementRef;

  myNickName: string;
  mySessionId: string;

  public subscriptions = new Subscription();
  private localStream: MediaStream;
  private remoteStream: MediaStream;
  public remoteVideo: string;
  private log: ILogger;
  public messageString: string;
  public messages: Array<ChatMessage>;
  public mediaError = (): void => { this.log.d(`Unable to access media devices.`); };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loggerSrv: LoggerService,
    private signalRService: SignalRService,
    private webRTCService: WebrtcSignalRService
  ) {
    this.log = this.loggerSrv.get('VideoCallComponent');
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.myNickName = params.userName;
      this.mySessionId = params.roomName;
    });

    this.messages = new Array();

    this.subscriptions.add(this.signalRService.newPeer$.subscribe((user: UserInfo) => {
      this.webRTCService.userJoined(user);
      this.signalRService.sendNotificationToUser(this.myNickName, user.connectionId);
    }));

    this.subscriptions.add(this.signalRService.notification$.subscribe((user: UserInfo) => {
      this.webRTCService.userJoined(user);
    }));

    this.subscriptions.add(this.signalRService.disconnectedPeer$.subscribe((user: UserInfo) => {
      this.webRTCService.userDisconnected(user);
    }));

    this.subscriptions.add(this.signalRService.signal$.subscribe((signalData: SignalInfo) => {
      this.webRTCService.signalPeer(signalData.user, signalData.signal, this.localStream);
    }));

    this.subscriptions.add(this.webRTCService.onSignalToSend$.subscribe((data: PeerData) => {
      this.signalRService.sendSignalToUser(data.data, data.id);
    }));

    this.subscriptions.add(this.webRTCService.onData$.subscribe((peerData: PeerData) => {
      this.messages = [...this.messages, { own: false, message: peerData.data }];
      this.log.d(`Data from user ${peerData.id}: ${peerData.data}`);
    }));

    this.subscriptions.add(this.webRTCService.onStream$.subscribe((peerData: PeerData) => {
      this.remoteVideo = peerData.id;
      this.remoteStream = peerData.data;
      this.videoPlayerRemote.nativeElement.srcObject = this.remoteStream;
      this.videoPlayerRemote.nativeElement.load();
      this.videoPlayerRemote.nativeElement.play();
    }));

    this.initLocalUser();
  }

  public async initLocalUser(): Promise<void> {
    try {
      await this.signalRService.startConnection(this.myNickName, this.mySessionId);
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.videoPlayerLocal.nativeElement.srcObject = this.localStream;
      this.videoPlayerLocal.nativeElement.load();
      this.videoPlayerLocal.nativeElement.play();
    } catch (error) {
      this.log.w(`Unable to access media devices. Error ${error}.`);
    }
  }

  public initRemoteUser(userInfo: UserInfo) {
    const peer = this.webRTCService.createPeer(this.localStream, userInfo.connectionId, true);
    this.webRTCService.currentPeer = peer;
  }

  stopStreamedVideo() {
    const stream = this.localStream;
    const tracks = stream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
    });

    this.videoPlayerLocal.nativeElement.srcObject = null;
  }

  leaveSession() {
    this.log.d('Leaving session...');
    this.stopStreamedVideo();
    this.subscriptions.unsubscribe();

    this.router.navigate(['']);
  }

  public sendMessage() {
    this.webRTCService.sendMessage(this.messageString);
    this.messages = [...this.messages, { own: true, message: this.messageString }];
    this.messageString = null;
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.leaveSession();
  }

  ngOnDestroy() {
    this.leaveSession();
  }
}
