import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from "ngx-spinner";
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations: { [key: string]: string } = {};

  constructor(private http: HttpClient, private translate: TranslateService, public spinner :NgxSpinnerService) {}

  // Fetch translations from your API and store them
  loadTranslations(language: string): Observable<any> {
    return this.http.get<any>(`http://127.0.0.1:8000/api/get-translation?code=${language}`);
  }

  // Set language and load translations
  setLanguage(language: string): void {
    this.spinner.show();
    this.loadTranslations(language).subscribe(
      (response) => {
        if (response.status) {
          // Store translations in a map for easy lookup
          this.translations = response.data.reduce((acc, translation) => {
            acc[translation.key_name] = translation.value;
            return acc;
          }, {});

          // Set the language in ngx-translate
          this.translate.use(language);

          // Manually add translations to ngx-translate
          this.translate.setTranslation(language, this.translations, true);
          this.spinner.hide();
        }
      },
      (error) => {
        console.error('Failed to load translations:', error);
      }
    );
  }

  // Get translation for a specific key
  getTranslation(key: string): string {
    return this.translations[key] || key;
  }
}
