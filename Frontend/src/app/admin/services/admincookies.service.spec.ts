import { TestBed } from '@angular/core/testing';

import { AdmincookiesService } from './admincookies.service';

describe('AdmincookiesService', () => {
  let service: AdmincookiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdmincookiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
