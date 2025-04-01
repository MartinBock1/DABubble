import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  /** UI States */
  isPageLoaded: boolean = false;
  isLogoShifted: boolean = false;
  isLogoVisible: boolean = false;
  // isBackgroundReset: boolean = false;

  faded = false;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.faded = true;      
    }, 3000);

    setTimeout(() => {
      this.isLogoVisible = true;
    }, 3200);

    setTimeout(() => {
      this.isLogoShifted = true;
      this.isPageLoaded = true;
    }, 3300);
  }
}

