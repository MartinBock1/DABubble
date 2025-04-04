import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent {
  /** Injected Services */
  authService = inject(AuthService);
  router = inject(Router);

  email: string = '';
  focusedInput: string = '';
  isEmailValid: boolean = true;

  eMailPattern = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;

  onFocus(inputName: string) {
    this.focusedInput = inputName;
  }

  onBlur() {
    this.focusedInput = '';
  }

  async forgotPassword() {
    if (this.eMailPattern.test(this.email)) {
      this.isEmailValid = true;
      try {
        await this.authService.passwordReset(this.email);
        // alert('Password reset email sent!');
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error sending password reset email:', error);
      }
    } else {
      this.isEmailValid = false;
    }
  }
}
