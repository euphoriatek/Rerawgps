import { Component,OnInit ,ViewChild} from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from 'src/app/user/services/api.service';
import { DatashareService } from 'src/app/user/services/datashare.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit{
  groupsData: any[] = [];
  historyData: any;
    @ViewChild('dt') dt: Table | undefined;
    constructor(
          public spinner: NgxSpinnerService,
          public api: ApiService,
          public route: Router,
          private dataShareService:DatashareService
         ) { }

  ngOnInit(): void {
    this.getHistory();
  }
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  getHistory(): void {
    this.spinner.show();
    this.api.getHistory().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.historyData=response.data;
          this.historyData.forEach((data: any) => {
            data.pois = data.pois.map((poi: any) => poi.name).join(', ');
        });        
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  ReActivePlan(data:any){
    this.dataShareService.updateData(data);
    this.route.navigate(['/regaykar-plans']);
  }

}
