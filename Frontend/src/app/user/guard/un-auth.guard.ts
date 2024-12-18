import { CanActivateFn, Router } from '@angular/router';
import { UserCookiesService } from '../services/usercookies.service';
import { inject } from '@angular/core';
export const unAuthGuard: CanActivateFn = (route, state) => {
    let userCookieService = inject(UserCookiesService);
    let _router = inject(Router);
    if(userCookieService.checkCookie('CurrentUser')) {
      _router.navigate(['/']);
      return false;
    }else{
      return true;
    }
};