import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  /** Injected Services */
  authService = inject(AuthService);
  router = inject(Router);

  faded: boolean = false;
  /** UI States */
  // isPageLoaded: boolean = false;
  isLogoShifted: boolean = false;
  isLogoVisible: boolean = false;

  /** Check if animation already played */
  isAnimationPlayed: boolean = false;

  /** Authentication & Input States */
  email: string = '';
  password: string = '';
  isChecked: boolean = false;
  focusedInput: string = '';
  isEmailValid: boolean = true;
  isPasswordValid: boolean = true;
  loginAttempted: boolean = false;

  emailError: string = '';
  passwordError: string = '';

  /** Validation Patterns */
  eMailPattern = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  passwordPattern = /(?=.*[A-Z])(?=.*\d)(?=.*[^\w]).{6,20}/;

  constructor() {}

  ngOnInit(): void {
    this.isAnimationPlayed =
      localStorage.getItem('isAnimationPlayed') === 'true';

    if (!this.isAnimationPlayed) {
      setTimeout(() => {
        this.faded = true;
      }, 3000);

      setTimeout(() => {
        this.isLogoVisible = true;
      }, 3200);

      setTimeout(() => {
        this.isLogoShifted = true;
        // this.isAnimationPlayed = true;
      }, 3300);

      localStorage.setItem('isAnimationPlayed', 'true');
    } else {
      // Setze die Seite in den Zustand nach der Animation
      this.faded = true;
      this.isLogoVisible = true;
      this.isLogoShifted = true;
    }
  }

  // Validierung und Fehlerbehandlung bei Eingabeänderungen
  onEmailChange() {
    this.emailError = ''; // Fehler zurücksetzen, wenn der Benutzer ändert
    this.isEmailValid = this.eMailPattern.test(this.email);
  }

  onPasswordChange() {
    this.passwordError = ''; // Fehler zurücksetzen, wenn der Benutzer ändert
    this.isPasswordValid = this.passwordPattern.test(this.password);
  }

  async onSubmit() {
    this.loginAttempted = true;
    this.emailError = ''; // Leere zuerst alle Fehler
    this.passwordError = '';

    // Validierung der E-Mail-Adresse
    const isEmailValid = this.eMailPattern.test(this.email);
    if (!isEmailValid) {
      this.emailError = '*Diese E-Mail-Adresse ist leider ungültig.';
    }

    // Validierung des Passworts
    const isPasswordValid = this.passwordPattern.test(this.password);
    if (!isPasswordValid) {
      this.passwordError =
        '*Falsches Passwort oder E-Mail.. Bitte noch einmal versuchen.';
    }

    // Wenn alle Eingaben valide sind, überprüfe den Login
    if (isEmailValid && isPasswordValid) {
      try {
        const result = await this.authService.loginUser(
          this.email,
          this.password
        );

        if (result.valid) {
          console.log('Erfolgreich eingeloggt');
          this.clearInputfields();
          // this.router.navigate(['/']); // Weiterleitung nach erfolgreichem Login
        } else {
          this.passwordError =
            result.message ||
            '*Falsches Passwort oder E-Mail.. Bitte noch einmal versuchen.';
        }
      } catch (error) {
        this.passwordError =
          '*Falsches Passwort oder E-Mail.. Bitte noch einmal versuchen.';
      }
    }
  }

  clearInputfields() {
    this.email = '';
    this.password = '';
  }

  onFocus(inputName: string) {
    this.focusedInput = inputName;
    if (inputName === 'email') {
      // Füge den 'input-focused' Zustand nur für das fokussierte Feld hinzu
      this.emailError = ''; // Fehler zurücksetzen, falls vorhanden
    }
    if (inputName === 'password') {
      this.passwordError = ''; // Fehler zurücksetzen, falls vorhanden
    }
  }

  onBlur() {
    this.focusedInput = '';
  }
}
