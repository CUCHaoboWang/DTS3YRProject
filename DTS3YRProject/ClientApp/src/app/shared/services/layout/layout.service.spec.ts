import { TestBed } from '@angular/core/testing';

import { VideoLayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: VideoLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
