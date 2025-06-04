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
  server_groups:any;
  groups:any;
  @ViewChild('dt') dt: Table | undefined;
  constructor(
    private api: ApiService,
    public spinner: NgxSpinnerService,
    public toaster: ToasterService
  ) { }
  ngOnInit(): void {
    this.getGroups();
    this.serverGroups();
    
    // this.syncData();
  }

  getGroups(): void {
    this.spinner.show();
    this.api.getGroupOptions().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.groups = response.data;
          console.log(this.groups);
        }
        // this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }
  serverGroups(){
    this.spinner.show();
    this.api.getServerGroup().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.server_groups = response.data;
        }
        this.getPois();
        // this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  syncData(){
    this.spinner.show();
    this.api.syncPois().subscribe({
      next: (response: any) => {
        console.log(response);
        
        this.getPois();
        // this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }
  getPois(filter=null): void {
    this.spinner.show();
    this.api.getAllPois(filter).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          this.poisList = response.data;
          this.poisList = response.data.map(poi => ({
              ...poi,
              lat: this.getLat(poi.coordinates),
              lng: this.getLng(poi.coordinates),
              groupNames: Array.from(new Set(poi.groups.map(group => group.group ? group.group.name : null).filter(name => name))).join(', ')
              // groupNames: poi.groups.map(group => group.group ? group.group.name : null).filter(name => name).join(', ')
            }));
            // this.groups = [
            //   ...new Set(
            //     response.data
            //       .flatMap(item => item.groups
            //         .map(group => group.group?.name)
            //         .filter(name => name?.trim() !== '')
            //       )
            //   )
            // ];
            // this.server_groups = [...new Set(this.poisList.map(item => item.group_name).filter(group_name => group_name?.trim() !== '' && group_name != null))];
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

  byServerGroup(server_id){
    var filter = {server_grpid:server_id};
    this.getPois(filter);
  }

  byGroup(group_id){
    var filter = {group_id:group_id};
    this.getPois(filter);
  }


}