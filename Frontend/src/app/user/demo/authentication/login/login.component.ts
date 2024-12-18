// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { UserCookiesService } from 'src/app/user/services/usercookies.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  loginForm!: FormGroup;
  constructor(public cookiesService:UserCookiesService, public route:Router,public fb:FormBuilder){

  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  Login(event: Event): void {
    event.preventDefault();  // Prevents
    console.log("545454");
    this.cookiesService.setCookie('CurrentUser', "abc");
    this.route.navigate(['/']);
  }
}
