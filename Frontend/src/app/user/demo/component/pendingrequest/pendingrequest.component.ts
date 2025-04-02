import { Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ApiService } from 'src/app/user/services/api.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/services/toster.service';
import { ConfirmDialogComponent } from 'src/app/user/services/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-pendingrequest',
  templateUrl: './pendingrequest.component.html',
  styleUrls: ['./pendingrequest.component.scss']
})
export class PendingRequestComponent {
  pendingPois: any[] = [];
  poiEditForm: FormGroup;
  poisForm: FormGroup;
  isSubmitted = false;
  today: Date;
  showgroup: boolean = false;
  usersData: any[] = [];
  visible: boolean = false;
  @ViewChild('dt') dt: Table | undefined;
  group_options: any[] = [];
  groups: any;
  constructor(private api: ApiService, public spinner: NgxSpinnerService, private translate: TranslateService, public toaster: ToasterService, private dialog: MatDialog, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadPendingPois();

    this.poiEditForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      group_id: [''],
      groupId: ['']
    });
    this.getServerGroup();
    this.getGroups();
  }
  loadPendingPois(): void {
    this.spinner.show();
    this.api.getPendingPois().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          const pendingPois = response.data;
          if (pendingPois) {
            this.pendingPois = pendingPois.map(poi => ({
              ...poi,
              lat: this.getLat(poi.coordinates),
              lng: this.getLng(poi.coordinates),
            }));
            if (pendingPois.length > 0) {
              document.getElementById("pending_request").classList.add("pending_request");
              document.getElementById("pending_request").innerHTML = pendingPois.length;
            } else {
              document.getElementById("pending_request").classList.remove("pending_request");
            }
          }
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

  confirmPoiAction(id: number, action: string, data: any): void {
    if (action === "approved") {
      if (data.description == "" || data.description == null) {
        return this.toaster.error(this.translate.instant('please_add_description'), this.translate.instant('poi'));
      }
    }
    const actionText = action === 'approved' ? 'poi_approved_success' : 'poi_reject_success';
    const confirmationMessage =
      action === 'approved'
        ? this.translate.instant('are_you_sure_want_to_approved')
        : this.translate.instant('are_you_sure_want_to_denoy');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('poi_confirmation'),
        message: confirmationMessage,
        type: "poi"
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const data = { poi_id: id, status: action };
        console.log(data);

        this.spinner.show();
        this.api.updatePoiStatus(data).subscribe({
          next: (response: any) => {
            console.log(response);

            if (response.status) {

              this.loadPendingPois();
              this.toaster.success(this.translate.instant(actionText), this.translate.instant('poi'));
            } else {
              this.toaster.error(this.translate.instant('try_again'), this.translate.instant('poi'));
            }
          },
          error: (err) => {
            this.toaster.error(
              this.translate.instant('user_updated_error_ex') || this.translate.instant('try_again'),
              this.translate.instant('poi')
            );
            console.error(err);
          },
          complete: () => this.spinner.hide(),
        });
      }
    });
  }

  openEditDialog(data: any): void {
    this.poiEditForm.patchValue({
      name: data.name,
      description: data.description,
      id: data.id,
      group_id: data?.group_id,
      groupId: data?.pending_groups?.group_id,
    });

    this.visible = true;
  }
  EditPoi() {
    if (this.poiEditForm.invalid) {
      this.poiEditForm.markAllAsTouched();
      return;
    }
    if (this.poiEditForm.valid) {
      this.spinner.show();
      const data = this.poiEditForm.value;
      const selectedGroup = this.group_options.find(option => option.id === data.group_id);
      if (selectedGroup) {
        data.group_name = selectedGroup.title;
      }
      this.api.editPoi(data).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.visible = false;
            this.poiEditForm.reset();
            this.loadPendingPois();
            this.toaster.success(this.translate.instant('poi_updated_success'), this.translate.instant('poi'));
          } else {
            this.toaster.error(this.translate.instant('poi_updated_error') || this.translate.instant('try_again'), this.translate.instant('poi'));
          }
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.toaster.error(this.translate.instant('poi_updated_error_ex') || this.translate.instant('try_again'), this.translate.instant('poi'));
          console.error(err);
        }
      });
    }
  }
  // EditPoi() {
  //   if (this.poiEditForm.invalid) {
  //     this.poiEditForm.markAllAsTouched();
  //     return;
  //   }
  //   if (this.poiEditForm.valid) {
  //     this.spinner.show();
  //     const formData = this.poiEditForm.value;
  //     const selectedGroup = this.group_options.find(option => option.id === formData.group_id);
  //     if (selectedGroup) {
  //       formData.group_name = selectedGroup.title;
  //     }
  //     this.api.editPoi(formData).subscribe({
  //       next: (response: any) => {
  //         if (response.status === true) {
  //           this.visible = false;
  //           this.poiEditForm.reset();
  //           this.loadPendingPois();
  //           this.toaster.success(this.translate.instant('poi_updated_success'), this.translate.instant('poi'));
  //         } else {
  //           this.toaster.error(this.translate.instant('poi_updated_error') || this.translate.instant('try_again'), this.translate.instant('poi'));
  //         }
  //         this.spinner.hide();
  //       },
  //       error: (err) => {
  //         this.spinner.hide();
  //         this.toaster.error(this.translate.instant('poi_updated_error_ex') || this.translate.instant('try_again'), this.translate.instant('poi'));
  //         console.error(err);
  //       }
  //     });
  //   }
  // }

  getServerGroup(): void {
    this.spinner.show();
    this.api.getServerGroup().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          this.group_options = response.data;
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }
  getGroups(): void {
    this.api.getGroupList().subscribe({
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
}
