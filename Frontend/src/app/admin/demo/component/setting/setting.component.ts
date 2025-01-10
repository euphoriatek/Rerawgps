
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent {
  changePasswordForm: FormGroup;
  constructor(private fb: FormBuilder, private api: ApiService,private toaster:ToasterService,private translate: TranslateService) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      newpassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required]],
    });
  }
  
  onSubmit() {
    if (this.changePasswordForm.valid) {
      const  data = this.changePasswordForm.value;

      this.api.changePassword(data).subscribe({
        next: (response) => {
          this.toaster.success(this.translate.instant('password_changes_sucessfully'), this.translate.instant('server'));
          this.changePasswordForm.reset();
        },
        error: (err) => {
          this.toaster.error(this.translate.instant('password_changes_error') || this.translate.instant('try_again'), this.translate.instant('server'));
        }
      });
    }
  }

  resetForm(){
    this.changePasswordForm.reset();
  }

}
