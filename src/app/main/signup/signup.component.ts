import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  /** Injected Services */
  authService = inject(AuthService);
  router = inject(Router);

  /** Authentication & Input States */
  name: string = '';
  email: string = '';
  password: string = '';
  isChecked = false;
  focusedInput: string = '';
  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;

  /** Password Visibility */
  passwordFieldActive: boolean = false;

  /** Validation Patterns */
  namePattern = /[a-zA-ZäüößÄÜÖ\s]{3,}/;
  eMailPattern = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  passwordPattern = /(?=.*[A-Z])(?=.*\d)(?=.*[^\w]).{6,20}/;

  toggleCheckbox() {
    this.isChecked = !this.isChecked;
  }

  onSubmit() {
    if (
      this.namePattern.test(this.name) &&
      this.eMailPattern.test(this.email) &&
      this.passwordPattern.test(this.password)
    ) {
      this.onSignUp();
      this.clearInputfields();
      this.router.navigate(['/choose-avatar']); 
    } else {
      console.log('Inputs are invalid!');
    }
  }
  
  onSignUp() {
    if (this.isChecked && this.name && this.email && this.password) {
      this.authService.signupUser(this.name, this.email, this.password);
      this.isEmailValid = !!this.email;
    } else {
      console.log('Please fill out all fields and accept the privacy policy');
    }
  }

  clearInputfields() {
    this.name = '';
    this.email = '';
    this.password = '';
  }

  focusInput(inputElement: HTMLInputElement) {
    inputElement.focus();
  }

  onFocus(inputName: string) {
    this.focusedInput = inputName;
  }

  onBlur() {
    this.focusedInput = '';
  }
}
