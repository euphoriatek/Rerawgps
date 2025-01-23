import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ApiService } from 'src/app/user/services/api.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-sales-agents-view',
  templateUrl: './sales-agents-view.component.html',
  styleUrls: ['./sales-agents-view.component.scss']
})
export class SalesAgentsViewComponent {
  @ViewChild('dt') dt: Table | undefined;
  salesData: any;
  constructor(
    private api: ApiService,
    public spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getSales();
  }
  getSales() {
    this.spinner.show();
    this.api.getSales().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          if(response.status){
            this.salesData = response.data;
            // this.salesData = response.data.map((sale: any) => {
            //   sale.groupnames = this.getGroupNames(sale.group);
            //   return sale;
            // });
          }
          this.spinner.hide();
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  getGroupNames(groups: any[]): string {
    const uniqueGroupNames = new Set(groups.map(group => group.name));
    return Array.from(uniqueGroupNames).join(', ');
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

}
