import { Component, ViewChild } from '@angular/core';
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
  salesData: any;
  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.getSales();

  }

  getSales() {
    this.api.getSales(this.userId).subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.salesData = response.data.map((sale: any) => {
            sale.groupNames = this.getGroupNames(sale.groups);
            return sale;
          });
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getGroupNames(groups: any[]): string {
    const uniqueGroupNames = new Set(groups.map(group => group.group.name));
    return Array.from(uniqueGroupNames).join(', ');
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

}
