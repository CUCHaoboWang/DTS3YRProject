import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { test } from 'linkifyjs';

export class MatDialogMock {
  open() { }
  close() { }
}

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock }
      ]
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
