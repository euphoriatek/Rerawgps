import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { access } from 'fs';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent {
  AdminUsr!: FormGroup;
  isSubmitted = false;
  showAddUser:boolean=true;
  visible: boolean = false;
  server_options:any;
  adminData:any;
  constructor(public route: Router, public fb: FormBuilder, public spinner: NgxSpinnerService, public api: ApiService, public cookiesService: AdminCookiesService, public toaster: ToasterService,private translate: TranslateService) {

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
      // console.log(data);
      this.api.addAdminUser(data).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            this.getServers();
            this.AdminUsr.reset();
            this.toaster.success(this.translate.instant('user_added_success'), this.translate.instant('server'));
            this.spinner.hide();
            this.isSubmitted = false;
            this.showAddUser = false;
          } else {
            this.toaster.error(this.translate.instant('user_added_error') || this.translate.instant('try_again'), this.translate.instant('server'));
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.isSubmitted = false;
          this.toaster.error(this.translate.instant('user_added_error_ex') || this.translate.instant('try_again'), this.translate.instant('server'));
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
          // console.log(response.data);
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
          console.log(response.data);
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
}
