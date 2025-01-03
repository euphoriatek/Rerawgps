import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { access } from 'fs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/admin/services/confirm-dialog.component';  
@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss']
})
export class ServerComponent {
  ServerForm!: FormGroup;
  isSubmitted = false;
  servesData:any;
  showAddserver:boolean=false;
  visible: boolean = false;
  selectedServer: any;


  constructor(public route: Router,private dialog: MatDialog,public fb: FormBuilder, public spinner: NgxSpinnerService, public api: ApiService, public cookiesService: AdminCookiesService, public toaster: ToasterService,private translate: TranslateService) {

  }
  ngOnInit(): void {
    this.ServerForm = this.fb.group({
      name: ['', [Validators.required]],
      server_url:['', [Validators.required]],
      access_key:['', [Validators.required]]
    });
    this.getServers();
  }


  addServer(): void {
    if (this.ServerForm.invalid) {
      this.isSubmitted = true;
      this.ServerForm.markAllAsTouched();
      this.spinner.hide();
      return;
    }else if(this.ServerForm.valid){
      this.spinner.show();
      const data = this.ServerForm.value;
      this.api.addServer(data).subscribe({
        next: (response: any) => {
          if (response) {
            console.log(response);
            this.getServers();
            this.ServerForm.reset();
            this.toaster.success(this.translate.instant('server_added_success'), this.translate.instant('server'));
            this.spinner.hide();
            this.isSubmitted = false;
            this.showAddserver = false;
          } else {
            this.toaster.error(this.translate.instant('server_added_error') || this.translate.instant('try_again'), this.translate.instant('server'));
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.isSubmitted = false;
          this.toaster.error(this.translate.instant('server_added_error_ex') || this.translate.instant('try_again'), this.translate.instant('server'));
          console.error(err);
        }
      });
    }else{
      this.ServerForm.markAllAsTouched();
    }
  }

  getServers(){
    this.api.getServers().subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.servesData = response.data;
        } else {
        }
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      }
    });
  }

  resetForm(){
    this.ServerForm.reset();
  }

  addServerForm(){
    this.showAddserver = true;
  }


  EditServer(): void {
    if (this.ServerForm.invalid) {
      this.isSubmitted = true;
      this.ServerForm.markAllAsTouched();
      return;
    }
  
    if (this.ServerForm.valid) {
      this.spinner.show();
      const data = this.ServerForm.value;
      this.api.updateServer(this.selectedServer.id, data).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.getServers();
            this.toaster.success(this.translate.instant('server_updated_success'), this.translate.instant('server'));
            this.visible = false;
            this.spinner.hide();
            this.isSubmitted = false;
          } else {
            this.toaster.error(this.translate.instant('server_updated_error') || this.translate.instant('try_again'), this.translate.instant('server'));
            this.spinner.hide();
          }
        },
        error: (err) => {
          this.spinner.hide();
          this.isSubmitted = false;
          this.toaster.error(
            this.translate.instant('server_updated_error_ex') || this.translate.instant('try_again'),
            this.translate.instant('server')
          );
          console.error(err);
        }
      });
    }
  }

  openEditDialog(selectedServer: any): void {
    this.selectedServer = selectedServer;  
    this.ServerForm.patchValue({
      name: selectedServer.name,
      server_url: selectedServer.server_url,
      access_key: selectedServer.access_key
    });  
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
  }

  deleteRow(data: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.translate.instant('Delete_confirmation'),
        message: this.translate.instant('are_you_sure_want_to_delete'), 
      }
    });
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.spinner.show();
        this.isSubmitted = true;
        this.api.deleteServer(data.id).subscribe({
          next: (response: any) => {
            if (response.success) {
              const index = this.servesData.indexOf(data);
              if (index !== -1) {
                this.servesData.splice(index, 1);
              }
              this.toaster.success(this.translate.instant('server_deleted_success'), this.translate.instant('server'));
              this.spinner.hide();
              this.isSubmitted = false;
            } else {
              this.toaster.error(this.translate.instant('server_deleted_error') || this.translate.instant('try_again'), this.translate.instant('server'));
              this.spinner.hide();
            }
          },
          error: (err) => {
            this.spinner.hide();
            this.isSubmitted = false;
            this.toaster.error(this.translate.instant('server_deleted_error_ex') || this.translate.instant('try_again'), this.translate.instant('server'));
            console.error(err);
          }
        });
      }
    });
  }
  
}
