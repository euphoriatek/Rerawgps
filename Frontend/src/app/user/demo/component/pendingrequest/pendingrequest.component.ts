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
   poisForm: FormGroup;
    isSubmitted = false;
    today: Date;
    showgroup: boolean = false;
    usersData: any[] = [];
    visible: boolean = false;
  @ViewChild('dt') dt: Table | undefined;
  constructor(private api: ApiService, public spinner: NgxSpinnerService, private translate: TranslateService,public toaster: ToasterService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadPendingPois();
  }
  loadPendingPois(): void {
    this.spinner.show();
    this.api.getPendingPois().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response && response.status) {
          const pendingPois = response.data;
          if(pendingPois){
            this.pendingPois = pendingPois.map(poi => ({
              ...poi,
              lat: this.getLat(poi.coordinates),
              lng: this.getLng(poi.coordinates),
            }));
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

  getLat(coordinates:any){
    const data = JSON.parse(coordinates);
    return data.lat;
  }
  getLng(coordinates:any){
    const data = JSON.parse(coordinates);
    return data.lng;
  }

  confirmPoiAction(id: number, action:string): void {
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
        type:"poi"
      },
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const data = { poi_id: id, status: action };
        this.spinner.show(); // Add this to indicate the process started
        this.api.updatePoiStatus(data).subscribe({
          next: (response: any) => {
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
}
