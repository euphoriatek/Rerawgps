import { Component } from '@angular/core';
// import { TranslationService } from './services/translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    // Set initial language
    this.translate.setDefaultLang('en');
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
