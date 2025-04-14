import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './../../services/auth.service';

/**
 * Component responsible for resetting the user's password.
 * Allows the user to enter their email and request a password reset.
 *
 * Diese Komponente ist für das Zurücksetzen des Benutzerpassworts zuständig.
 * Benutzer können ihre E-Mail-Adresse eingeben und einen Passwort-Reset anfordern.
 */
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
  emailError: string = '';
  focusedInput: string = '';
  isEmailValid: boolean = true;
  eMailPattern = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  showOverlay = false;

  /**
   * Sets the currently focused input field.
   *
   * Setzt das aktuell fokussierte Eingabefeld.
   *
   * @param inputName - Name of the focused input – Name des fokussierten Eingabefelds
   */
  onFocus(inputName: string) {
    this.focusedInput = inputName;
  }

  /**
   * Resets the focus status when an input field loses focus.
   *
   * Setzt den Fokus zurück, wenn ein Eingabefeld den Fokus verliert.
   */
  onBlur() {
    this.focusedInput = '';
  }

  /**
   * Validates the email and attempts to send a password reset email.
   * If successful, shows a confirmation overlay and redirects to the login page.
   *
   * Validiert die E-Mail und versucht, eine Passwort-Reset-E-Mail zu senden.
   * Bei Erfolg wird ein Bestätigungs-Overlay angezeigt und zur Login-Seite weitergeleitet.
   */
  async forgotPassword() {
    const isEmailValid = this.eMailPattern.test(this.email);
    if (!isEmailValid) {
      this.emailError = '*This e-mail address is invalid.';
    }
    if (isEmailValid) {
      // this.isEmailValid = true;
      try {
        await this.authService.passwordReset(this.email);
        this.showOverlay = true;
        this.timeout();
      } catch (error) {
        console.error('Error sending password reset email:', error);
      }
    } else {
      this.isEmailValid = false;
    }
  }

  /**
   * Sets a timeout to hide the overlay and navigate to the login page after 3 seconds.
   *
   * This function hides the overlay (sets `showOverlay` to false) and then navigates the user
   * to the login page (`/login`) after a delay of 3 seconds.
   *
   * @returns {void} - No value is returned. The action happens after the timeout.
   *
   * Setzt einen Timeout, um das Overlay auszublenden und nach 3 Sekunden zur Login-Seite zu navigieren.
   *
   * Diese Funktion blendet das Overlay aus (setzt `showOverlay` auf false) und navigiert den Benutzer
   * nach einer Verzögerung von 3 Sekunden zur Login-Seite (`/login`).
   *
   * @returns {void} - Es wird kein Wert zurückgegeben. Die Aktion erfolgt nach dem Timeout.
   */
  timeout() {
    setTimeout(() => {
      this.showOverlay = false;
      this.router.navigate(['/login']);
    }, 3000);
  }

  /**
   * Handles changes to the email input field.
   * Clears the email error message and validates the email.
   *
   * Behandelt Änderungen im E-Mail-Eingabefeld.
   * Löscht die E-Mail-Fehlermeldung und validiert die E-Mail.
   */
  onEmailChange() {
    this.emailError = '';
    this.isEmailValid = this.eMailPattern.test(this.email);
  }
}
