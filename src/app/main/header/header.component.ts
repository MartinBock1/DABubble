import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  searchText: string = ''; // Bind the input value
  isActive: boolean = false; // To track focus state

  // Method to handle focus event
  onFocus(): void {
    this.isActive = true; // Set active state to true on focus
  }

  // Method to handle blur event
  onBlur(): void {
    this.isActive = false; // Set active state to false on blur
  }
}
