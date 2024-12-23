// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {
  SignupForm!: FormGroup;
    constructor(public route:Router,public fb:FormBuilder){
  
    }
    ngOnInit(): void {
      this.SignupForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', Validators.required],
      });
    }
  
    registerSubmit() {
    }
}
