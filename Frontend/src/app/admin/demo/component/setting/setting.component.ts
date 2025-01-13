
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
  constructor(private fb: FormBuilder, private api: ApiService,private toaster:ToasterService,private translate: TranslateService,public spinner:NgxSpinnerService) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      newpassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required]],
    }, { validator: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('newpassword')?.value;
    const confirmPassword = group.get('confirmpassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.spinner.show();
      const  data = this.changePasswordForm.value;
      this.api.changePassword(data).subscribe({
        next: (response:any) => {
          if(response.status){
            this.toaster.success(this.translate.instant('password_changes_sucessfully'), this.translate.instant('admin'));
            this.changePasswordForm.reset();
          }else{
            this.toaster.error(this.translate.instant('try_again'), this.translate.instant('admin'));
          }
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.toaster.error(this.translate.instant('password_changes_error') || this.translate.instant('try_again'), this.translate.instant('admin'));
        }
      });
    }else{
      this.changePasswordForm.markAllAsTouched();
    }
  }

  resetForm(){
    this.changePasswordForm.reset();
  }

}
