import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  UserForm!: FormGroup;
  isSubmitted = false;
  constructor(public route: Router, public fb: FormBuilder, public spinner: NgxSpinnerService, public api: ApiService, public cookiesService: AdminCookiesService, public toaster: ToasterService) {

  }
  ngOnInit(): void {
    this.UserForm = this.fb.group({
      domain_name: ['', [Validators.required]],
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
            this.toaster.success(response.message, 'User');
            this.spinner.hide();
            this.isSubmitted = false;
          } else {
            this.toaster.error(response.message || 'Try again!', 'User');
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.isSubmitted = false;
          this.toaster.error('An error occurred while adding in', 'User');
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
