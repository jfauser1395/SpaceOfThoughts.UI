import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';
import { StyleService } from '../../../../services/style.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  model: LoginRequest;
  errorTitle: string = '';
  requestOk: boolean = true;
  passwordFieldType: string = 'password';

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
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.styleService.setBodyStyle('overflow', 'hidden');
  }

  onFormSubmit() {
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
        this.errorTitle = error.error.errors[''];
      },
    });
  }


  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }


}
