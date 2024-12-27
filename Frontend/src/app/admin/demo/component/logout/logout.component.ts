import { Component } from '@angular/core';
import { ApiService } from 'src/app/admin/services/api.service';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { ToasterService } from 'src/app/services/toster.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(public api:ApiService, public toaster:ToasterService,public cookie:AdminCookiesService,public route:Router){}

 ngOnInit(): void {
    this.Logout();
  }

  Logout(): void {
    this.api.logout().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          sessionStorage.clear();
          localStorage.clear();
          this.cookie.deleteCookie('AdminUser');
          this.toaster.error("Logout successfully!", "Logout");
          this.route.navigate(['/admin/login']);
          // this.route.navigate(['/admin/dashboard/default']);
        } else {
          this.toaster.error(response.message || 'Logout failed', 'Logout');
        }
      },
      error: (err) => {
      
      }
    });
  }
}
