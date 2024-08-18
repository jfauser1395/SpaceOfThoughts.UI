import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { StyleService } from '../../../../services/style.service';
import { RegisterRequest } from '../models/register-request.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css',
})
export class CreateAccountComponent implements OnInit, OnDestroy {
  private addedUser?: Subscription;
  signUpForm!: FormGroup;
  model: RegisterRequest;
  passwordIsEqual: boolean = false;
  passwordErrorMassage: string = '';
  errorTitle: string[] = [];
  errorTitleEmail: string = '';
  errorTitleUserName: string = '';
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

    this.signUpForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required, 
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      password1: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
    });
  }

  onFormSubmit() {
    if (this.signUpForm.valid) {
      this.model.userName = this.signUpForm.get('userName')?.value;
      this.model.email = this.signUpForm.get('email')?.value;

      if (
        this.signUpForm.get('password1')?.value ===
          this.signUpForm.get('password2')?.value &&
        this.signUpForm.get('password1')?.value != ''
      ) {
        this.model.password = this.signUpForm.get('password1')?.value;
        this.passwordIsEqual = true;
        this.addedUser = this.authService.register(this.model).subscribe({
          next: (response) => {
            this.router.navigateByUrl('/');
          },
          error: (error) => {
            this.requestOk = error.ok;
            this.errorTitle = error.error.errors[''];
            this.errorTitleEmail = error.error.errors['email'];
            this.errorTitleUserName = error.error.errors['userName'];
            if(this.errorTitle){
              this.signUpForm.get('password1')?.setErrors({ customError: true });
              this.signUpForm.get('password2')?.setErrors({ customError: true });
            }else if(this.errorTitleUserName){
              this.signUpForm.get('userName')?.setErrors({ customError: true });
            }else if(this.errorTitleEmail){
              this.signUpForm.get('email')?.setErrors({ customError: true });
            }
          },
        });
      } else {
        this.passwordIsEqual = false;
        this.signUpForm.get('password1')?.setErrors({ customError: true });
        this.signUpForm.get('password2')?.setErrors({ customError: true });
        this.passwordErrorMassage =
          '*Entered passwords do not match or input field is empty';
      }
    } else {
      this.signUpForm.markAllAsTouched();
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
