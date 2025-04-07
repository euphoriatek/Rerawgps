import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserCookiesService } from 'src/app/user/services/usercookies.service';
import { ToasterService } from 'src/app/services/toster.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from 'src/app/user/services/api.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Renderer2 } from '@angular/core'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {

  defaultLanguage: string;
  poisList: any;
  Username: any;
  visible: boolean = false;
  reportForm: FormGroup;
  devices: any;
  formattedPoisList: any;
  times: string[] = [];
  selectedDeviceIds: number[] = [];
  selectedPoiIds: number[] = [];
  types_options:any[]=[];
  groupsData:any;
  serverGroupsData:any;
  
  period: any = ["Today", "Yesterday", "Before 2 days", "Before 3 days", "This week", "Last week", "This month", "Last month"];
  today: Date;
  deviceForm = new FormGroup({
    device: new FormControl([])
  });
  constructor(private translate: TranslateService, public toaster: ToasterService, public cookie: UserCookiesService, public route: Router, private fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public api: ApiService,
    private renderer: Renderer2
  ) {
    this.defaultLanguage = localStorage.getItem('user_language') ?? 'en';
    this.Username = this.cookie.getCookie('CurrentUser')?.username;
  }

  ngOnInit() {
    this.today = new Date();
    this.getDevice();
    this.getPois();
    this.generateTimeSlots();
    this.getGroups();
    this.serverGroups();
    // this.getTypes();
    const currentDate = this.formatDateWithoutTime(new Date());

    this.reportForm = this.fb.group({
      title: ['Visiting POIs'],
      period: [''],
      device: ['', Validators.required],
      pois: ['', Validators.required],
      dateFrom: [currentDate],
      fromTime: ['00:00'],
      dateTo: [currentDate],
      toTime: ['23:59'],
      distanceTolerance:['20', Validators.required],
      filter_by_group:[''],
      filter_by_server_group:[''],
      // type:['', Validators.required]
    });
    this.setDatesByPeriod();
  }
  
  getGroups(): void {
    this.spinner.show();
    this.api.getGroupPois().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.groupsData = response.data;
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  serverGroups(){
    this.spinner.show();
    this.api.getServerGroupPois().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.serverGroupsData = response.data;
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  periodChanged() {
    this.setDatesByPeriod();
  }

  getDevice() {
    this.spinner.show();
    this.api.getDevice().subscribe({
      next: (response: any) => {
        if (response && response.status && response.data && Array.isArray(response.data) && response.data.length > 0) {
          this.devices = response.data[0]?.items || [];
        }
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error fetching devices:', err);
        this.spinner.hide();
      }
    });
  }

  generateTimeSlots(): void {
    const timesArray: string[] = [];

    // Loop through each hour and minute
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = this.formatTime(hour, minute);
        timesArray.push(time);
      }
    }
    const lastTime = this.formatTime(23, 59);
    if (!timesArray.includes(lastTime)) {
      timesArray.push(lastTime);
    }

    this.times = timesArray;
  }

  // Helper function to format the time into HH:mm format
  private formatTime(hour: number, minute: number): string {
    const hh = hour < 10 ? `0${hour}` : `${hour}`;
    const mm = minute < 10 ? `0${minute}` : `${minute}`;
    return `${hh}:${mm}`;
  }

  setDatesByPeriod() {
    const period = this.reportForm.get('period')?.value;
    console.log(period);

    const today = new Date();
    let dateFrom: string = this.formatDateWithoutTime(new Date(today));
    let dateTo: string = this.formatDateWithoutTime(new Date(today));

    switch (period) {
      case 'Today':
        dateFrom = this.formatDateWithoutTime(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
        dateTo = this.formatDateWithoutTime(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59));
        break;
      case 'Yesterday':
        let yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        dateFrom = dateTo = this.formatDateWithoutTime(yesterday);
        console.log(dateFrom);

        break;
      case 'Before 2 days':
        let before2Days = new Date(today);
        before2Days.setDate(today.getDate() - 2);
        dateFrom = this.formatDateWithoutTime(before2Days);
        dateTo = this.formatDateWithoutTime(today);
        break;
      case 'Before 3 days':
        let before3Days = new Date(today);
        before3Days.setDate(today.getDate() - 3);
        dateFrom = this.formatDateWithoutTime(before3Days);
        dateTo = this.formatDateWithoutTime(today);
        break;
      case 'This week':
        let startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        let endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        dateFrom = this.formatDateWithoutTime(startOfWeek);
        dateTo = this.formatDateWithoutTime(endOfWeek);
        break;
      case 'Last week':
        let startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
        let endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        dateFrom = this.formatDateWithoutTime(startOfLastWeek);
        dateTo = this.formatDateWithoutTime(endOfLastWeek);
        break;
      case 'This month':
        dateFrom = this.formatDateWithoutTime(new Date(today.getFullYear(), today.getMonth(), 1));
        dateTo = this.formatDateWithoutTime(new Date(today.getFullYear(), today.getMonth() + 1, 0));
        break;
      case 'Last month':
        dateFrom = this.formatDateWithoutTime(new Date(today.getFullYear(), today.getMonth() - 1, 1));
        dateTo = this.formatDateWithoutTime(new Date(today.getFullYear(), today.getMonth(), 0));
        break;
      default:
        dateFrom = dateTo = this.formatDateWithoutTime(new Date(today));
        break;
    }

    // Update the form with the calculated date values (already formatted)
    this.reportForm.patchValue({
      dateFrom: dateFrom,
      dateTo: dateTo
    });
  }

  getPois(): void {
    this.spinner.show();
    this.api.getAllPois().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          this.poisList = response.data;
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  submitForm() {
    if (this.reportForm.valid) {
      var server_group_poi = [];
      var group_poi = [];
      const filter_by_group = this.reportForm.value.filter_by_group;
      if(filter_by_group){
        var filter_poi_group = filter_by_group.filter(data => data.type == "poi");
        if(filter_poi_group){
          group_poi = filter_poi_group.map(data => data.data);
        }
      }
      
      const filter_by_server_group = this.reportForm.value.filter_by_server_group;
      if(filter_by_server_group){
        var filter_poi_server = filter_by_server_group.filter(data => data.type == "poi");
        if(filter_poi_server){
          server_group_poi = filter_poi_server.map(data => data.data);
        }
      }
      const mergedArray = server_group_poi.concat(this.reportForm.value.pois, group_poi);
      const uniqueArray = [...new Set(mergedArray)];
      const selectedDeviceId = this.reportForm.value.device;
      const Pois = this.poisList;
      const selectedPois = uniqueArray;
      const title = this.reportForm.value.title;
      const period = this.reportForm.value.period;
      const dateFrom = this.reportForm.value.dateFrom;
      const fromTime = this.reportForm.value.fromTime;
      const dateTo = this.reportForm.value.dateTo;
      const toTime = this.reportForm.value.toTime;
      const distanceTolerance = this.reportForm.value.distanceTolerance;
      // const type = this.reportForm.value.type;
      const requestData = {
        title: title,
        period: period,
        devices: [selectedDeviceId],
        pois: selectedPois,
        date_from: dateFrom,
        from_time: fromTime,
        date_to: dateTo,
        to_time: toTime,
        distance_tolerance:distanceTolerance,
        // type:type
      };
      this.spinner.show();
      this.api.generateRepots(requestData).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            const date = new Date();
            let time = date.getTime();
            var blob = new Blob([response.data], { type: "text/plain" });
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = 'report_' + time + '.html';
            a.click();
          }
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Error fetching report:', err);
          this.spinner.hide();
        }
      });
    } else if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
    }
  }
  selectAllDevices() {
    this.selectedDeviceIds = this.devices.map(device => device.id);
    this.reportForm.get('device').setValue(this.selectedDeviceIds);
  }

  deselectAllDevices() {
    this.selectedDeviceIds = [];
    this.reportForm.get('device').setValue(this.selectedDeviceIds);
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      this.deselectAllDevices();
    } else {
      this.selectAllDevices();
    }
  }

  isAllSelected(): boolean {
    return this.selectedDeviceIds?.length === this.devices?.length;
  }

  selectAllPois() {
    this.selectedPoiIds = this.poisList.map(poi => poi.poi_id);
    this.reportForm.get('pois').setValue(this.selectedPoiIds);
  }

  deselectAllPois() {
    this.selectedPoiIds = [];
    this.reportForm.get('pois').setValue([]);
  }

  toggleSelectAllPois() {
    if (this.isAllSelectedPois()) {
      this.deselectAllPois();
    } else {
      this.selectAllPois();
    }
  }

  isAllSelectedPois(): boolean {
    return this.selectedPoiIds?.length === this.poisList?.length;
  }

  private formatDateWithoutTime(date: Date): string {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    const yyyy = localDate.getFullYear();
    const mm = (localDate.getMonth() + 1).toString().padStart(2, '0');
    const dd = localDate.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

   getTypes(){
    this.spinner.show();
    this.api.getTypes().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          this.types_options = response.data;
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
   }
   selectPoi(event){
    this.reportForm.get('filter_by_server_group').reset();
    var poi_id = event.value?.assigned_pois.map(data=> data.poi_id);
    if(poi_id && poi_id.length > 0){
      const filteredPois = this.poisList.filter(poi => poi_id.includes(poi.id));
      const poiIds = filteredPois.map(poi => poi.poi_id);
      this.reportForm.get('pois').setValue(poiIds);
    }
  }
  selectPoiServer(event){
    this.reportForm.get('filter_by_group').reset();
    const filteredPois = this.poisList.filter(poi => poi.group_id == event.value);
    const poiIds = filteredPois.map(poi => poi.poi_id);
    this.reportForm.get('pois').setValue(poiIds);
  }
}

