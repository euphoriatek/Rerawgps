import { Component,ViewChild } from '@angular/core';
import { ApiService } from 'src/app/user/services/api.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-sales-agents-view',
  templateUrl: './sales-agents-view.component.html',
  styleUrls: ['./sales-agents-view.component.scss']
})
export class SalesAgentsViewComponent {
 @ViewChild('dt') dt: Table | undefined;
  userId: any;
  salesData:any;
    constructor(
      private api: ApiService
    ) { }
    
    ngOnInit(): void {
      this.getSales();

      }
  getSales(){
  
    this.api.getSales(this.userId).subscribe({
      next: (response: any) => {
        console.log(response);
        
        if (response && response.status) {
          this.salesData = response.data;
        } else {
        }
       
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

}
