import { Component, ViewChild, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ApiService } from 'src/app/user/services/api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/services/toster.service';

@Component({
  selector: 'app-pois',
  templateUrl: './pois.component.html',
  styleUrls: ['./pois.component.scss']
})
export class POIsComponent implements OnInit {
  isSubmitted = false;
  poisList:any;
  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private api: ApiService,
    public spinner: NgxSpinnerService,
    public toaster: ToasterService
  ) { }

  ngOnInit(): void {
    this.getPois();
  }
  getPois(): void {
    this.spinner.show();
    this.api.getAllPois().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          this.poisList = response.data;
          this.poisList = response.data.map(poi => ({
              ...poi,
              lat: this.getLat(poi.coordinates),
              lng: this.getLng(poi.coordinates),
          }));
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
  getLat(coordinates:any){
    const data = JSON.parse(coordinates);
    return data.lat;
  }
  getLng(coordinates:any){
    const data = JSON.parse(coordinates);
    return data.lng;
  }
}
