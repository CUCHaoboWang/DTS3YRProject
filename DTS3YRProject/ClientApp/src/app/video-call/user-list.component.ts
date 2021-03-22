import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from '../shared/services/webrtc-signalr/signalr.interface';
import { WebrtcSignalRService } from '../shared/services/webrtc-signalr/webrtc-signalr.service';

//<ul class="list-group mt-4">
//  <li class="list-group-item" (click)="userClicked(user)" *ngFor="let user of users$ | async">
//    {{user.userName}}
//  </li>
//</ul>

@Component({
  selector: 'app-user-list',
  template:
    `<div class="btn-group py-3" role="group">
      <button type="button" class="btn btn-secondary" (click)="userClicked(user)" *ngFor="let user of users$ | async">
        {{user.userName}}
      </button>
    </div>
    `
})
export class UserListComponent implements OnInit {

  @Output() userSelected: EventEmitter<UserInfo> = new EventEmitter<UserInfo>();

  public users$: Observable<Array<UserInfo>>;

  constructor(private webRTCService: WebrtcSignalRService) { }

  ngOnInit() {
    this.users$ = this.webRTCService.users$;
  }

  public userClicked(user: UserInfo) {
    this.userSelected.emit(user);
  }
}
