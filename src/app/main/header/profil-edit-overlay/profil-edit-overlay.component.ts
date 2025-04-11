import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { User } from './../../../interfaces/user';
import { AuthService } from './../../../services/auth.service';

/**
 * Component for editing user profile information, including name and avatar.
 * This component displays an overlay with input fields and avatar selection.
 *
 * Komponente zur Bearbeitung der Benutzerprofilinformationen, einschließlich Name und Avatar.
 * Diese Komponente zeigt ein Overlay mit Eingabefeldern und Avatarauswahl an.
 */
@Component({
  selector: 'app-profil-edit-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-edit-overlay.component.html',
  styleUrl: './profil-edit-overlay.component.scss',
})
export class ProfilEditOverlayComponent implements OnInit {
  /**
   * User data passed into the component for editing.
   * Benutzerdaten, die zum Bearbeiten in die Komponente übergeben werden.
   */
  @Input() userData: User | null = null;

  /**
   * Event emitter that notifies parent component to close the overlay.
   * EventEmitter, der die Elternkomponente benachrichtigt, das Overlay zu schließen.
   */
  @Output() close = new EventEmitter<void>();

  /** Available avatar options to choose from. */
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

  /**
   * Constructor injecting the AuthService.
   *
   * Konstruktor, der den AuthService injiziert.
   */
  constructor(private authService: AuthService) {}

  /**
   * Initializes component state, setting the initial avatar if user data exists.
   *
   * Initialisiert den Zustand der Komponente und setzt den Avatar, falls Benutzerdaten vorhanden sind.
   */
  ngOnInit() {
    if (this.userData?.avatar) {
      this.selectedAvatar = this.userData.avatar;
    }
  }

  /**
   * Handles avatar selection and marks if the avatar has changed.
   *
   * Behandelt die Avatar-Auswahl und markiert, ob der Avatar geändert wurde.
   *
   * @param avatarFileName - The selected avatar filename – Der ausgewählte Avatar-Dateiname.
   */
  async selectAvatar(avatarFileName: string): Promise<void> {
    if (this.selectedAvatar !== avatarFileName) {
      this.selectedAvatar = avatarFileName;
      this.avatarChanged = true;
    }
  }

  /**
   * Cancels the editing and emits the close event.
   *
   * Bricht die Bearbeitung ab und sendet das Close-Event.
   */
  cancelEdit(): void {
    this.updatedName = '';
    this.close.emit();
  }

  /**
   * Saves changes to the user's name and avatar if they have been modified.
   * Emits the close event after saving.
   *
   * Speichert Änderungen am Namen und Avatar des Benutzers, falls diese geändert wurden.
   * Sendet das Close-Event nach dem Speichern.
   */
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

  /**
   * Focuses the specified input field.
   *
   * Setzt den Fokus auf das angegebene Eingabefeld.
   *
   * @param input - The input element to focus – Das zu fokussierende Eingabefeld.
   */
  focusInput(input: HTMLInputElement) {
    input.focus();
  }

  /**
   * Handles focus event on an input field.
   *
   * Behandelt das Fokus-Ereignis eines Eingabefelds.
   *
   * @param inputName - The name of the focused input field – Der Name des fokussierten Eingabefelds.
   */
  onFocus(inputName: string) {
    this.focusedInput = inputName;
    this.isInputFocused = true;
  }

  /**
   * Handles blur event to reset focus tracking.
   *
   * Behandelt das Blur-Ereignis und setzt den Fokus-Status zurück.
   */
  onBlur() {
    this.focusedInput = '';
    this.isInputFocused = false;
  }
}
