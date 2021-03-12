import { TestBed } from '@angular/core/testing';

import { ChatService } from '../chat/chat.service';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { RemoteUsersService } from '../remote-users/remote-users.service';
import { RemoteUsersServiceMock } from '../remote-users/remote-users.service.mock';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsServiceMock } from '../notifications/notifications.service.mock';
import { WebrtcService } from '../webrtc/webrtc.service';
import { WebrtcServiceMock } from '../webrtc/webrtc.service.mock';
import { LocalUsersService } from '../local-users/local-users.service';
import { LocalUsersServiceMock } from '../local-users/local-users.service.mock';

describe('WebrtcService', () => {
  let service: WebrtcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebrtcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
