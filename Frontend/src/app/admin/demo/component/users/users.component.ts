import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from "primeng/button"; 
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule, DialogModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usersData: any;
  visible: boolean = false;
  UserEditForm!: FormGroup;
  isSubmitted = false;
  selectedUser: any;

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private fb: FormBuilder,
    private toaster: ToasterService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.UserEditForm = this.fb.group({
      server_id: ['', [Validators.required]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      mobile_number: ['', Validators.required],
      address: ['', Validators.required],
      api_key: ['', Validators.required]
    });
    this.getUsers();
  }

  // Fetch all users
  getUsers(): void {
    this.spinner.show();
    this.api.getUserList().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          this.usersData = response.data;
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  // Open edit dialog for selected user
  openEditDialog(selectedUser: any): void {
    this.selectedUser = selectedUser;
    this.UserEditForm.patchValue({
      server_id: selectedUser.server_id,
      username: selectedUser.username,
      mobile_number: selectedUser.mobile_number,
      address: selectedUser.address,
      api_key: selectedUser.api_key
    });
    this.visible = true;
  }

  // Close dialog
  closeDialog(): void {
    this.visible = false;
  }

  // Edit user and save changes
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

  // Reset form
  resetForm(): void {
    this.UserEditForm.reset();
  }

  // Delete user
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
          this.toaster.error(this.translate.instant('user_deleted_error') || this.translate.instant('try_again'), this.translate.instant('user'));
          this.spinner.hide();
          this.isSubmitted = false;
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.isSubmitted = false;
        this.toaster.error(this.translate.instant('user_deleted_error_ex') || this.translate.instant('try_again'), this.translate.instant('user'));
        console.error(err);
      }
    });
  }
  
}
