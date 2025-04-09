import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class ProfilEditOverlayComponent {
  @Input() userData: User | null = null;
  @Output() close = new EventEmitter<void>();

  updatedName: string = '';
  newUpdatedName: string = '';
  focusedInput: string = '';
  isInputFocused: boolean = false;

  constructor(private authService: AuthService) {}

  // ngOnInit() {
  //   if (this.userData) {
  //     this.updatedName = this.userData.name || '';
  //   }
  // }

  cancelEdit(): void {
    this.updatedName = '';
    this.close.emit();
  }

  async saveEdit(): Promise<void> {
    if (this.updatedName.trim() && this.userData) {
      await this.authService.updateUserName(this.updatedName.trim());
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
