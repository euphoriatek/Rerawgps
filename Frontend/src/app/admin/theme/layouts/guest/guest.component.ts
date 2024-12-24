import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent {
  constructor(private translate: TranslateService){
    var language = localStorage.getItem("admin_language");
    if(language){
      this.translate.setDefaultLang(language);
    }else{
      this.translate.setDefaultLang('en');
    }
  }
}
