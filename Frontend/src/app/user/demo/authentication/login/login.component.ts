// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserCookiesService } from 'src/app/user/services/usercookies.service';
import { TranslateModule } from '@ngx-translate/core'; 
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule,TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  loginForm!: FormGroup;
  constructor(public cookiesService:UserCookiesService, public route:Router,public fb:FormBuilder,private translate: TranslateService){

  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  Login(event: Event): void {
    event.preventDefault();  // Prevents
    this.cookiesService.setCookie('CurrentUser', "abc");
    this.route.navigate(['/']);
  }

  switchLanguage(event) {
    const selectedLanguage = event.value;
    this.translate.use(selectedLanguage);
    localStorage.setItem("user_language", selectedLanguage);
  }
}
