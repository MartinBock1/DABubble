import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { User } from './../../interfaces/user'; 
import { AuthService } from './../services/auth.service';
import { UserService } from './../services/user.service'; 
import { ProfilOverlayComponent } from './profil-overlay/profil-overlay.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfilOverlayComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  /** Injected Services */
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  auth = inject(Auth);

  searchText: string = '';
  isActive: boolean = false;
  isOverlayVisible: boolean = false;
  isProfileOverlayVisible: boolean = false;
  isActiv: boolean = false;
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
    this.isOverlayVisible = !this.isOverlayVisible; // Toggle overlay visibility
  }

  async goToProfile(): Promise<void> {
    if (this.isGuestUser) {
      return;
    }

    this.isProfileOverlayVisible = true;

    if (this.userData) {
      this.isOverlayVisible = true;
    } else {
      console.warn('Userdaten nicht geladen');
    }
  }

  closeProfileOverlay(): void {
    this.isProfileOverlayVisible = false;
  }

  logout(): void {
    // console.log('Logging out...');
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
