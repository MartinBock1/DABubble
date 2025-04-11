import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './../../services/auth.service';

/**
 * The SignupComponent handles user registration, including input validation,
 * privacy policy acceptance, and navigation to avatar selection upon successful signup.
 *
 * Der SignupComponent verwaltet die Benutzerregistrierung, einschließlich Eingabevalidierung,
 * Akzeptanz der Datenschutzrichtlinie und Navigation zur Avatar-Auswahl nach erfolgreicher Anmeldung.
 */
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

  /**
   * Toggles the state of the privacy policy checkbox.
   *
   * Schaltet den Zustand des Datenschutzrichtlinien-Kontrollkästchens um.
   */
  toggleCheckbox() {
    this.isChecked = !this.isChecked;
  }

  /**
   * Handles the form submission for signup.
   * Validates the inputs, signs up the user if valid, clears the input fields,
   * and navigates to the avatar selection page.
   *
   * Behandelt die Formularübermittlung für die Anmeldung.
   * Validiert die Eingaben, meldet den Benutzer an, wenn gültig, löscht die Eingabefelder
   * und navigiert zur Avatar-Auswahlseite.
   */
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

  /**
   * Signs up the user if all fields are filled and the privacy policy is accepted.
   * Calls the AuthService to create a new user account.
   *
   * Meldet den Benutzer an, wenn alle Felder ausgefüllt sind und die Datenschutzrichtlinie akzeptiert wurde.
   * Ruft den AuthService auf, um ein neues Benutzerkonto zu erstellen.
   */
  onSignUp() {
    if (this.isChecked && this.name && this.email && this.password) {
      this.authService.signupUser(this.name, this.email, this.password);
      this.isEmailValid = !!this.email;
    } else {
      console.log('Please fill out all fields and accept the privacy policy');
    }
  }

  /**
   * Clears the name, email, and password input fields.
   *
   * Löscht die Eingabefelder für Name, E-Mail und Passwort.
   */
  clearInputfields() {
    this.name = '';
    this.email = '';
    this.password = '';
  }

  /**
   * Sets focus on the specified input element.
   * @param {HTMLInputElement} inputElement - The input element to focus.
   *
   * Setzt den Fokus auf das angegebene Eingabeelement.
   * @param {HTMLInputElement} inputElement - Das zu fokussierende Eingabeelement.
   */
  focusInput(inputElement: HTMLInputElement) {
    inputElement.focus();
  }

  /**
   * Handles the focus event on input fields.
   * Sets the focused input state.
   * @param {string} inputName - The name of the input field.
   *
   * Behandelt das Fokussierungsereignis auf Eingabefeldern.
   * Setzt den Zustand des fokussierten Eingabefelds.
   * @param {string} inputName - Der Name des Eingabefelds.
   */
  onFocus(inputName: string) {
    this.focusedInput = inputName;
  }

  /**
   * Handles the blur event on input fields.
   * Resets the focused input state.
   *
   * Behandelt das Blur-Ereignis auf Eingabefeldern.
   * Setzt den Zustand des fokussierten Eingabefelds zurück.
   */
  onBlur() {
    this.focusedInput = '';
  }
}