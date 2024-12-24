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
  imei_number: string = '';
  expireStatus: boolean = false;
  
  constructor(public route: Router, public fb: FormBuilder, public spinner: NgxSpinnerService, public api: ApiService, public cookiesService: AdminCookiesService, public toaster: ToasterService,private translate: TranslateService) {

  }
  ngOnInit(): void {
    this.UserForm = this.fb.group({
      user: ['', [Validators.required]],
      imei:['', [Validators.required]],
      name:['', [Validators.required]],
      expires:[''],
      expires_at:[''],
    });
    this.getUsers();
    this.generateIMEI();
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

  generateIMEI() {
    // Generate a random 15-digit IMEI number
    this.imei_number = this.generateRandomIMEI();
    // Set the IMEI value in the form control
    this.UserForm.controls['imei'].setValue(this.imei_number);
  }

  generateRandomIMEI(): string {
    let imei_number = '';
    for (let i = 0; i < 15; i++) {
      imei_number += Math.floor(Math.random() * 10).toString();
    }
    return imei_number;
  }

  resetForm(){
    this.UserForm.reset();
  }
}
