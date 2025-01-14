import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
  <div class="delete-modal">
  <div class="delete-icon"><i class="fa-solid fa-trash"></i></div>
    <h2>{{data.title}}</h2>
    <p>{{data.message}}</p>
    <div class="modal-btn">
      <button class="orange-btn btn" [mat-dialog-close]="true">{{ 'delete' | translate }}</button>
      <button class="grey-btn btn" [mat-dialog-close]="false" id="no_btn">{{ 'cancel' | translate }}</button>
    </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }) {}
}
