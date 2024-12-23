// angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { ApiService } from 'src/app/admin/services/api.service';
import { TranslateModule } from '@ngx-translate/core'; 
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule,CommonModule,TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export default class DashboardComponent implements OnInit {
  usersData:any;
  // constructor
  constructor(public spinner: NgxSpinnerService,public api:ApiService) {
  }
  // life cycle event
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.spinner.show();
    this.api.getUserList().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          this.usersData = response.data;
          console.log(response);
        } else {
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err); 
      }
    });
  }
}
