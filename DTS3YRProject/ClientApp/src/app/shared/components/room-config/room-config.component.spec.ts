import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomConfigComponent } from './room-config.component';
import { LoggerService } from '../../services/logger/logger.service';
import { UtilsService } from '../../services/utils/utils.service';
import { DevicesService } from '../../services/devices/devices.service';
import { DevicesServiceMock } from '../../services/devices/devices.service.mock';
import { UtilsServiceMock } from '../../services/utils/utils.service.mock';
import { LoggerServiceMock } from '../../services/logger/logger.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { IsAutoPublishPipe } from '../../pipes/video-settings.pipe';
import { StorageService } from '../../services/storage/storage.service';
import { StorageServiceMock } from '../../services/storage/storage.service.mock';
import { WebrtcServiceMock } from '../../services/webrtc/webrtc.service.mock';
import { WebrtcService } from '../../services/webrtc/webrtc.service';
import { LocalUsersService } from '../../services/local-users/local-users.service';
import { LocalUsersServiceMock } from '../../services/local-users/local-users.service.mock';
import { TokenService } from '../../services/token/token.service';
import { TokenServiceMock } from '../../services/token/token.service.mock';
import { AvatarService } from '../../services/avatar/avatar.service';
import { AvatarServiceMock } from '../../services/avatar/avatar.service.mock';

describe('RoomConfigComponent', () => {
  let component: RoomConfigComponent;
  let fixture: ComponentFixture<RoomConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoomConfigComponent, IsAutoPublishPipe],
      providers: [
        { provide: LoggerService, useClass: LoggerServiceMock },
        { provide: UtilsService, useClass: UtilsServiceMock },
        { provide: WebrtcService, useClass: WebrtcServiceMock },
        { provide: LocalUsersService, useClass: LocalUsersServiceMock },
        { provide: DevicesService, useClass: DevicesServiceMock },
        { provide: StorageService, useClass: StorageServiceMock },
        { provide: TokenService, useClass: TokenServiceMock },
        { provide: AvatarService, useClass: AvatarServiceMock }

      ],
      imports: [RouterTestingModule.withRoutes([])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
