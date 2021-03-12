import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { VideoConferencingComponent } from './video-conferencing.component';
import { LoggerService } from '../shared/services/logger/logger.service';
import { LoggerServiceMock } from '../shared/services/logger/logger.service.mock';
import { NetworkServiceMock } from '../shared/services/network/network.service.mock';
import { NetworkService } from '../shared/services/network/network.service';
import { UtilsService } from '../shared/services/utils/utils.service';
import { RemoteUsersService } from '../shared/services/remote-users/remote-users.service';
import { DevicesService } from '../shared/services/devices/devices.service';
import { ChatService } from '../shared/services/chat/chat.service';
import { ChatServiceMock } from '../shared/services/chat/chat.service.mock';
import { DevicesServiceMock } from '../shared/services/devices/devices.service.mock';
import { UtilsServiceMock } from '../shared/services/utils/utils.service.mock';
import { RemoteUsersServiceMock } from '../shared/services/remote-users/remote-users.service.mock';
import { LocalUsersService } from '../shared/services/local-users/local-users.service';
import { LocalUsersServiceMock } from '../shared/services/local-users/local-users.service.mock';
import { WebrtcService } from '../shared/services/webrtc/webrtc.service';
import { WebrtcServiceMock } from '../shared/services/webrtc/webrtc.service.mock';

describe('VideoConferencingComponent unit test', () => {
  let component: VideoConferencingComponent;
  let fixture: ComponentFixture<VideoConferencingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VideoConferencingComponent],
      providers: [
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: NetworkService, useClass: NetworkServiceMock },
        { provide: UtilsService, useClass: UtilsServiceMock },
        { provide: RemoteUsersService, useClass: RemoteUsersServiceMock },
        { provide: LocalUsersService, useClass: LocalUsersServiceMock },
        { provide: WebrtcService, useClass: WebrtcServiceMock },
        { provide: DevicesService, useClass: DevicesServiceMock },
        { provide: ChatService, useClass: ChatServiceMock }
      ],
      imports: [RouterTestingModule.withRoutes([])]
    }).compileComponents();
    fixture = TestBed.createComponent(VideoConferencingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
