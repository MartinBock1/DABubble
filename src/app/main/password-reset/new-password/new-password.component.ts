import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { getAuth, confirmPasswordReset } from 'firebase/auth';

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
  confirmPassword: string = '';
  isPasswordValid: boolean = false;
  isConfirmPasswordValid: boolean = false;
  passwordError: string = '';
  isPasswordFocused: boolean = false;
  isConfirmPasswordFocused: boolean = false;
  oobCode: string = '';
  showOverlay = false;

  /** Validation Patterns */
  passwordPattern = /(?=.*[A-Z])(?=.*\d)(?=.*[^\w]).{6,20}/;

  /**
   * Constructor that initializes the component and extracts the `oobCode` from the URL.
   *
   * This constructor is called when the component is instantiated. It uses the `ActivatedRoute` service to retrieve the `oobCode`
   * from the query parameters in the URL. The `oobCode` is often used for actions like password reset or email verification.
   *
   * @param {ActivatedRoute} route - The ActivatedRoute service that provides access to the current route and its parameters.
   * @returns {void} - No value is returned. The constructor initializes the component state.
   *
   * Konstruktor, der die Komponente initialisiert und den `oobCode` aus der URL extrahiert.
   *
   * Dieser Konstruktor wird aufgerufen, wenn die Komponente instanziiert wird. Er verwendet den `ActivatedRoute`-Dienst,
   * um den `oobCode` aus den URL-Query-Parametern abzurufen. Der `oobCode` wird häufig für Aktionen wie Passwortzurücksetzungen
   * oder E-Mail-Verifizierung verwendet.
   *
   * @param {ActivatedRoute} route - Der `ActivatedRoute`-Dienst, der Zugriff auf die aktuelle Route und deren Parameter bietet.
   * @returns {void} - Es wird kein Wert zurückgegeben. Der Konstruktor initialisiert den Zustand der Komponente.
   */
  constructor(private route: ActivatedRoute) {
    // Extract the `oobCode` from URL
    this.oobCode = this.route.snapshot.queryParams['oobCode'];
  }

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

  /**
   * Handles changes to the confirm password input field.
   *
   * This method is triggered when the user modifies the confirm password input field. It checks whether the password entered in
   * the "password" input field matches the one entered in the "confirm password" input field and if the password adheres to
   * the defined validation pattern. If both conditions are true, it marks the password as valid. Otherwise, it ensures the
   * validation state is updated accordingly.
   *
   * @returns {void} - No value is returned. The password validation state (`isPasswordValid`) is updated based on the input.
   *
   * Behandelt Änderungen im Bestätigungspasswort-Eingabefeld.
   *
   * Diese Methode wird ausgelöst, wenn der Benutzer das Bestätigungspasswort-Eingabefeld ändert. Sie überprüft, ob das Passwort,
   * das im "Passwort"-Eingabefeld eingegeben wurde, mit dem im "Bestätigungspasswort"-Eingabefeld übereinstimmt und ob das Passwort
   * den definierten Validierungskriterien entspricht. Wenn beide Bedingungen erfüllt sind, wird das Passwort als gültig markiert.
   * Andernfalls wird der Validierungsstatus entsprechend aktualisiert.
   *
   * @returns {void} - Es wird kein Wert zurückgegeben. Der Passwort-Validierungsstatus (`isPasswordValid`) wird basierend auf der Eingabe aktualisiert.
   */
  onConfirmPasswordChange() {
    this.isPasswordValid =
      this.password === this.confirmPassword &&
      this.passwordPattern.test(this.password);
  }

  /**
   * Clears the password and confirm password input fields.
   *
   * This method resets both the password and confirm password input fields to empty strings, effectively clearing
   * the user input. It is typically used to reset the form fields after a password change or error.
   *
   * @returns {void} - No value is returned. The input fields are cleared.
   *
   * Löscht die Passwort- und Bestätigungspasswort-Eingabefelder.
   *
   * Diese Methode setzt sowohl das Passwort- als auch das Bestätigungspasswort-Eingabefeld auf leere Strings zurück,
   * wodurch die Benutzereingaben effektiv gelöscht werden. Sie wird typischerweise verwendet, um die Formularfelder nach
   * einer Passwortänderung oder einem Fehler zurückzusetzen.
   *
   * @returns {void} - Es wird kein Wert zurückgegeben. Die Eingabefelder werden gelöscht.
   */
  clearInputfields() {
    this.password = '';
    this.confirmPassword = '';
  }

  /**
   * Handles focus events for the password and confirm password input fields.
   * Sets focus state for the password or confirm password field and clears any password error message.
   *
   * @param {string} inputName - The name of the input field that is being focused ('password' or 'confirmPassword').
   *
   * Behandelt Fokus-Ereignisse für die Passwort- und Bestätigungspasswort-Eingabefelder.
   * Setzt den Fokusstatus für das Passwort- oder Bestätigungspasswort-Feld und löscht etwaige Fehlermeldungen zum Passwort.
   *
   * @param {string} inputName - Der Name des Eingabefelds, das den Fokus erhält ('password' oder 'confirmPassword').
   *
   */
  onFocus(inputName: string) {
    if (inputName === 'password') {
      this.isPasswordFocused = true;
      this.isConfirmPasswordFocused = false;
    } else if (inputName === 'confirmPassword') {
      this.isPasswordFocused = false;
      this.isConfirmPasswordFocused = true;
    }
    this.passwordError = '';
  }

  /**
   * Handles the blur event for the password and confirm password input fields.
   *
   * This method is triggered when the password or confirm password input field loses focus.
   * It sets the focus states (`isPasswordFocused` and `isConfirmPasswordFocused`) to false,
   * indicating that neither the password nor confirm password input field is currently focused.
   *
   * @returns {void} - No value is returned. The focus states are simply reset to false.
   *
   * Behandelt das "blur"-Ereignis für die Passwort- und Bestätigungspasswort-Eingabefelder.
   *
   * Diese Methode wird ausgelöst, wenn das Passwort- oder Bestätigungspasswort-Eingabefeld den Fokus verliert.
   * Sie setzt die Fokus-Statusvariablen (`isPasswordFocused` und `isConfirmPasswordFocused`) auf false,
   * was anzeigt, dass keines der Eingabefelder für das Passwort oder das Bestätigungspasswort derzeit den Fokus hat.
   *
   * @returns {void} - Es wird kein Wert zurückgegeben. Die Fokus-Statusvariablen werden einfach auf false gesetzt.
   */
  onBlur() {
    this.isPasswordFocused = false;
    this.isConfirmPasswordFocused = false;
  }

  /**
   * Changes the user's password after validating the input.
   *
   * This method checks if the entered password and confirmation password are valid and match each other.
   * If the validation passes, it attempts to confirm the password reset using Firebase's `confirmPasswordReset` function.
   * After successfully resetting the password, an overlay is shown, and a timeout is triggered to navigate to another page.
   * In case of any errors, an appropriate error message is displayed.
   *
   * @returns {void} - No value is returned. The action either successfully changes the password or displays an error message.
   *
   * @throws {Error} - Throws an error if the password reset fails.
   *
   * Ändert das Passwort des Benutzers nach Validierung der Eingabe.
   *
   * Diese Methode überprüft, ob das eingegebene Passwort und das Bestätigungspasswort gültig sind und übereinstimmen.
   * Wenn die Validierung erfolgreich ist, wird versucht, das Passwort mit der Firebase-Funktion `confirmPasswordReset` zurückzusetzen.
   * Nach erfolgreichem Zurücksetzen des Passworts wird ein Overlay angezeigt und ein Timeout ausgelöst, um zu einer anderen Seite zu navigieren.
   * Bei Fehlern wird eine entsprechende Fehlermeldung angezeigt.
   *
   * @returns {void} - Es wird kein Wert zurückgegeben. Die Aktion ändert entweder das Passwort erfolgreich oder zeigt eine Fehlermeldung an.
   *
   * @throws {Error} - Wirft einen Fehler, wenn das Zurücksetzen des Passworts fehlschlägt.
   */
  async changePassword() {
    if (this.isPasswordValid && this.password === this.confirmPassword) {
      // console.log('New password:', this.password);

      try {
        await confirmPasswordReset(getAuth(), this.oobCode, this.password);
        // console.log('password successfully changed!');
        this.showOverlay = true;
        this.timeout();
      } catch (error) {
        // console.error('Password reset error:', error);
        this.passwordError =
          'The password could not be reset. Please try again.';
      }
    } else {
      this.passwordError = 'Password validation has failed.';
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
}
