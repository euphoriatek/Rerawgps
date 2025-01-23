import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { UserCookiesService } from 'src/app/user/services/usercookies.service'
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from 'src/app/admin/services/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Table } from 'primeng/table';
import { ApiService } from 'src/app/user/services/api.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-regay-kar-plan',
  templateUrl: './regay-kar-plan.component.html',
  styleUrls: ['./regay-kar-plan.component.scss']
})
export class RegayKarPlanComponent {
  planForm: FormGroup;
  isSubmitted = false;
  today: Date;
  showplan: boolean = false;
  plansData: any[] = [];
  planEditForm!: FormGroup;
  visible: boolean = false;
  sales_options: any[];
  groups_options: any[];
  userId: any;
  @ViewChild('dt') dt: Table | undefined;
  constructor(
    public route: Router,
    public fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public api: ApiService,
    public cookiesService: AdminCookiesService,
    public toaster: ToasterService,
    private translate: TranslateService,
    private dialog: MatDialog,
    public UserCookiesService: UserCookiesService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('xyz');
    this.today = new Date();
    this.planForm = this.fb.group({
      groups_id: ['', [Validators.required]],
      startdate: ['', [Validators.required]],
      sale_agent_id: ['', [Validators.required]],
    });

    this.planEditForm = this.fb.group({
      id: ['', [Validators.required]],
      startdate:['', [Validators.required]],
      sale_agent_id: ['', [Validators.required]],
    });
    this.getGroups();
    this.getSales();
    this.getPlans();
  }

  createPlan(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      this.spinner.hide();
      return;
    } else if (this.planForm.valid) {
      this.spinner.show();
      const data = this.planForm.value;
      if (data.startdate) {
        const adjustedDate = new Date(data.startdate);
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        data.startdate = adjustedDate;
      }
      this.api.createPlan(data).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          if (response && response.status) {
            this.toaster.success(this.translate.instant('group_created_success'), this.translate.instant('group'));
            this.getPlans();
            this.planForm.reset();
            this.showplan = false;
          } else {
            this.toaster.error(this.translate.instant('group_created_error'), this.translate.instant('group'));
          }
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.toaster.error(this.translate.instant('group_added_error_ex') || this.translate.instant('try_again'), this.translate.instant('group'));
          console.error(err);
        }
      });
    } else {
      this.planForm.markAllAsTouched();
    }
  }
  
  resetForm() {
    this.planForm.reset();
  }

  addNewPlan() {
    this.showplan = true;
  }
  closeForm() {
    this.showplan = false;
  }

  getPlans(): void {
    this.spinner.show();
    this.api.getPlans().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.plansData = response.data;
        }
        this.spinner.hide();
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

  openEditDialog(data: any): void {
    this.planEditForm.patchValue({
      startdate:data.activation_date,
      id: data.id,
      sale_agent_id:data.sale_agent_id
    });

    this.visible = true;
  }

  updatePlan(): void {
    if (this.planEditForm.invalid) {
      this.planEditForm.markAllAsTouched();
      return;
    }
    if (this.planEditForm.valid) {
      this.spinner.show();
      const data = this.planEditForm.value;
      if (data.startdate) {
        const adjustedDate = new Date(data.startdate);
        if (adjustedDate.getHours() === 0 && adjustedDate.getMinutes() === 0) {
          adjustedDate.setDate(adjustedDate.getDate() + 1);
          data.startdate = adjustedDate;
        }
      }
      this.api.updatePlan(data).subscribe({
        next: (response: any) => {
          if (response.status) {
            this.visible = false;
            this.planEditForm.reset();
            this.getPlans();
            this.toaster.success(this.translate.instant('group_updated_success'), this.translate.instant('group'));
          } else {
            this.toaster.error(this.translate.instant('group_updated_error') || this.translate.instant('try_again'), this.translate.instant('group'));
          }
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.toaster.error(this.translate.instant('group_updated_error_ex') || this.translate.instant('try_again'), this.translate.instant('group'));
          console.error(err);
        }
      });
    }
  }

  deleteRecords(data: any): void {
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
        this.api.deletePlan(data.id).subscribe({
          next: (response: any) => {
            if (response.status) {
              this.getPlans();
              this.toaster.success(this.translate.instant('plan_deleted_success'), this.translate.instant('plan'));
            } else {
              this.toaster.error(this.translate.instant('plan_deleted_error') || this.translate.instant('try_again'), this.translate.instant('plan'));
            }
            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
            this.toaster.error(this.translate.instant('plan_deleted_error_ex') || this.translate.instant('try_again'), this.translate.instant('plan'));
            console.error(err);
          }
        });
      }
    });
  }

  getGroups(): void {
    this.api.getGroupList().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.groups_options = response.data;
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  getSales() {
    this.api.getSalesOptionsList().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.sales_options = response.data;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
}
