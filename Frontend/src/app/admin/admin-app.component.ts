// angular import
import { Component, NgZone } from '@angular/core';
import { MantisConfig } from 'src/app/app-config';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './admin-app.component.html',
  styleUrls: ['./admin-app.component.scss']
})
export class AdminAppComponent {
  navCollapsed;
  navCollapsedMob: boolean;
  windowWidth: number;

  constructor(private translate: TranslateService) {
    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1024 ? MantisConfig.isCollapseMenu : false;
    this.navCollapsedMob = false;
    var language = localStorage.getItem("admin_language");
    if(language){
      this.translate.setDefaultLang(language);
    }else{
      this.translate.setDefaultLang('en');
    }
  }

  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.coded-navbar').classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }
}
