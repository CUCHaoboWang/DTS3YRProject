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
  selector: 'app-video-streaming',
  templateUrl: './video-streaming.component.html',
  styleUrls: ['./video-streaming.component.css']
})
export class VideoStreamingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
