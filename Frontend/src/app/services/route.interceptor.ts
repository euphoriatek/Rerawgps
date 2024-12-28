import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminInterceptor } from '../admin/services/admin.interceptor';
import { UserInterceptor } from '../user/services/user.interceptor';

@Injectable()
export class RouteInterceptor implements HttpInterceptor {
  constructor(
    private userInterceptor: UserInterceptor,
    private adminInterceptor: AdminInterceptor
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url.toLowerCase();
    if (url.includes('/admin')) {
      return this.adminInterceptor.intercept(req, next);
    } else {
      return this.userInterceptor.intercept(req, next);
    }
  }
}
