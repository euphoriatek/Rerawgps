// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UserCookiesService } from 'src/app/user/services/usercookies.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from 'src/app/user/services/api.service';
import { ToasterService } from 'src/app/services/toster.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslateModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  LoginForm!: FormGroup;
  defaultLanguage: any;
  submitted = true;
  constructor(public cookiesService: UserCookiesService, public route: Router, public fb: FormBuilder, private translate: TranslateService, public spinner: NgxSpinnerService,
    public api: ApiService, public toaster: ToasterService,private titleService: Title
  ) {

  }
  ngOnInit(): void {
    this.titleService.setTitle('RegayKar | Login');
    this.LoginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
    this.defaultLanguage = localStorage.getItem('user_language') ?? 'en';
  }

  Login(): void {
    this.submitted = true;
    this.spinner.show();
    if (this.LoginForm.invalid) {
      this.LoginForm.markAllAsTouched();
      this.spinner.hide();
      return;
    } else if (this.LoginForm.valid) {
      const data = this.LoginForm.value;
      this.api.login(data).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.submitted = false;
          if (response && response.status) {
            const UserInfo = response.data;
            this.cookiesService.setCookie('CurrentUser', UserInfo);
            this.route.navigate(['/dashboard/default']);
            this.toaster.success(this.translate.instant('login_success'), this.translate.instant('login'));
          } else {
            this.toaster.error(this.translate.instant('inactive_account') || this.translate.instant('login_failed'), this.translate.instant('login'));
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.submitted = false;
          this.toaster.error(this.translate.instant('invalid_user_password'), this.translate.instant('login'));
          console.error(err);
        }
      });
    }
  }

  switchLanguage(event) {
    const selectedLanguage = event.value;
    this.translate.use(selectedLanguage);
    localStorage.setItem("user_language", selectedLanguage);
  }
}
