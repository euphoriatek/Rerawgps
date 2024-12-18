import { CanActivateFn, Router } from '@angular/router';
import { UserCookiesService } from '../services/usercookies.service';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  let userCookieService = inject(UserCookiesService);
  let _router = inject(Router);
  if(userCookieService.checkCookie('CurrentUser')){
    return true;
  } else{
    console.log("54545");
    _router.navigate(['/login']);
    return false;
  }
};