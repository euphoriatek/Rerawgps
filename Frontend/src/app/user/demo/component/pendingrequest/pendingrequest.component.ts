import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ApiService } from 'src/app/user/services/api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/services/toster.service';
@Component({
  selector: 'app-pendingrequest',
  templateUrl: './pendingrequest.component.html',
  styleUrls: ['./pendingrequest.component.scss']
})
export class PendingRequestComponent {
  pendingPois: any[] = [];
   poisForm: FormGroup;
    isSubmitted = false;
    today: Date;
    showgroup: boolean = false;
    usersData: any[] = [];
    visible: boolean = false;
  @ViewChild('dt') dt: Table | undefined;
  constructor(private api: ApiService, public spinner: NgxSpinnerService, private translate: TranslateService,public toaster: ToasterService,) { }

  ngOnInit(): void {
    this.loadPendingPois();
  }
  loadPendingPois(): void {
    this.spinner.show();
    this.api.getPendingPois().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          console.log(response);
          this.pendingPois = response.data;
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
