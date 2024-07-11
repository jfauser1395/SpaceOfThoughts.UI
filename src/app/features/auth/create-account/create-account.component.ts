import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterModule } from '@angular/router';
import { StyleService } from '../../../../services/style.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css',
})
export class CreateAccountComponent implements OnInit {
  model: LoginRequest;
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

  onFormSubmit() {}
}
