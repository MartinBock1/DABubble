import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from './../../../interfaces/user';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-profil-bearbeiten-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-bearbeiten-overlay.component.html',
  styleUrl: './profil-bearbeiten-overlay.component.scss',
})
export class ProfilBearbeitenOverlayComponent {
  @Input() userData: User | null = null;
  @Output() close = new EventEmitter<void>();

  updatedName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (this.userData) {
      this.updatedName = this.userData.name || '';
    }
  }

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
}
