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
  isLeftVisible: boolean = true;
  isChannelVisible: boolean = true;
  isMessagesVisible: boolean = true;

  toggleLeftPanel(): void {
    this.isLeftVisible = !this.isLeftVisible;
  }

  toggleChannels() {
    this.isChannelVisible = !this.isChannelVisible;
  }

  toggleMessages() {
    this.isMessagesVisible = !this.isMessagesVisible;
  }
}
