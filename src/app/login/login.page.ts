// src/app/login/login.page.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  correo: string = '';
  password: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {}

  login(): void {
    if (this.loginForm.valid) {
      // Implement your login logic here

      // Example: Navigate to the home page after successful login
      this.router.navigate(['/home']);
    } else {
      console.log('Form is invalid. Please check your inputs.'); // For debugging
    }
  }
}
