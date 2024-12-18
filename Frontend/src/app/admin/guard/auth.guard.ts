import { CanActivateFn, Router } from '@angular/router';
import { AdminCookiesService } from '../services/admincookies.service';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  let userCookieService = inject(AdminCookiesService);
  let _router = inject(Router);
  if(userCookieService.checkCookie('AdminUser')){
    return true;
  } else{
    _router.navigate(['/admin/login']);
    return false;
  }
};