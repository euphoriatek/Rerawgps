import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from 'src/app/admin/services/api.service';
import { TranslateModule } from '@ngx-translate/core'; 
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from "primeng/button"; 
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,CommonModule,TranslateModule,DialogModule,ButtonModule,ReactiveFormsModule ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export default class DashboardComponent implements OnInit {
  usersData:any;
  visible: boolean = false;
   UserEditForm!: FormGroup;
   isSubmitted = false;
   selectedUser: any;
  constructor(public spinner: NgxSpinnerService,public api:ApiService,private fb: FormBuilder,public toaster: ToasterService,private translate: TranslateService) {
  }
  ngOnInit(): void {
    this.UserEditForm = this.fb.group({
      site_url: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      mobile_number: ['', Validators.required],
      address: ['', Validators.required],
      api_key: ['', Validators.required]
    });
    this.getUsers();
  }

  getUsers(): void {
    this.spinner.show();
    this.api.getUserList().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          this.usersData = response.data;
          console.log(response);
        } else {
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err); 
      }
    });
  }

  openEditDialog(selectedUser: any): void {
    this.selectedUser = selectedUser;  
    this.UserEditForm.patchValue({
      site_url: selectedUser.site_url,
      email: selectedUser.email,
      username: selectedUser.username,
      password: selectedUser.password,
      mobile_number: selectedUser.mobile_number,
      address: selectedUser.address,
      api_key: selectedUser.api_key
    });  
    this.visible = true;
  }
  
  closeDialog(): void {
    this.visible = false;
  }
  
  EditUser(): void {
    if (this.UserEditForm.invalid) {
      this.isSubmitted = true;
      this.UserEditForm.markAllAsTouched();
      return;
    }
    if (this.UserEditForm.valid) {
      this.spinner.show();
      const data = this.UserEditForm.value;
      this.api.updateUser(this.selectedUser.id, data).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.getUsers();
            this.toaster.success(this.translate.instant('edit_updated_success'), this.translate.instant('user'));
            this.visible = false;
            this.spinner.hide();
            this.isSubmitted = false;
          } else {
            this.toaster.error(this.translate.instant('edit_updated_error') || this.translate.instant('try_again'), this.translate.instant('user'));
            this.spinner.hide();
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.isSubmitted = false;
          this.toaster.error(
            this.translate.instant('edit_updated_error_ex') || this.translate.instant('try_again'),
            this.translate.instant('user')
          );
          console.error(err);
        }
      });
    }
  }
  resetForm(){
    this.UserEditForm.reset();
  }

  deleteRow(data: any): void {
    this.spinner.show();
    this.isSubmitted = true;

    this.api.deleteUser(data.id).subscribe({
        next: (response: any) => {
            if (response.status) {
                const index = this.usersData.indexOf(data);
                if (index !== -1) {
                    this.usersData.splice(index, 1); 
                }
                this.toaster.success(this.translate.instant('user_deleted_success'), this.translate.instant('user'));
                this.spinner.hide();
                this.isSubmitted = false;
            } else {
                this.toaster.error(
                    this.translate.instant('user_deleted_error') || this.translate.instant('try_again'),
                    this.translate.instant('user')
                );
                this.spinner.hide();
                this.isSubmitted = false;
            }
        },
        error: (err) => {
            this.spinner.hide();
            this.isSubmitted = false;
            this.toaster.error(
                this.translate.instant('user_deleted_error_ex') || this.translate.instant('try_again'),
                this.translate.instant('user')
            );
            console.error(err);
        }
    });
  }  
}
