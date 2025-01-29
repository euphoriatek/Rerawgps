import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ConfirmDialogComponent } from 'src/app/admin/services/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserCookiesService } from 'src/app/user/services/usercookies.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  usersData: any;
  visible: boolean = false;
  UserEditForm!: FormGroup;
  selectedUser: any;
  showAddUsers: boolean = false;
  UserForm!: FormGroup;
  server_options: any[] = [];
  customers: Customer[];
  servers: any;
  selectedCustomers: Customer[];
  @ViewChild('dt') dt: Table | undefined;
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private fb: FormBuilder,
    private toaster: ToasterService,
    private translate: TranslateService,
    public route: Router,
    private dialog: MatDialog,
    private cookiesService: UserCookiesService
  ) { }

  ngOnInit(): void {
    this.UserForm = this.fb.group({
      server_id: ['', [Validators.required]],
      api_key: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$')

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
    this.UserEditForm = this.fb.group({
      id: ['', [Validators.required]],
      server_id: ['', [Validators.required]],
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$')
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
      api_key: ['', Validators.required]
    });
    this.getServers();
    this.getUsers();
  }

  addUser(): void {
    if (this.UserForm.invalid) {
      this.UserForm.markAllAsTouched();
      this.spinner.hide();
      return;
    } else if (this.UserForm.valid) {
      this.spinner.show();
      const data = this.UserForm.value;
      this.api.addUser(data).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            this.showAddUsers = false;
            this.UserForm.reset();
            this.getUsers();
            this.toaster.success(this.translate.instant('user_added_success'), this.translate.instant('user'));
          } else {
            if (response){
              if(response.type == "username"){
                this.toaster.error(this.translate.instant('username_unique_error'), this.translate.instant('user'));
              }else if(response.type == "api_key"){
                this.toaster.error(this.translate.instant('api_key_unique_error'), this.translate.instant('user'));
              }else if(response.type == "invalid_key"){
                this.toaster.error(this.translate.instant('api_key_invalid_error'), this.translate.instant('user'));
              }else{
                this.toaster.error(this.translate.instant('user_added_error'), this.translate.instant('user'));
              }
            } else{
              this.toaster.error(this.translate.instant('user_added_error') || this.translate.instant('try_again'), this.translate.instant('user'));
            }
          }
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.toaster.error(this.translate.instant('user_added_error_ex') || this.translate.instant('try_again'), this.translate.instant('user'));
          console.error(err);
        }
      });
    } else {
      this.UserForm.markAllAsTouched();
    }
  }

  getServers() {
    this.api.getServers().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.server_options = response.data;
          console.log(this.server_options);

          this.servers = response.data.map(item => item.server_url);
          console.log(this.servers);
        } else {
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }
  getUsers(): void {
    this.spinner.show();
    this.api.getUserList().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          this.usersData = response.data;
          this.usersData.forEach(user => {
            console.log(user);
            user.server_url = user.server.server_url || 'No server URL available';
          });
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }
  openEditDialog(data: any): void {
    if (this.server_options && this.server_options.length > 0) {
      this.UserEditForm.patchValue({
        id: data.id,
        server_id: data.server.id,
        username: data.username,
        mobile_number: data.mobile_number,
        address: data.address,
        api_key: data.api_key
      });
      this.visible = true;
    } else {
      this.getServers();
      this.visible = false;
    }
  }


  // Edit user and save changes
  EditUser(): void {
    if (this.UserEditForm.invalid) {
      this.UserEditForm.markAllAsTouched();
      return;
    }
    if (this.UserEditForm.valid) {
      this.spinner.show();
      const data = this.UserEditForm.value;
      this.api.updateUser(data).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.visible = false;
            this.UserEditForm.reset();
            this.getUsers();
            this.toaster.success(this.translate.instant('user_updated_success'), this.translate.instant('user'));
          } else {
            this.toaster.error(this.translate.instant('user_updated_error') || this.translate.instant('try_again'), this.translate.instant('user'));
          }
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.toaster.error(
            this.translate.instant('user_updated_error_ex') || this.translate.instant('try_again'),
            this.translate.instant('user')
          );
          console.error(err);
        }
      });
    }
  }

  // Reset form
  resetForm(): void {
    this.UserForm.reset();
  }

  // Delete user
  deleteRow(data: any): void {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('Delete_confirmation'),
        message: this.translate.instant('are_you_sure_want_to_delete'),
      },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.api.deleteUser(data.id).subscribe({
          next: (response: any) => {
            if (response.status) {
              this.getUsers();
              this.toaster.success(this.translate.instant('user_deleted_success'), this.translate.instant('user'));
            } else {
              this.toaster.error(this.translate.instant('user_deleted_error') || this.translate.instant('try_again'), this.translate.instant('user'));
            }
            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
            this.toaster.error(this.translate.instant('user_deleted_error_ex') || this.translate.instant('try_again'), this.translate.instant('user'));
            console.error(err);
          }
        });
      }
    });
  }
  addUsers() {
    this.showAddUsers = true;
  }
  closeForm(){
    this.showAddUsers = false;
  }
  // Close dialog
  closeDialog(): void {
    this.visible = false;
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  updateStatus(user_id: number) {
    this.api.updateStatus(user_id).subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.toaster.success(this.translate.instant('user_updated_success'), this.translate.instant('user'));
        } else {
          this.toaster.error(this.translate.instant('try_again'), this.translate.instant('user'));
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.toaster.error(this.translate.instant('try_again'), this.translate.instant('user'));
        console.error(err);
      }
    });
  }

loginAsUser(data:any){
    this.api.loginAsUser(data.id).subscribe({
      next: (response: any) => {
        if (response && response.status) {
          const UserInfo = response.data;
          this.cookiesService.setCookie('CurrentUser', UserInfo);
          // this.route.navigate(['/dashboard/default']);
          window.open('/dashboard/default', '_blank');
          this.toaster.success(this.translate.instant('login_success'), this.translate.instant('login'));
        } else {
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.toaster.error(this.translate.instant('try_again'), this.translate.instant('user'));
        console.error(err);
      }
    });
  }
}


export interface Server {
  server_url: string;
}
export interface Customer {
  id?: number;
  server: Server;
  username?: string;
  mobile_number?: string;
  address?: string;
  api_key?: string;
  created_at?: string;
}