import { CanActivateFn, Router } from '@angular/router';
import { AdminCookiesService } from '../services/admincookies.service';
import { inject } from '@angular/core';
export const unAuthGuard: CanActivateFn = (route, state) => {
    let userCookieService = inject(AdminCookiesService);
    let _router = inject(Router);
    if(userCookieService.checkCookie('AdminUser')) {
      _router.navigate(['/']);
      return false;
    }else{
      return true;
    }
};