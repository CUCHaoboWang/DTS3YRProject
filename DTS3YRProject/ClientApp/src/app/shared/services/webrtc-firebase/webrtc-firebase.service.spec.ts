import { TestBed } from '@angular/core/testing';

import { WebrtcFirebaseService } from './webrtc-firebase.service';

describe('WebrtcFirebaseService', () => {
  let service: WebrtcFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebrtcFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
