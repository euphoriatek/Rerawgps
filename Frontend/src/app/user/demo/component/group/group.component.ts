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

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  groupForm: FormGroup;
  isSubmitted = false;
  today: Date;
  showgroup: boolean = false;
  groupsData: any[] = [];
  groupEditForm!: FormGroup;
  visible: boolean = false;
  pois_options: any[];
  sales_options: any[];
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
    public UserCookiesService: UserCookiesService
  ) { }

  ngOnInit(): void {
    this.today = new Date();
    this.groupForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startdate: ['', [Validators.required]],
      pois_id: ['', [Validators.required]],
      sale_agent_id: ['', [Validators.required]],
    }, { validators: this.validateDates });

    this.groupEditForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startdate:['', [Validators.required]],
      pois_id: [[], Validators.required],
      sale_agent_id: ['', [Validators.required]],
    });

    this.getPois();
    this.getSales();
    this.getGroups();
  }

  validateDates(group: FormGroup) {
    const start = group.get('startdate')?.value;
    return start ? null : { dateInvalid: true };
  }

  addGroup(): void {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      this.spinner.hide();
      return;
    } else if (this.groupForm.valid) {
      this.spinner.show();
      const data = this.groupForm.value;
      if (data.startdate) {
        const adjustedDate = new Date(data.startdate);
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        data.startdate = adjustedDate;
      }
      this.api.addGroup(data).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          if (response && response.status) {
            this.toaster.success(this.translate.instant('group_created_success'), this.translate.instant('group'));
            this.getGroups();
            this.groupForm.reset();
            this.showgroup = false;
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
      this.groupForm.markAllAsTouched();
    }
  }
  
  resetForm() {
    this.groupForm.reset();
  }

  addUserForm() {
    this.showgroup = true;
  }
  closeForm() {
    this.showgroup = false;
  }

  getGroups(): void {
    this.spinner.show();
    this.api.getGroupList().subscribe({
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

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  openEditDialog(data: any): void {
    const poisIds = data.assigned_pois?.map(data => data.pois_id) || [];
    this.groupEditForm.patchValue({
      name: data.name,
      description: data.description,
      startdate:data.start_date,
      id: data.id,
      pois_id: poisIds,
      sale_agent_id:data.sale_agent_id
    });

    this.visible = true;
  }

  EditGroupUser(): void {
    if (this.groupEditForm.invalid) {
      this.groupEditForm.markAllAsTouched();
      return;
    }
    if (this.groupEditForm.valid) {
      this.spinner.show();
      const data = this.groupEditForm.value;
      if (data.startdate) {
        const adjustedDate = new Date(data.startdate);
        adjustedDate.setDate(adjustedDate.getDate() + 1);
        data.startdate = adjustedDate;
      }
      this.api.updateGroup(data).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.visible = false;
            this.groupEditForm.reset();
            this.getGroups();
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
        this.api.deleteGroupUser(data.id).subscribe({
          next: (response: any) => {
            if (response.status) {
              this.getGroups();
              this.toaster.success(this.translate.instant('user_deleted_success'), this.translate.instant('group'));
            } else {
              this.toaster.error(this.translate.instant('user_deleted_error') || this.translate.instant('try_again'), this.translate.instant('group'));
            }
            this.spinner.hide();
          },
          error: (err) => {
            this.spinner.hide();
            this.toaster.error(this.translate.instant('user_deleted_error_ex') || this.translate.instant('try_again'), this.translate.instant('group'));
            console.error(err);
          }
        });
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
