import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';
import { StyleService } from '../../../../services/style.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  model: LoginRequest;
  errorTitle: string[] = [];
  requestOk: boolean = true;
  passwordFieldType: string = 'password';
  loginFormGroup!: FormGroup;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private styleService: StyleService
  ) {
    this.model = {
      email: '',
      password: '',
    };
  }
  ngOnInit(): void {
    // scroll up after loading
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.styleService.setBodyStyle('overflow', 'hidden');

    // declare a new form group
    this.loginFormGroup = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  onFormSubmit() {
    if (this.loginFormGroup.valid) {
      this.model.email = this.loginFormGroup.get('email')?.value;
      this.model.password = this.loginFormGroup.get('password')?.value;

      this.authService.login(this.model).subscribe({
        next: (response) => {
          // Set Auth Cookie
          this.cookieService.set(
            'Authorization',
            `Bearer ${response.token}`,
            undefined,
            '/',
            undefined,
            true,
            'Strict'
          );

          // Set User
          this.authService.setUser({
            id: response.id,
            userName: response.userName,
            email: response.email,
            roles: response.roles,
          });

          // Redirect back to Home
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.log(error);
          this.requestOk = error.ok;
          this.errorTitle = [];

          // Iterate through the error object
          for (let key in error.error.errors) {
            if (error.error.errors.hasOwnProperty(key)) {
              this.errorTitle.push(error.error.errors[key]);
            }
          }
          if (this.errorTitle) {
            this.loginFormGroup.get('email')?.setErrors({ customError: true });
            this.loginFormGroup
              .get('password')
              ?.setErrors({ customError: true });
          }
        },
      });
    } else {
      this.loginFormGroup.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
