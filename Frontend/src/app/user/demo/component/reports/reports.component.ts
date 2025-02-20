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
  formattedPoisList :any;
  times: string[] = [];
  selectedDeviceIds: number[] = [];
  selectedPoiIds: number[] = [];
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
    const currentDate = new Date().toISOString().split('T')[0];
    this.reportForm = this.fb.group({
      title: [''],
      period: [''],
      device: ['', Validators.required],
      pois: ['', Validators.required],
      dateFrom: [currentDate],
      fromTime: ['00:00'],
      dateTo: [currentDate],
      toTime: ['00:00']
    });
    this.setDatesByPeriod();
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
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = this.formatTime(hour, minute);
        timesArray.push(time);
      }
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
    const today = new Date();
    let dateFrom = new Date(today);
    let dateTo = new Date(today);

    switch (period) {
      case 'Today':
        dateFrom = dateTo = new Date(today);
        break;
      case 'Yesterday':
        dateFrom = dateTo = new Date(today.setDate(today.getDate() - 1));
        break;
      case 'Before 2 days':
        dateFrom = new Date(today);
        dateFrom.setDate(today.getDate() - 2);
        dateTo = new Date(today);
        break;
      case 'Before 3 days':
        dateFrom = new Date(today);
        dateFrom.setDate(today.getDate() - 3);
        dateTo = new Date(today);
        break;
      case 'This week':
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        dateFrom = startOfWeek;
        dateTo = endOfWeek;
        break;
      case 'Last week':
        const startOfLastWeek = new Date(today.setDate(today.getDate() - today.getDay() - 7));
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        dateFrom = startOfLastWeek;
        dateTo = endOfLastWeek;
        break;
      case 'This month':
        dateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
        dateTo = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'Last month':
        dateFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        dateTo = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        dateFrom = dateTo = new Date(today);
        break;
    }

    // Update the form with the calculated date values
    this.reportForm.patchValue({
      dateFrom: this.formatDate(dateFrom),
      dateTo: this.formatDate(dateTo)
    });
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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
      const selectedDeviceId = this.reportForm.value.device;
      const Pois = this.poisList;
      const selectedPois = this.reportForm.value.pois;
      const title = this.reportForm.value.title;
      const period = this.reportForm.value.period;
      const dateFrom = this.reportForm.value.dateFrom;
      const fromTime = this.reportForm.value.fromTime;
      const dateTo = this.reportForm.value.dateTo;
      const toTime = this.reportForm.value.toTime;
      const requestData = {
        title: title,
        period: period,
        devices: selectedDeviceId, 
        pois: selectedPois,
        date_from: dateFrom,
        from_time: fromTime,
        date_to: dateTo,
        to_time: toTime
      };
      this.spinner.show();
      this.api.generateRepots(requestData).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            const date = new Date();
            let time = date.getTime();
            var blob = new Blob([response.data], {type: "text/plain"});
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = 'report_'+time+'.html';
            a.click();
          }
          this.spinner.hide();
        },
        error: (err) => {
          console.error('Error fetching report:', err);
          this.spinner.hide();
        }
      });
    }else if(this.reportForm.invalid){
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
}

