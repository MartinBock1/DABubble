import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export class NewPasswordComponent {
  /** Injected Services */
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);

  /** Authentication & Input States */
  password: string = '';
  // focusedInput: string = '';
  isPasswordValid: boolean = true;
  passwordError: string = '';
  isPasswordFocused: boolean = false;
  isConfirmPasswordFocused: boolean = false;

  /** Validation Patterns */
  passwordPattern = /(?=.*[A-Z])(?=.*\d)(?=.*[^\w]).{6,20}/;

  /**
   * Handles changes to the password input field.
   * Clears the password error message and validates the password.
   *
   * Behandelt Änderungen im Passwort-Eingabefeld.
   * Löscht die Passwort-Fehlermeldung und validiert das Passwort.
   */
  onPasswordChange() {
    this.passwordError = '';
    this.isPasswordValid = this.passwordPattern.test(this.password);
  }

  clearInputfields() {
    this.password = '';
  }

  onFocus(inputName: string) {
    if (inputName === 'password') {
      this.isPasswordFocused = true;
      this.isConfirmPasswordFocused = false;
    } else if (inputName === 'confirmPassword') {
      this.isPasswordFocused = false;
      this.isConfirmPasswordFocused = true;
    }
    this.passwordError = ''; // Fehlernachricht zurücksetzen
  } 

  onBlur() {
    this.isPasswordFocused = false;
    this.isConfirmPasswordFocused = false;
  }

  changePassword() {
    console.log('Password changed successfully!');
  }
}
