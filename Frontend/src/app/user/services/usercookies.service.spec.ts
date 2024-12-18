import { TestBed } from '@angular/core/testing';

import { UsercookiesService } from './usercookies.service';

describe('UsercookiesService', () => {
  let service: UsercookiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsercookiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
