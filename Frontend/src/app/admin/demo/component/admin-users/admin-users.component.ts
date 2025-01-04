import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { access } from 'fs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/admin/services/confirm-dialog.component';  

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent {
  AdminUsr!: FormGroup;
  isSubmitted = false;
  showAddUser:boolean=false;
  visible: boolean = false;
  server_options:any;
  adminData:any;
  edit_data: any;
  usersData:any;
  constructor(public route: Router,private dialog: MatDialog, public fb: FormBuilder, public spinner: NgxSpinnerService, public api: ApiService, public cookiesService: AdminCookiesService, public toaster: ToasterService,private translate: TranslateService) {

  }
  ngOnInit(): void {
    this.AdminUsr = this.fb.group({
      server_id: ['', [Validators.required]],
      name:['', [Validators.required]],
      username:['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
        ],
      ],
    });
    this.getServers();
    this.adminUsers();
  }
  showDialog() {
    this.visible = true;
}

addUser(): void {
    if (this.AdminUsr.invalid) {
      this.isSubmitted = true;
      this.AdminUsr.markAllAsTouched();
      this.spinner.hide();
      return;
    }else if(this.AdminUsr.valid){
      this.spinner.show();
      const data = this.AdminUsr.value;
      this.api.addAdminUser(data).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            this.getServers();
            this.adminUsers();
            this.AdminUsr.reset();
            this.toaster.success(this.translate.instant('user_added_success'), this.translate.instant('user'));
            this.spinner.hide();
            this.isSubmitted = false;
            this.showAddUser = false;
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
      this.AdminUsr.markAllAsTouched();
    }
  }

  getServers(){
    this.api.getServers().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.server_options = response.data;

        } else {
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  adminUsers(){
    this.api.getAdminUsers().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.adminData = response.data;
        } else {
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  resetForm(){
    this.AdminUsr.reset();
  }

  addAdminUsr(){
    this.showAddUser = true;
  }

  getUrl(data:any){
    const serverUrls = data.map(server => server.server.server_url).join(", ");
    return serverUrls;
  }

  openEditDialog(data: any) {
    this.edit_data = data;
    const serverIds = data.assigned_servers?.map(server => server.server_id) || [];
    if (this.server_options && this.server_options.length > 0) {
      this.AdminUsr.patchValue({
        server_id: serverIds,  
        name: data.name,
        username: data.username
      });
      this.visible = true;
    } else {
      this.getServers();
      this.visible = false;
    }
  }
  
  
  editUser(): void {
    if (this.AdminUsr.invalid) {
      this.isSubmitted = true;
      this.AdminUsr.markAllAsTouched();
      this.spinner.hide();
      return;
    } else if (this.AdminUsr.valid) {
      this.spinner.show();
      const data = this.AdminUsr.value;
      this.api.editAdminUser(this.edit_data.id, data).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            this.getServers();
            this.adminUsers();  
            this.AdminUsr.reset(); 
            this.toaster.success(this.translate.instant('user_updated_success'), this.translate.instant('user'));
            this.spinner.hide();
            this.isSubmitted = false;
            this.visible = false; 
          } else {
            this.toaster.error(this.translate.instant('user_updated_error') || this.translate.instant('try_again'), this.translate.instant('user'));
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.isSubmitted = false;
          this.toaster.error(this.translate.instant('user_updated_error_ex') || this.translate.instant('try_again'), this.translate.instant('user'));
          console.error(err);
        }
      });
    } else {
      this.AdminUsr.markAllAsTouched();
    }
  }
  
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
        this.isSubmitted = true;
        this.api.deleteAdminUser(data.id).subscribe({
          next: (response: any) => {
            if (response) {
              const index = this.usersData.indexOf(data);
              if (index !== -1) {
                this.usersData.splice(index, 1);
              }
              this.toaster.success(
                this.translate.instant('user_deleted_success'),
                this.translate.instant('user')
              );
              this.spinner.hide();
              this.isSubmitted = false;
            } else {
              this.toaster.error(
                this.translate.instant('user_deleted_error') ||
                  this.translate.instant('try_again'),
                this.translate.instant('user')
              );
              this.spinner.hide();
            }
          },
          error: (err) => {
            this.spinner.hide();
            this.isSubmitted = false;
            this.toaster.error(
              this.translate.instant('user_deleted_error_ex') ||
                this.translate.instant('try_again'),
              this.translate.instant('user')
            );
            console.error(err);
          },
        });
      }
    });
  }


}
