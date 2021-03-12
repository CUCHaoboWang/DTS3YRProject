import { Injectable } from '@angular/core';
import { LocalUsersService } from '../local-users/local-users.service';
import { AvatarType } from '../../types/chat-type';

@Injectable({
  providedIn: 'root'
})
export class AvatarServiceMock {
  private videoAvatar = 'assets/images/favicon.png';
  private capturedAvatar = '';

  constructor() { }

  setCaputedAvatar(avatar: string) { }

  setFinalAvatar(type: AvatarType) { }

  getVideoAvatar(): string {
    return this.videoAvatar;
  }
  getCapturedAvatar(): string {
    return this.capturedAvatar;
  }

  createCapture(): string {
    return '';
  }

  getAvatarFromConnectionData(data: string): string {
    return '';
  }

  clear() { }
}
