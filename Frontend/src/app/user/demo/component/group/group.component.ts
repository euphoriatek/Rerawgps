import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/admin/services/api.service';
import { AdminCookiesService } from 'src/app/admin/services/admincookies.service';
import { ToasterService } from 'src/app/services/toster.service';
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  groupForm: FormGroup;
  isSubmitted = false;
  today: Date;
  showgroup:boolean=false;

  constructor(
    public route: Router,
    public fb: FormBuilder,
    public spinner: NgxSpinnerService,
    public api: ApiService,
    public cookiesService: AdminCookiesService,
    public toaster: ToasterService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    this.groupForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    }, { validators: this.validateDates });
  }

  validateDates(group: FormGroup) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    return start && end && start <= end ? null : { dateInvalid: true };
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      this.spinner.hide();
      return;
    }
  
    this.spinner.show();
    const data = this.groupForm.value;
    this.api.addGroup(data).subscribe({
      next: (response: any) => {
        console.log(response); 
        this.spinner.hide();
        if (response && response.status === true) { 
          this.toaster.success(this.translate.instant('group_created_success'), this.translate.instant('group'));
          this.route.navigate(['/admin/dashboard/default']);
          this.groupForm.reset();
          this.isSubmitted = false;
          this.showgroup = false;
        } else {
          this.toaster.error(this.translate.instant('group_created_error') || this.translate.instant('try_again'), this.translate.instant('group'));
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.toaster.error(this.translate.instant('group_creation_failed') || this.translate.instant('try_again'), this.translate.instant('group'));
        console.error(err);
      }
    });
  }
  resetForm(){
    this.groupForm.reset();
  }
  addUserForm(){
    this.showgroup = true;
  }
}
