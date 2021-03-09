import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
