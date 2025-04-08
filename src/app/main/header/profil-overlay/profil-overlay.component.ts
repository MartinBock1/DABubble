import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from './../../../interfaces/user';
import { ProfilBearbeitenOverlayComponent } from './../profil-bearbeiten-overlay/profil-bearbeiten-overlay.component';


@Component({
  selector: 'app-profil-overlay',
  standalone: true,
  imports: [CommonModule, ProfilBearbeitenOverlayComponent],
  templateUrl: './profil-overlay.component.html',
  styleUrls: ['./profil-overlay.component.scss'],
})
export class ProfilOverlayComponent {
  @Input() userData: User | null = null;
  @Output() close = new EventEmitter<void>();

  showEditOverlay = false;

  closeOverlay(): void {
    this.close.emit();
  }

  openEditOverlay() {
    this.showEditOverlay = true;
  }

  closeEditOverlay() {
    this.showEditOverlay = false;
  }
}
