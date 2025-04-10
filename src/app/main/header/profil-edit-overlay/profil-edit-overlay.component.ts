import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interfaces/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profil-edit-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-edit-overlay.component.html',
  styleUrl: './profil-edit-overlay.component.scss',
})
export class ProfilEditOverlayComponent implements OnInit {
  @Input() userData: User | null = null;
  @Output() close = new EventEmitter<void>();

  avatarOptions: string[] = [
    'elise-roth.svg',
    'elias-neumann.svg',
    'frederik-beck.svg',
    'noah-braun.svg',
    'sofia-müller.svg',
    'steffen-hoffmann.svg',
  ];

  updatedName: string = '';
  newUpdatedName: string = '';
  focusedInput: string = '';
  isInputFocused: boolean = false;
  selectedAvatar: string = '';
  avatarChanged: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (this.userData?.avatar) {
      this.selectedAvatar = this.userData.avatar;
    }
  }
  
  async selectAvatar(avatarFileName: string): Promise<void> {
    if (this.selectedAvatar !== avatarFileName) {
      this.selectedAvatar = avatarFileName;
      this.avatarChanged = true;
    }
  }

  cancelEdit(): void {
    this.updatedName = '';
    this.close.emit();
  }
 
  async saveEdit(): Promise<void> {
    const trimmedName = this.updatedName.trim();
    const nameChanged = trimmedName && trimmedName !== this.userData?.name;

    if (nameChanged) {
      await this.authService.updateUserName(trimmedName);
    }

    if (this.avatarChanged && this.selectedAvatar && this.userData) {
      await this.authService.updateUserAvatar(this.selectedAvatar);
      this.userData.avatar = this.selectedAvatar;
    }

    if (nameChanged || this.avatarChanged) {
      this.close.emit(); 
    }
  }

  focusInput(input: HTMLInputElement) {
    input.focus();
  }

  onFocus(inputName: string) {
    this.focusedInput = inputName;
    this.isInputFocused = true;
  }

  onBlur() {
    this.focusedInput = '';
    this.isInputFocused = false;
  }
}
