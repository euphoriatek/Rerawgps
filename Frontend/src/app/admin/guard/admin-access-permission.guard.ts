import { CanActivateFn, Router } from '@angular/router';
import { AdminCookiesService } from '../services/admincookies.service';
import { inject } from '@angular/core';
export const accessPermissionGuardAdmin: CanActivateFn = (route, state) => {
    let userCookieService = inject(AdminCookiesService);
    let _router = inject(Router);
    if(userCookieService.checkCookie('AdminUser')){
      let role = userCookieService.getCookie('AdminUser')?.role;
      console.log(role);
      if(role === "admin"){
        return true;
      }else{
        _router.navigate(['/admin/dashboard/default']);
        return false;
      }
    } else{
      _router.navigate(['/admin/login']);
      return false;
    }
};
