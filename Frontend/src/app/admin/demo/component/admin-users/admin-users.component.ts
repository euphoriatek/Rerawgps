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
  ServerForm!: FormGroup;
  isSubmitted = false;
  servesData:any;
  showAddserver:boolean=false;
  constructor(public route: Router, public fb: FormBuilder, public spinner: NgxSpinnerService, public api: ApiService, public cookiesService: AdminCookiesService, public toaster: ToasterService,private translate: TranslateService) {

  }
  ngOnInit(): void {
    this.ServerForm = this.fb.group({
      name: ['', [Validators.required]],
      server_url:['', [Validators.required]],
      access_key:['', [Validators.required]]
    });
    this.getServers();
  }


  addServer(): void {
    if (this.ServerForm.invalid) {
      this.isSubmitted = true;
      this.ServerForm.markAllAsTouched();
      this.spinner.hide();
      return;
    }else if(this.ServerForm.valid){
      this.spinner.show();
      const data = this.ServerForm.value;
      this.api.addServer(data).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            this.getServers();
            this.ServerForm.reset();
            this.toaster.success(this.translate.instant('server_added_success'), this.translate.instant('server'));
            this.spinner.hide();
            this.isSubmitted = false;
            this.showAddserver = false;
          } else {
            this.toaster.error(this.translate.instant('server_added_error') || this.translate.instant('try_again'), this.translate.instant('server'));
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.isSubmitted = false;
          this.toaster.error(this.translate.instant('server_added_error_ex') || this.translate.instant('try_again'), this.translate.instant('server'));
          console.error(err);
        }
      });
    }else{
      this.ServerForm.markAllAsTouched();
    }
  }

  getServers(){
    this.api.getServers().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.servesData = response.data;
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
    this.ServerForm.reset();
  }

  addServerForm(){
    this.showAddserver = true;
  }
}
