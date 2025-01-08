import { Component } from '@angular/core';
import { ApiService } from 'src/app/admin/services/api.service';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export default class DashboardComponent {
  serverCount: number = 0;
  adminUserCount: number = 0;
  userCount: number = 0;
  usersData: any;
  servers:any;
  role:string;
  constructor(private api: ApiService, public adminCookieService:AdminCookiesService) { }

  ngOnInit(): void {
    this.role = this.adminCookieService.getCookie('AdminUser')?.role;
    console.log(this.role);
    this.getUsers();
  }

  getUsers(): void {
    this.api.getServersList().subscribe({
      next: (response: any) => {
        console.log(response);
    
        if (response && response.status) {
          this.serverCount = response.serverCount;
          this.adminUserCount = response.adminUserCount;
          this.userCount = response.userCount;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }  
}
