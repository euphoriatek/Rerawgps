import { Component, ViewChild, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ApiService } from 'src/app/user/services/api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/services/toster.service';
import { UserCookiesService } from 'src/app/user/services/usercookies.service';

@Component({
  selector: 'app-pois',
  templateUrl: './pois.component.html',
  styleUrls: ['./pois.component.scss']
})
export class POIsComponent implements OnInit {
  isSubmitted = false;
  poisList: any;
  server_groups: any;
  groups: any;
  visible: boolean = false;
  addPoisForm!: FormGroup;

  @ViewChild('dt') dt: Table | undefined;
  constructor(
    private api: ApiService,
    public spinner: NgxSpinnerService,
    public toaster: ToasterService,
    public fb: FormBuilder,
    private userCookiesService: UserCookiesService
  ) { }
  ngOnInit(): void {
    this.getGroups();
    this.serverGroups();
    this.addPoisForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      map_icon_id: [9, [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      status:['approved']
    });
  }
  getGroups(): void {
    this.spinner.show();
    this.api.getGroupOptions().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.groups = response.data;
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }
  serverGroups() {
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

  syncData() {
    this.spinner.show();
    this.api.syncPois().subscribe({
      next: (response: any) => {
        this.getPois();
        // this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }
  getPois(filter = null): void {
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
  getLat(coordinates: any) {
    const data = JSON.parse(coordinates);
    return data.lat;
  }
  getLng(coordinates: any) {
    const data = JSON.parse(coordinates);
    return data.lng;
  }

  byServerGroup(server_id) {
    var filter = { server_grpid: server_id };
    this.getPois(filter);
  }

  byGroup(group_id) {
    var filter = { group_id: group_id };
    this.getPois(filter);
  }

  addPois() {
    this.visible = true;
  }
  poisForm(): void {
    try {
      if (this.addPoisForm.invalid) {
        this.addPoisForm.markAllAsTouched();
        return;
      }
      const user_id = this.userCookiesService.getCookie('CurrentUser')?.id;
      const formValue = this.addPoisForm.value;
      const requestData = {
        name: formValue.name,
        description: formValue.description,
        map_icon_id: parseInt(formValue.map_icon_id, 10),
        coordinates: {
          lat: parseFloat(formValue.lat),
          lng: parseFloat(formValue.lng)
        },
        regaykar_user_id: parseInt(user_id, 10),
        status: formValue.status
      };
      console.log(requestData);
      
      this.spinner.show();
      this.api.addPoi(requestData).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            this.toaster.success("Add Pois Suceessfully ");
            this.visible = false;
            this.addPoisForm.reset();
            this.getPois();
          } else {
            this.spinner.hide();
          }
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          console.error(err);
        }
      });
    } catch (error) {
      this.spinner.hide();
      console.error('An error occurred:', error);
    }
  }

}