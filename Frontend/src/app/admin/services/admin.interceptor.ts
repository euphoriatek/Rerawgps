import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AdminCookiesService } from './admincookies.service';
import { ToasterService } from 'src/app/services/toster.service';


@Injectable()
export class AdminInterceptor implements HttpInterceptor {
  private isUnauthorizedHandled: boolean = false;
  constructor(private userCookies: AdminCookiesService, private router: Router, public toastr:ToasterService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const urlSegments = request.url.split('/');
    const lastSegment = urlSegments[urlSegments.length - 1];
    if (lastSegment !== 'login') {
      const authToken = this.userCookies.getCookie('AdminUser')?.token;
      if (authToken) {
        const authRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`
          }
        });
        return next.handle(authRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !this.isUnauthorizedHandled) {
              this.isUnauthorizedHandled = true;
              this.logOut();
            }
            return throwError(error);
          }),
          finalize(() => {
          })
        );
      }
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isUnauthorizedHandled) {
          this.router.navigate(['/login']);
        }
        return throwError(error);
      }),
      finalize(() => {

      })
    );
  }

  logOut(){
      sessionStorage.clear();
      localStorage.clear();
      this.userCookies.deleteCookie('AdminUser');
      this.toastr.error("Session has been expired please login!", "Logout");
      this.router.navigate(['/admin/login']);
  }
}
