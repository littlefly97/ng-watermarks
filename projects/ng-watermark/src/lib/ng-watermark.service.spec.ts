import { TestBed } from '@angular/core/testing';

import { NgWatermarkService } from './ng-watermark.service';

describe('NgWatermarkService', () => {
  let service: NgWatermarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgWatermarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
