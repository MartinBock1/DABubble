import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { User } from './../../interfaces/user'; 
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service'; 
import { ProfilOverlayComponent } from './profil-overlay/profil-overlay.component';
import { ProfilEditOverlayComponent } from "./profil-edit-overlay/profil-edit-overlay.component";

/**
 * HeaderComponent
 *
 * This component represents the top navigation/header bar of the application.
 * It handles user authentication state, overlays (profile view/edit), and search bar behavior.
 *
 * Diese Komponente repräsentiert die obere Navigations-/Kopfzeile der Anwendung.
 * Sie verwaltet den Authentifizierungszustand des Benutzers, Overlays (Profil anzeigen/bearbeiten) und das Verhalten der Suchleiste.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfilOverlayComponent,
    ProfilEditOverlayComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  /** Injected authentication and user services, and Angular router. */
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  auth = inject(Auth);

  /** Flags to control visibility of overlays */
  isOverlayVisible: boolean = false;
  isProfileOverlayVisible: boolean = false;
  isProfileEditOverlayVisible = false;

  /** Search bar input text */
  searchText: string = '';

  /** Indicates if the search input is active/focused */
  isActive: boolean = false;

  /** Current user data */
  userData: User | null = null;

  /** Indicates if the user is a guest */
  isGuestUser: boolean = false;

  /**
   * Angular lifecycle hook - initializes user state.
   *
   * Angular Lifecycle-Hook - Initialisiert den Benutzerzustand.
   */
  ngOnInit() {
    this.userService.currentUser$.subscribe((user) => {
      if (user) {
        this.userData = user;
        this.isGuestUser = user.name === 'Gast';
      }
    });

    // Initial fetch of user data
    this.authService.getCurrentUserData();
  }

  /**
   * Called when search input gains focus.
   *
   * Wird aufgerufen, wenn die Sucheingabe den Fokus erhält.
   */
  onFocus(): void {
    this.isActive = true;
  }

  /**
   * Called when search input loses focus.
   *
   * Wird aufgerufen, wenn die Sucheingabe den Fokus verliert.
   */
  onBlur(): void {
    this.isActive = false;
  }

  /**
   * Toggles the visibility of the main overlay menu.
   *
   * Schaltet die Sichtbarkeit des Hauptoverlays um.
   */
  toggleOverlay(): void {
    this.isOverlayVisible = !this.isOverlayVisible;
    this.isProfileOverlayVisible = false;
    this.isProfileEditOverlayVisible = false;
  }

  /**
   * Opens the user profile overlay unless the user is a guest.
   *
   * Öffnet das Benutzerprofil-Overlay, außer der Benutzer ist ein Gast.
   */
  async goToProfile(): Promise<void> {
    if (this.isGuestUser) {
      return;
    }

    this.isOverlayVisible = false;
    this.isProfileOverlayVisible = true;

    if (this.userData) {
      this.isOverlayVisible = true;
    } else {
      console.warn('Userdaten nicht geladen');
    }
  }

  /**
   * Closes the profile view and shows the main overlay.
   *
   * Schließt die Profilansicht und zeigt das Hauptoverlay.
   */
  closeProfileOverlay(): void {
    this.isProfileOverlayVisible = false;
    this.isOverlayVisible = true;
  }

  /**
   * Opens the profile edit overlay.
   *
   * Öffnet das Profilbearbeitungs-Overlay.
   */
  openProfileEditOverlay(): void {
    this.isProfileOverlayVisible = false;
    this.isProfileEditOverlayVisible = true;
  }

  /**
   * Closes the profile edit view and returns to the main overlay.
   *
   * Schließt die Bearbeitungsansicht des Profils und kehrt zum Hauptoverlay zurück.
   */
  closeProfileEditOverlay() {
    this.isProfileEditOverlayVisible = false;
    this.isOverlayVisible = true;
  }

  /**
   * Logs the user out and navigates to the login page.
   *
   * Meldet den Benutzer ab und navigiert zur Login-Seite.
   */
  logout(): void {
    // console.log('Logging out...');
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
