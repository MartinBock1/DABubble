import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { User } from './../../interfaces/user'; 
import { AuthService } from './../services/auth.service';
import { UserService } from './../services/user.service'; 
import { ProfilOverlayComponent } from './profil-overlay/profil-overlay.component';
import { ProfilEditOverlayComponent } from "./profil-edit-overlay/profil-edit-overlay.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfilOverlayComponent, ProfilEditOverlayComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  /** Injected Services */
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  auth = inject(Auth);

  /** Overlays */
  isOverlayVisible: boolean = false;
  isProfileOverlayVisible: boolean = false;
  isProfileEditOverlayVisible = false;

  searchText: string = '';
  isActive: boolean = false;
  userData: User | null = null;
  isGuestUser: boolean = false;

  ngOnInit() {
    this.authService.getCurrentUserData().then((user) => {
      if (user) {
        this.userData = user;
        this.isGuestUser = user.name === 'Gast';
      }
    });
  }

  onFocus(): void {
    this.isActive = true; // Set active state to true on focus
  }

  onBlur(): void {
    this.isActive = false; // Set active state to false on blur
  }

  toggleOverlay(): void {
    this.isOverlayVisible = !this.isOverlayVisible;
    this.isProfileOverlayVisible = false;
    this.isProfileEditOverlayVisible = false;
  }

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

  closeProfileOverlay(): void {
    this.isProfileOverlayVisible = false;
    this.isOverlayVisible = true;
  }

  openProfileEditOverlay(): void {
    this.isProfileOverlayVisible = false;
    this.isProfileEditOverlayVisible = true;
  }

  closeProfileEditOverlay() {
     this.isProfileEditOverlayVisible = false;
     this.isOverlayVisible = true;
  }

  logout(): void {
    // console.log('Logging out...');
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
