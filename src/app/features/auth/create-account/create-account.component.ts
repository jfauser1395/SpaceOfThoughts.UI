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
  private formSubscription?: Subscription;
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
    // scroll up after loading
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    this.styleService.setBodyStyle('overflow', 'hidden');

    // declare a new form group
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

    // subscribe to valueChanges observable
    this.formSubscription = this.signUpForm
      .get('password1')
      ?.valueChanges.subscribe(() => {
        this.resetEmailError();
      });

    this.formSubscription?.add(
      this.signUpForm.get('password2')?.valueChanges.subscribe(() => {
        this.resetEmailError();
      })
    );
  }

  // define the resetFormErrors method
  resetEmailError(): void {
    this.signUpForm.get('password1')?.setErrors(null);
    this.signUpForm.get('password2')?.setErrors(null);
  }

  onFormSubmit() {
    // check password equality
    if (
      this.signUpForm.get('password1')?.value ===
        this.signUpForm.get('password2')?.value &&
      this.signUpForm.get('password1')?.value != ''
    ) {
      // check form validity
      if (this.signUpForm.valid) {
        this.model.userName = this.signUpForm.get('userName')?.value;
        this.model.email = this.signUpForm.get('email')?.value;

        this.model.password = this.signUpForm.get('password1')?.value;
        this.passwordIsEqual = true;
        this.addedUser = this.authService.register(this.model).subscribe({
          next: (response) => {
            this.router.navigateByUrl('/');
          },
          error: (error) => {
            // declare error messages
            this.requestOk = error.ok;

            this.errorTitleUserName = error.error.errors['userName'];

            this.errorTitleEmail = error.error.errors['email'];

            this.errorTitle = [];

            // Iterate through the error object
            for (let key in error.error.errors) {
              if (error.error.errors.hasOwnProperty(key)) {
                this.errorTitle.push(error.error.errors[key]);
              }
            }

            // check error field
            const errorObj = error.error.errors;

            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                if (key === 'email') {
                  this.signUpForm
                    .get('email')
                    ?.setErrors({ customError: true });
                } else if (key === 'userName') {
                  this.signUpForm
                    .get('userName')
                    ?.setErrors({ customError: true });
                } else {
                  this.signUpForm
                    .get('password1')
                    ?.setErrors({ customError: true });
                  this.signUpForm
                    .get('password2')
                    ?.setErrors({ customError: true });
                }
              }
            }
          },
        });
      } else {
        this.signUpForm.markAllAsTouched();
      }
    } else {
      this.passwordIsEqual = false;
      this.signUpForm.get('password1')?.setErrors({ customError: true });
      this.signUpForm.get('password2')?.setErrors({ customError: true });
      this.passwordErrorMassage = '*Entered passwords do not match';
    }
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  togglePasswordVisibilityRepeat() {
    this.passwordFieldTypeRepeat =
      this.passwordFieldTypeRepeat === 'password' ? 'text' : 'password';
  }

  ngOnDestroy(): void {
    this.addedUser?.unsubscribe();
    this.formSubscription?.unsubscribe();
  }
}
