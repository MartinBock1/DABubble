import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { UserService } from '../services/user.service';

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

  // HostListener, um auf die Bildschirmgröße zu reagieren
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth <= 600;
  }

  constructor() {}

  ngOnInit(): void {
    this.isAnimationPlayed =
      localStorage.getItem('isAnimationPlayed') === 'true';

    if (!this.isAnimationPlayed) {
      this.isMobile = window.innerWidth <= 600; // Initialwert

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
        this.animationFinished = true; // Animation ist fertig, Login-Seite anzeigen
      }, 4500);

      localStorage.setItem('isAnimationPlayed', 'true');
    } else {
      // Setze die Seite in den Zustand nach der Animation
      this.faded = true;
      this.isLogoVisible = true;
      this.isLogoShifted = true;
      this.animationFinished = true;
    }
  }

  onEmailChange() {
    this.emailError = ''; 
    this.isEmailValid = this.eMailPattern.test(this.email);
  }

  onPasswordChange() {
    this.passwordError = ''; 
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

  onSignInWithGoggle() {
    const googleAuthProvider = new GoogleAuthProvider();
    signInWithPopup(this.authService.auth, googleAuthProvider)
      .then(async (result) => {
        const user = result.user;
        // console.log('Erfolgreich eingeloggt mit Google:', user);

        const exists = await this.userService.checkIfUserExists(user.uid);

        if (!exists) {
          await this.userService.createUser({
            uid: user.uid,
            name: user.displayName || 'Unbekannter Nutzer',
            email: user.email || '',
            avatar: 'assets/img/char-icons/avatar.svg',
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

  async onGuestLogin() {
    const guestUser = {
      uid: '2m1B6rmNFsgqgZ5PYIgDA21uMWJ3',
      name: 'Gast',
      email: 'guest@test.com',
      avatar: 'assets/img/char-icons/avatar.svg',
    };

    try {
      const exists = await this.userService.checkIfUserExists(guestUser.uid);

      if (!exists) {
        await this.userService.createUser(guestUser);
      }

      // Optional: Authentifiziere den Gast technisch, z.B. mit einer Gast-Session oder Dummy-Login
      // Alternativ kannst du einfach Zustand setzen oder in Memory speichern

      console.log('Gastmodus aktiviert');
      this.router.navigate(['/content']);
    } catch (error) {
      // console.error('Fehler beim Gast-Login:', error);
      this.passwordError = '*Gast-Login fehlgeschlagen.';
    }
  }
}

