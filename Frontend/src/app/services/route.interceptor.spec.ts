import { TestBed } from '@angular/core/testing';

import { RouteInterceptor } from './route.interceptor';

describe('RouteInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RouteInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RouteInterceptor = TestBed.inject(RouteInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
