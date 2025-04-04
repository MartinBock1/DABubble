import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {
  isEditing: boolean = false;

  toggleEditState(): void {
    this.isEditing = !this.isEditing; // Toggle the state between true and false
  }
}
