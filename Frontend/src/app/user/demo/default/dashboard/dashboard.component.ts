// angular import
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/user/services/api.service';
// project import
import tableData from 'src/fake-data/default-data.json';
import { SharedModule } from 'src/app/user/theme/shared/shared.module';

// bootstrap import
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
@Component({   
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, SharedModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export default class DashboardComponent implements OnInit {
  salesData: any;
  // constructor
  constructor(public spinner: NgxSpinnerService, public api: ApiService,private titleService: Title) {
  }
  // life cycle event
  ngOnInit(): void {
    this.titleService.setTitle('RegayKar | Dashboard');
  }
}
