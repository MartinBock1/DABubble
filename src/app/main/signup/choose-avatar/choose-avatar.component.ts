import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { User } from '../../../interfaces/user';
import { AuthService } from './../../../services/auth.service';

/**
 * The ChooseAvatarComponent allows users to select an avatar after signing up.
 * It loads the user's data, displays avatar options, and updates the selected avatar.
 *
 * Der ChooseAvatarComponent ermöglicht es Benutzern, nach der Anmeldung einen Avatar auszuwählen.
 * Er lädt die Benutzerdaten, zeigt Avatar-Optionen an und aktualisiert den ausgewählten Avatar.
 */
@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss',
})
export class ChooseAvatarComponent implements OnInit {
  /** Injected Services */
  firestore: Firestore = inject(Firestore);
  authService = inject(AuthService);
  router = inject(Router);

  selectedAvatar = signal('avatar.svg');
  userData!: User;
  showOverlay = false;

  avatarOptions: string[] = [
    'elise-roth.svg',
    'elias-neumann.svg',
    'frederik-beck.svg',
    'noah-braun.svg',
    'sofia-müller.svg',
    'steffen-hoffmann.svg',
  ];

  /**
   * Constructor injecting the ChangeDetectorRef for manual change detection.
   * @param {ChangeDetectorRef} cdr - The ChangeDetectorRef instance.
   *
   * Konstruktor, der ChangeDetectorRef für manuelle Änderungserkennung injiziert.
   * @param {ChangeDetectorRef} cdr - Die ChangeDetectorRef-Instanz.
   */
  constructor(private cdr: ChangeDetectorRef) {}

  /**
   * Implements the OnInit interface. Loads the user's data on initialization.
   *
   * Implementiert das OnInit-Interface. Lädt die Benutzerdaten bei der Initialisierung.
   */
  async ngOnInit() {
    await this.loadUserData();
  }

  /**
   * Loads the user's data from Firestore based on the current authenticated user.
   *
   * Lädt die Benutzerdaten aus Firestore basierend auf dem aktuell authentifizierten Benutzer.
   */
  private async loadUserData() {
    if (this.authService.auth.currentUser) {
      const usersRef = collection(this.firestore, 'users');
      const q = query(
        usersRef,
        where('uid', '==', this.authService.auth.currentUser.uid)
      );
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            this.userData = doc.data() as User;
            // console.log('Benutzerdaten geladen:', this.userData);
            const avatarPath = this.userData?.avatar || 'avatar.svg';
            this.selectedAvatar.set(avatarPath);
          });
        } else {
          console.error('Kein Benutzerdokument mit der UID gefunden!');
        }
      } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
      }
    }
  }

  /**
   * Returns the full URL for the given avatar path.
   * @param {string} avatar - The avatar file name.
   * @returns {string} The full URL to the avatar image.
   *
   * Gibt die vollständige URL für den angegebenen Avatar-Pfad zurück.
   * @param {string} avatar - Der Dateiname des Avatars.
   * @returns {string} Die vollständige URL zum Avatar-Bild.
   */
  getAvatarUrl(avatar: string): string {
    return `assets/img/char-icons/${avatar}`;
  }

  /**
   * Selects a new avatar and updates the user's data in Firestore.
   * @param {string} avatarPath - The path of the selected avatar.
   *
   * Wählt einen neuen Avatar aus und aktualisiert die Benutzerdaten in Firestore.
   * @param {string} avatarPath - Der Pfad des ausgewählten Avatars.
   */
  async selectAvatar(avatarPath: string) {
    // console.log('Ausgewählter Avatar: ', avatarPath);
    const selectedAvatarPath = avatarPath || 'avatar.svg'; // Standardwert, wenn leer
    this.selectedAvatar.set(selectedAvatarPath);
    await this.authService.updateUserAvatar(avatarPath);
    await this.loadUserData();
    this.cdr.detectChanges();
  }

  /**
   * Continues to the login page after showing an overlay for 3 seconds.
   *
   * Fährt fort zur Login-Seite, nachdem ein Overlay für 3 Sekunden angezeigt wurde.
   */
  continue() {
    this.showOverlay = true;

    setTimeout(() => {
      this.showOverlay = false;
      this.router.navigate(['/login']);
    }, 3000);
  }
}