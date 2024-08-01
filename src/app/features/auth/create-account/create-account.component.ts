import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { StyleService } from '../../../../services/style.service';
import { RegisterRequest } from '../models/register-request.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css',
})
export class CreateAccountComponent implements OnInit, OnDestroy {
  private addedUser?: Subscription;
  model: RegisterRequest;
  passwordFirst: string = '';
  passwordRepeat: string = '';
  passwordIsEqual: boolean = false;
  passwordErrorMassage: string = '';
  errorTitle: string[] = [];
  requestOk: boolean = true;
  passwordFieldType: string = 'password';
  passwordFieldTypeRepeat: string = 'password';

  constructor(
    private authService: AuthService,
    private router: Router,
    private styleService: StyleService
  ) {
    this.model = {
      userName: '',
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

  passwordIdentical() {
    if (this.passwordFirst === this.passwordRepeat) {
      this.model.password = this.passwordFirst;
    }
  }

  onFormSubmit() {
    //check for equality of the entered passwords
    this.passwordIdentical();

    if (
      this.model.password === this.passwordFirst &&
      this.model.password === this.passwordRepeat
    ) {
      this.passwordIsEqual = true;
      this.addedUser = this.authService.register(this.model).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          this.requestOk = error.ok;
          this.errorTitle = error.error.errors[''];
        },
      });
    } else {
      this.passwordIsEqual = false;
      this.passwordErrorMassage = '- Entered passwords do not match';
    }
  }

  ngOnDestroy(): void {
    this.addedUser?.unsubscribe();
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  togglePasswordVisibilityRepeat() {
    this.passwordFieldTypeRepeat =
      this.passwordFieldTypeRepeat === 'password' ? 'text' : 'password';
  }
}
