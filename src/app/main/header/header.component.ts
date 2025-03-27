import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  searchText: string = ''; // Bind the input value
  isActive: boolean = false; // To track focus state
  isOverlayVisible: boolean = false; // To track overlay visibility

  // Method to handle focus event
  onFocus(): void {
    this.isActive = true; // Set active state to true on focus
  }

  // Method to handle blur event
  onBlur(): void {
    this.isActive = false; // Set active state to false on blur
  }

  // Method to toggle the visibility of the overlay
  toggleOverlay(): void {
    this.isOverlayVisible = !this.isOverlayVisible; // Toggle overlay visibility
  }

  // Navigate to profile page (example)
  goToProfile(): void {
    console.log('Navigating to profile...');
    // Implement profile navigation logic here
  }

  // Logout (example)
  logout(): void {
    console.log('Logging out...');
    // Implement logout logic here
  }
}
