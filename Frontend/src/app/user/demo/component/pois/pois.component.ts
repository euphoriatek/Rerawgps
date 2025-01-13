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
  today: Date;
  showgroup: boolean = false;
  poisForm: FormGroup;
  poisList:any;
  @ViewChild('dt') dt: Table | undefined;

  constructor(
    private api: ApiService,
    public spinner: NgxSpinnerService,
    private translate: TranslateService,
    public toaster: ToasterService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.poisForm = this.formBuilder.group({
      name: ['', [Validators.required]],               
      description: ['', [Validators.required]],        
      map_icon_id: [0, [Validators.required]],
      lat: ['', [Validators.required, Validators.pattern('^-?\\d+(\\.\\d+)?$')]], 
      lng: ['', [Validators.required, Validators.pattern('^-?\\d+(\\.\\d+)?$')]],  
      created_at: [null],                              
      updated_at: [null],                              
      status: ['pending', [Validators.required]]
    });
    this.addPois();
    this.getPois();
  }

  // Method to handle POI creation
  addPois(): void {
    this.isSubmitted = true;
    if (this.poisForm.invalid) {
      this.poisForm.markAllAsTouched();
      this.spinner.hide();
      return;
    } else {
      this.spinner.show();
      const data = this.poisForm.value;
      this.api.addPois(data).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          if (response && response.status === true) {
            this.toaster.success(this.translate.instant('pois_created_success'), this.translate.instant('pois'));
            this.poisForm.reset();
            this.isSubmitted = false;
            this.showgroup = false;
          } else {
            this.toaster.error(this.translate.instant('pois_created_error') || this.translate.instant('try_again'), this.translate.instant('pois'));
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.toaster.error(this.translate.instant('pois_creation_failed') || this.translate.instant('try_again'), this.translate.instant('pois'));
          console.error(err);
        }
      });
    }
  }

  resetForm() {
    this.poisForm.reset();
  }
  getPois(): void {
    this.spinner.show();
    this.api.getAllPois().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          console.log(response);
          this.poisList = response.data;
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
  addUserForm() {
    this.showgroup = true;
  }
}
