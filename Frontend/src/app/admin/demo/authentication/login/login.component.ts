// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateModule } from '@ngx-translate/core'; 
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TranslateModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  LoginForm!: FormGroup;
  submitted = true;
  defaultLanguage:any;
  constructor(public route:Router,public fb:FormBuilder,public spinner :NgxSpinnerService,public api:ApiService,public cookiesService:AdminCookiesService, public toaster:ToasterService,private translate: TranslateService){

  }
  ngOnInit(): void {
    this.LoginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
    this.defaultLanguage = localStorage.getItem('admin_language') ?? 'en';
  }
    

  Login(): void {
    this.submitted = true;
    this.spinner.show();
    if (this.LoginForm.invalid) {
      this.LoginForm.markAllAsTouched();
      this.spinner.hide();
      return;
    }else if(this.LoginForm.valid){
      const data = this.LoginForm.value;
      this.api.login(data).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.submitted = false;
          if (response && response.status) {
            const AdminInfo = response.data;
            this.cookiesService.setCookie('AdminUser', AdminInfo);
            this.route.navigate(['/admin/dashboard/default']);
            this.toaster.success(this.translate.instant('login_success'), this.translate.instant('login'));
          } else {
            this.toaster.error(this.translate.instant('invalid_user_password') || this.translate.instant('login_failed'), this.translate.instant('login'));
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
    console.log(event.value);
    // const selectElement = event.target as HTMLSelectElement;
    const selectedLanguage = event.value;
    this.translate.use(selectedLanguage);
    localStorage.setItem("admin_language", selectedLanguage);
  }
  

}
