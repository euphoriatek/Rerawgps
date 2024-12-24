import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-add-sales-agent',
  templateUrl: './add-sales-agent.component.html',
  styleUrls: ['./add-sales-agent.component.scss']
})
export class AddSalesAgentComponent {
  UserForm!: FormGroup;
  isSubmitted = false;
  usersData: any;
  constructor(public route: Router, public fb: FormBuilder, public spinner: NgxSpinnerService, public api: ApiService, public cookiesService: AdminCookiesService, public toaster: ToasterService,private translate: TranslateService) {

  }
  ngOnInit(): void {
    this.UserForm = this.fb.group({
      user: ['', [Validators.required]],
      api_key:['', [Validators.required]],
      username:['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
        ],
      ],
      mobile_number: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{10}$/),
        ],
      ],
      address: ['', Validators.required],
    });
    this.getUsers();
  }

  getUsers(){
    this.spinner.show();
    this.api.getUsers().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          this.usersData = response.data;
          this.spinner.hide();
        }else{
          this.spinner.hide();
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err); 
      }
    });
  }
  addUser(): void {
    if (this.UserForm.invalid) {
      this.isSubmitted = true;
      this.UserForm.markAllAsTouched();
      this.spinner.hide();
      return;
    }else if(this.UserForm.valid){
      this.spinner.show();
      const data = this.UserForm.value;
      this.api.addUser(data).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            this.route.navigate(['/admin/dashboard/default']);
            this.toaster.success(this.translate.instant('user_added_success'), this.translate.instant('user'));
            this.spinner.hide();
            this.isSubmitted = false;
          } else {
            this.toaster.error(this.translate.instant('user_added_error') || this.translate.instant('try_again'), this.translate.instant('user'));
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.isSubmitted = false;
          this.toaster.error(this.translate.instant('user_added_error_ex') || this.translate.instant('try_again'), this.translate.instant('user'));
          console.error(err);
        }
      });
    }else{
      this.UserForm.markAllAsTouched();
    }
  }

  resetForm(){
    this.UserForm.reset();
  }
}
