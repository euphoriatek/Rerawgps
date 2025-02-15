import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from 'src/app/user/services/api.service';
import { DatashareService } from 'src/app/user/services/datashare.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  groupsData: any[] = [];
  historyData: any;
  visible: boolean = false;
  dialogVisible: boolean = false;
  reportsData: any[] = [];
  report_data: any;
  pois_options: any[];
  planForm: FormGroup;
  isTableVisible: boolean = false;
  devices: { label: string, value: string }[] = [];
  deviceForm = new FormGroup({
    device: new FormControl([])
  });

  @ViewChild('dt') dt: Table | undefined;
  constructor(
    public spinner: NgxSpinnerService,
    public api: ApiService,
    public route: Router,
    private dataShareService: DatashareService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.planForm = this.fb.group({
      device: ['', Validators.required]
    });
    this.getHistory();
    this.getDevice();
  }
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  getHistory(): void {
    this.spinner.show();
    this.api.getHistory().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.historyData = response.data.history || [];
          if (this.pois_options && this.pois_options.length > 0) {
            this.historyData.forEach((data: any) => {
              if (data.pois_id) {
                try {
                  const poiIds = JSON.parse(data.pois_id);
                  data.pois = poiIds.map((poiId: number) => {
                    const poi = this.pois_options.find(p => p.id === poiId);
                    return poi ? poi.name : '';
                  }).join(', ')
                } catch (error) {
                  console.error('Error parsing pois_id:', error);
                }
              }
            });
          }
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error fetching history:', err);
      }
    });
  }
  
  getPois(): void {
    this.api.getAllPoisOptionsList().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.pois_options = response.data;
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }


  ReActivePlan(data: any) {
    this.dataShareService.updateData(data);
    this.route.navigate(['/regaykar-plans']);
  }

  getDevice() {
    this.spinner.show();
    this.api.getDevice().subscribe({
      next: (response: any) => {
        if (response && response.status && response.data.length > 0) {
          this.devices = response.data[0].items.map((device: any) => ({
            label: device.name,
            value: device.id
          }));
        }
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error fetching devices:', err);
        this.spinner.hide();
      }
    });
  }

  getDeviceName(data: any): void {
    this.visible = true;
    this.report_data = data;
    this.deviceForm.reset();
  }
  submitForm(): void {
    if (this.deviceForm.valid) {
      const selectedDevices = this.deviceForm.value.device;
      const pois = this.report_data?.pois|| [];
      const requestData = {
        title: "Report Generate",
        type: 54,
        date_from: this.report_data.activation_date,
        date_to: this.report_data.activation_date,
        format: "json",
        devices: selectedDevices,
        stop_duration: "2",
        distance_tolerance: "50",
        pois: pois,
      };
       console.log(requestData);
      this.spinner.show();
      this.api.getRepots(requestData).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            this.reportsData = response.data || [];
            console.log(this.reportsData);
            this.visible = false;
            this.isTableVisible = true;
          }
          this.spinner.hide();
        },
      });
    }
  }
  
  openDialog() {
    this.dialogVisible = true;
  }
  closeDialog() {
    this.dialogVisible = false;
  }
  syncHistory(): void {
    this.spinner.show();
    const payload = {
      device_id: 2869,
      from_date: '2025-02-12',
      to_date: '2025-02-14',
      from_time: '00:00',
      to_time: '23:59'
    };
    this.api.syncHistory(payload).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response && response.status) {
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error fetching history:', err);
      }
    });
  }
}
