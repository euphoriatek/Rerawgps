import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { ToasterService } from 'src/app/services/toster.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  defaultLanguage: string;
  Username:any;
    constructor(private translate: TranslateService,public toaster:ToasterService,public cookie:AdminCookiesService,public route:Router){
      this.defaultLanguage = localStorage.getItem('admin_language') ?? 'en';
      this.Username = this.cookie.getCookie('AdminUser')?.username;
    }
  // public method
  profile = [
    {
      icon: 'ti ti-edit-circle',
      title: 'Edit Profile'
    },
    // {
    //   icon: 'ti ti-user',
    //   title: 'View Profile'
    // },
    // {
    //   icon: 'ti ti-clipboard',
    //   title: 'Social Profile'
    // },
    // {
    //   icon: 'ti ti-edit-circle',
    //   title: 'Billing'
    // },
    // {
    //   icon: 'ti ti-power',
    //   title: 'Logout',
    //   url: '/admin/admin-logout',
    // }
  ];

  setting = [
    {
      icon: 'ti ti-help',
      title: 'Support'
    },
    {
      icon: 'ti ti-user',
      title: 'Account Settings'
    },
    {
      icon: 'ti ti-lock',
      title: 'Privacy Center'
    },
    {
      icon: 'ti ti-messages',
      title: 'Feedback'
    },
    {
      icon: 'ti ti-list',
      title: 'History'
    }
  ];
  switchLanguage(event) {
    const selectedLanguage = event.value;
    this.translate.use(selectedLanguage);
    localStorage.setItem("admin_language", selectedLanguage);
  }

  logOut(){
    sessionStorage.clear();
    localStorage.clear();
    this.cookie.deleteCookieAll();
    this.cookie.deleteCookie('AdminUser');
    this.toaster.success("Logout successfully!", "Logout");
    this.route.navigate(['/admin/login']);
  }
}
