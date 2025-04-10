import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {
  isEditing: boolean = false;
  isLeftVisible: boolean = true;

  toggleEditState(): void {
    this.isEditing = !this.isEditing; // Toggle the state between true and false
  }

  toggleLeftPanel(): void {
    this.isLeftVisible = !this.isLeftVisible;
  }
}
