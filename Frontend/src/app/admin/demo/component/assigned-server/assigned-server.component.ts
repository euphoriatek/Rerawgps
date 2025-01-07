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
  selector: 'app-assigned-server',
  templateUrl: './assigned-server.component.html',
  styleUrls: ['./assigned-server.component.scss']
})
export class AssignedServerComponent {
  servesData:any;
  customers: Customer[];
  selectedCustomers: Customer[];

  // @ViewChild('dt') table: Table;
  @ViewChild('dt') dt: Table | undefined;
  constructor(public route: Router,private dialog: MatDialog,public fb: FormBuilder, public spinner: NgxSpinnerService, public api: ApiService, public cookiesService: AdminCookiesService, public toaster: ToasterService,private translate: TranslateService,private primengConfig: PrimeNGConfig) {

  }
  ngOnInit(): void {
    this.getServers();
  }
  
  getServers(){
    this.spinner.show();
    this.api.getAdminServers().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.servesData = response.data.map(item => item.server);
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
export interface Customer {
  id?: number;
  name?: string;
  server_url?: string;
  created_at?: string;
}