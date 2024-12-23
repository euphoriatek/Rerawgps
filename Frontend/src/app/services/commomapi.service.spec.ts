import { TestBed } from '@angular/core/testing';

import { CommomapiService } from './commomapi.service';

describe('CommomapiService', () => {
  let service: CommomapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommomapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
