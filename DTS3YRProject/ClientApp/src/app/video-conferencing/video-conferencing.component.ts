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
  selector: 'app-video-conferencing',
  templateUrl: './video-conferencing.component.html',
  styleUrls: ['./video-conferencing.component.css']
})
export class VideoConferencingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
