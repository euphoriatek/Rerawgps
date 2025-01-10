import { Component } from '@angular/core';
import { ApiService } from 'src/app/user/services/api.service';

@Component({
  selector: 'app-pendingrequest',
  templateUrl: './pendingrequest.component.html',
  styleUrls: ['./pendingrequest.component.scss']
})
export class PendingRequestComponent {
  pendingPois: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadPendingPois();
  }

  loadPendingPois(): void {

    this.api.getGroupList().subscribe({
      next: (response: any) => {
      
        if (response && response.status) {
          console.log(response);
          this.pendingPois = response.data;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
