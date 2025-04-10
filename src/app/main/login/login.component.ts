import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

/**
 * The LoginComponent handles user authentication, including login with email and password,
 * Google sign-in, and guest login. It manages the UI states for mobile responsiveness and
 * animation effects.
 *
 * Der LoginComponent verwaltet die Benutzerauthentifizierung, einschließlich Login mit E-Mail und Passwort,
 * Google-Anmeldung und Gast-Login. Er steuert die UI-Zustände für mobile Reaktionsfähigkeit und
 * Animationseffekte.
 */
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
  userService = inject(UserService);
  router = inject(Router);

  /** UI States */
  isMobile: boolean = false;
  faded: boolean = false;
  isLogoShifted: boolean = false;
  isLogoVisible: boolean = false;
  animationFinished: boolean = false;

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

  /**
   * Listens for window resize events and updates the `isMobile` state based on the window width.
   * @param {Event} event - The resize event.
   *
   * Lauscht auf Fenstergrößenänderungen und aktualisiert den `isMobile`-Zustand basierend auf der Fensterbreite.
   * @param {Event} event - Das Resize-Event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth <= 600;
  }

  constructor() {}

  /**
   * Implements the OnInit interface. Initializes component states and handles animation logic.
   * Checks if the animation has already been played using local storage.
   *
   * Implementiert das OnInit-Interface. Initialisiert Komponentenzustände und handhabt die Animationslogik.
   * Überprüft, ob die Animation bereits abgespielt wurde, mithilfe des lokalen Speichers.
   */
  ngOnInit(): void {
    this.isAnimationPlayed =
      localStorage.getItem('isAnimationPlayed') === 'true';

    if (!this.isAnimationPlayed) {
      this.isMobile = window.innerWidth <= 600;

      setTimeout(() => {
        this.faded = true;
      }, 3000);
      setTimeout(() => {
        this.isLogoVisible = true;
      }, 3100);
      setTimeout(() => {
        this.isLogoShifted = true;
      }, 3300);
      setTimeout(() => {
        this.animationFinished = true;
      }, 4500);

      localStorage.setItem('isAnimationPlayed', 'true');
    } else {
      this.faded = true;
      this.isLogoVisible = true;
      this.isLogoShifted = true;
      this.animationFinished = true;
    }
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
   * Handles the form submission for login.
   * Validates the email and password, attempts to log in the user,
   * and navigates to the content page upon successful login.
   *
   * Behandelt die Formularübermittlung für den Login.
   * Validiert die E-Mail und das Passwort, versucht den Benutzer einzuloggen
   * und navigiert zur Inhaltsseite bei erfolgreichem Login.
   */
  async onSubmit() {
    this.loginAttempted = true;
    this.emailError = '';
    this.passwordError = '';

    const isEmailValid = this.eMailPattern.test(this.email);
    if (!isEmailValid) {
      this.emailError = '*Diese E-Mail-Adresse ist leider ungültig.';
    }

    const isPasswordValid = this.passwordPattern.test(this.password);
    if (!isPasswordValid) {
      this.passwordError =
        '*Falsches Passwort oder E-Mail.. Bitte noch einmal versuchen.';
    }

    if (isEmailValid && isPasswordValid) {
      try {
        const result = await this.authService.loginUser(
          this.email,
          this.password
        );

        if (result.valid) {
          console.log('Erfolgreich eingeloggt');
          this.clearInputfields();
          this.router.navigate(['/content']);
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

  /**
   * Clears the email and password input fields.
   *
   * Löscht die Eingabefelder für E-Mail und Passwort.
   */
  clearInputfields() {
    this.email = '';
    this.password = '';
  }

  /**
   * Handles the focus event on input fields.
   * Sets the focused input and clears the corresponding error message.
   * @param {string} inputName - The name of the input field ('email' or 'password').
   *
   * Behandelt das Fokussierungsereignis auf Eingabefeldern.
   * Setzt das fokussierte Eingabefeld und löscht die entsprechende Fehlermeldung.
   * @param {string} inputName - Der Name des Eingabefelds ('email' oder 'password').
   */
  onFocus(inputName: string) {
    this.focusedInput = inputName;
    if (inputName === 'email') {
      this.emailError = '';
    }
    if (inputName === 'password') {
      this.passwordError = '';
    }
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

  /**
   * Initiates the Google sign-in process.
   * Uses Firebase's signInWithPopup to authenticate with Google.
   * Creates a new user in the database if the user doesn't exist.
   * Navigates to the content page upon successful sign-in.
   *
   * Startet den Google-Anmeldeprozess.
   * Verwendet Firebase's signInWithPopup zur Authentifizierung mit Google.
   * Erstellt einen neuen Benutzer in der Datenbank, wenn der Benutzer nicht existiert.
   * Navigiert zur Inhaltsseite bei erfolgreicher Anmeldung.
   */
  onSignInWithGoogle() {
    const googleAuthProvider = new GoogleAuthProvider();
    signInWithPopup(this.authService.auth, googleAuthProvider)
      .then(async (result) => {
        const user = result.user;
        const defaultAvatar = 'avatar.svg';
        const userAvatar = defaultAvatar;

        // console.log('Google-Login erfolgreich, Daten:', {
        //   uid: user.uid,
        //   name: user.displayName,
        //   email: user.email,
        //   avatar: userAvatar,
        // });

        const exists = await this.userService.checkIfUserExists(user.uid);

        if (!exists) {
          await this.userService.createUser({
            uid: user.uid,
            name: user.displayName || 'Unbekannter Nutzer',
            email: user.email || '',
            avatar: userAvatar,
          });
          // } else {
          //   console.log('User existiert bereits in Firestore');
        }

        this.router.navigate(['/content']);
      })
      .catch((error) => {
        // console.error('Fehler beim Einloggen mit Google:', error);
        this.passwordError = '*Login mit Google fehlgeschlagen.';
      });
  }

  /**
   * Handles the guest login functionality.
   * Logs in as a predefined guest user and navigates to the content page.
   *
   * Behandelt die Gast-Login-Funktionalität.
   * Meldet sich als vordefinierter Gastbenutzer an und navigiert zur Inhaltsseite.
   */
  async onGuestLogin() {
    const guestUser = {
      uid: '2m1B6rmNFsgqgZ5PYIgDA21uMWJ3',
      name: 'Gast',
      email: 'guest@test.com',
      avatar: 'avatar.svg',
    };

    console.log('Gast-Login erfolgreich, Daten:', guestUser);

    try {
      const exists = await this.userService.checkIfUserExists(guestUser.uid);

      if (!exists) {
        await this.userService.createUser(guestUser);
      }

      this.authService.isUserLoggedIn = true;
      this.authService.name = guestUser.name;
      localStorage.setItem('guestUser', JSON.stringify(guestUser));
      this.userService.setCurrentUser(guestUser);

      console.log('Gastmodus aktiviert');
      this.router.navigate(['/content']);
    } catch (error) {
      // console.error('Fehler beim Gast-Login:', error);
      this.passwordError = '*Gast-Login fehlgeschlagen.';
    }
  }
}

