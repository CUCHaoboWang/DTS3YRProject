import { TestBed } from '@angular/core/testing';

import { WebrtcSignalRService } from './webrtc-signalr.service';

describe('WebrtcSignalrService', () => {
  let service: WebrtcSignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebrtcSignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
