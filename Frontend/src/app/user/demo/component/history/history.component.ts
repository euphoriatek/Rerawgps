import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from 'src/app/user/services/api.service';
import { DatashareService } from 'src/app/user/services/datashare.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';
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
  selectedDeviceNames: string[] = [];
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
    private fb: FormBuilder,
    private renderer: Renderer2
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
          console.log(this.historyData);

          if (this.pois_options && this.pois_options.length > 0) {
            this.historyData.forEach((data: any) => {
              if (data.pois_id) {
                try {
                  const poiIds = JSON.parse(data.pois_id);
                  data.pois = poiIds.map((poiId: number) => {
                    const poi = this.pois_options.find(p => p.id === poiId);
                    return poi ? poi.name : '';
                  }).join(', ');
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

  generateReport(data: any) {
    this.submitForm(data);
  }

  submitForm(data: any) {
    const requestData = {
      date_from: data.activation_date,
      date_to: data.activation_date,
      devices: data.device_id ? [data.device_id] : [],
      pois: data.pois,
      selectedDeviceNames: data.device_name ? [data.device_name] : [],
      language: localStorage.getItem('user_language')
    };
    this.spinner.show();
    this.api.getRepots(requestData).subscribe({
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

  downloadReport(reportPath: string) {
    this.spinner.show();
    // const fullUrl = environment.apiBaseUrl + '/storage/' + reportPath;
    const fullUrl = environment.apiBaseUrl + '/storage/app/public/' + reportPath;
    fetch(fullUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = reportPath.split('/').pop() || 'report.html';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Download failed:', error);
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

}
