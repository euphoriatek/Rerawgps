import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ConfirmDialogComponent } from 'src/app/admin/services/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-regay-kar-user-view',
  templateUrl: './admin-regay-kar-user-view.component.html',
  styleUrls: ['./admin-regay-kar-user-view.component.scss']
})
export class AdminRegayKarUserViewComponent {
SalesUserForm!: FormGroup;
  SalesEditForm!: FormGroup;
  customers: Customer[];
  selectedCustomers: Customer[];
  @ViewChild('dt') dt: Table | undefined;
  userId: any;
  salesData:any;
  showAddSales:boolean=false;
  visible:boolean=false;
  usrInformation:any;
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private fb: FormBuilder,
    private toaster: ToasterService,
    private translate: TranslateService,
    public route: Router,
    private dialog: MatDialog,
    private Cureentroute: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.SalesUserForm = this.fb.group({
      name:['', [Validators.required]],
      username:['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
        ],
      ]
    });
    this.SalesEditForm = this.fb.group({
      id:['', [Validators.required]],
      user_id: ['', [Validators.required]],
      name:['', [Validators.required]],
      username:['', [Validators.required]],
      password: [
        '',
        [
          Validators.minLength(8),
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
        ],
      ]
    });
    this.userId = this.Cureentroute.snapshot.paramMap.get('id');
    this.getUserInfo();
    this.getSales();
  }

  getSales(){
    this.spinner.show();
    this.api.getSales(this.userId).subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.salesData = response.data;
        } else {
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  getUserInfo(){
    this.spinner.show();
    this.api.getUserInfo(this.userId).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          this.usrInformation = response.data;
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err); 
      }
    });
  }

  addSalesAgent(): void {
    if (this.SalesUserForm.invalid) {
      this.SalesUserForm.markAllAsTouched();
      this.spinner.hide();
      return;
    }else if(this.SalesUserForm.valid){
      this.spinner.show();
      this.SalesUserForm.value.user_id = this.userId;
      const data = this.SalesUserForm.value;
      this.api.addSalesAgent(data).subscribe({
        next: (response: any) => {
          if (response && response.status) {
            this.showAddSales=false;
            this.SalesUserForm.reset();
            this.getSales();
            this.toaster.success(this.translate.instant('sales_agent_added_success'), this.translate.instant('sales_agent'));
          } else {
            this.toaster.error(this.translate.instant('sales_agent_added_error') || this.translate.instant('try_again'), this.translate.instant('sales_agent'));
          }
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.toaster.error(this.translate.instant('sales_agent_added_error_ex') || this.translate.instant('try_again'), this.translate.instant('sales_agent'));
          console.error(err);
        }
      });
    }else{
      this.SalesUserForm.markAllAsTouched();
      return;
    }
  }

  resetForm(){
    this.SalesUserForm.reset();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  addSales() {
    this.showAddSales = true;
  }

  openEditDialog(data: any): void {
      this.SalesEditForm.patchValue({
        id:data.id,
        user_id:data.user_id,
        name:data.name,
        username: data.username
      });
      this.visible = true;
  }

    // Edit user and save changes
    EditSales(): void {
      if (this.SalesEditForm.invalid) {
        this.SalesEditForm.markAllAsTouched();
        return;
      }
      if (this.SalesEditForm.valid) {
        this.spinner.show();
        const data = this.SalesEditForm.value;
        this.api.updateSales(data).subscribe({
          next: (response: any) => {
            if (response.status === true) {
              this.visible = false;
              this.SalesEditForm.reset();
              this.getSales();
              this.toaster.success(this.translate.instant('sales_updated_success'), this.translate.instant('sales'));
            } else {
              this.toaster.error(this.translate.instant('sales_updated_error') || this.translate.instant('try_again'), this.translate.instant('sales'));
            }
            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
            this.toaster.error(
              this.translate.instant('sales_updated_error_ex') || this.translate.instant('try_again'),
              this.translate.instant('sales')
            );
            console.error(err);
          }
        });
      }
    }

    // Delete user
    deleteRow(data: any): void {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: this.translate.instant('Delete_confirmation'),
          message: this.translate.instant('are_you_sure_want_to_delete'),
        },
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.spinner.show();
          this.api.deleteSales(data.id).subscribe({
            next: (response: any) => {
              if (response.status) {
                this.getSales();
                this.toaster.success(this.translate.instant('sales_deleted_success'), this.translate.instant('sales'));
              } else {
                this.toaster.error(this.translate.instant('sales_deleted_error') || this.translate.instant('try_again'), this.translate.instant('sales'));
              }
              this.spinner.hide();
            },
            error: (err) => {
              this.spinner.hide();
              this.toaster.error(this.translate.instant('sales_deleted_error_ex') || this.translate.instant('try_again'), this.translate.instant('sales'));
              console.error(err);
            }
          });
        }
    });
    }
}
export interface Customer {
  id?: number;
  name:string;
  username?: string;
  created_at?: string;
}