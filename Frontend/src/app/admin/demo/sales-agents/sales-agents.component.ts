import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

import { Table } from 'primeng/table';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-sales-agents',
  templateUrl: './sales-agents.component.html',
  styleUrls: ['./sales-agents.component.scss']
})
export class SalesAgentsComponent {
  salesData:any;
  users:any;
  role:string;
  // @ViewChild('dt') table: Table;
  @ViewChild('dt') dt: Table | undefined;
  constructor(public route: Router,private dialog: MatDialog,public fb: FormBuilder, public spinner: NgxSpinnerService, public api: ApiService, public cookiesService: AdminCookiesService, public toaster: ToasterService,private translate: TranslateService,private primengConfig: PrimeNGConfig) {
    this.role = this.cookiesService.getCookie('AdminUser').role;
  }
  ngOnInit(): void {
    if(this.role === "superadmin"){
      this.getSales();
    }else if(this.role === "admin"){
      this.getSalesAdmin();
    }
  }
  
  getSales(){
    this.spinner.show();
    this.api.getSalesList().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.salesData = response.data;
          this.users = response.data.map(item => item?.user?.username);
          this.spinner.hide();
        } else {
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  getSalesAdmin(){
    this.spinner.show();
    this.api.getAdminrSalesList().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.salesData = response.data;
          this.users = response.data.map(item => item.user.username);
          this.spinner.hide();
        } else {
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
}