import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../interfaces/user';

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
  
  selectedAvatar = signal('assets/img/char-icons/avatar.svg');
  userData!: User;
  showOverlay = false;

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadUserData();
  }

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
            const avatarPath =
              this.userData?.avatar || 'assets/img/char-icons/avatar.svg';
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

  async selectAvatar(avatarPath: string) {
    // console.log('Ausgewählter Avatar: ', avatarPath);
    this.selectedAvatar.set(avatarPath);
    await this.authService.updateUserAvatar(avatarPath);
    await this.loadUserData();
    this.cdr.detectChanges();
  }

  continue() {
    this.showOverlay = true;

    setTimeout(() => {
      this.showOverlay = false;
      this.router.navigate(['/login']);
    }, 3000);
  }
}