import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-animation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animation.component.html',
  styleUrl: './animation.component.scss',
})
export class AnimationComponent implements OnInit {
  isMobile: boolean = false;
  faded: boolean = false;
  /** UI States */
  // isPageLoaded: boolean = false;
  isLogoShifted: boolean = false;
  isLogoVisible: boolean = false;
  animationFinished: boolean = false; // Steuerung für Sichtbarkeit der Login-Seite

  /** Check if animation already played */
  isAnimationPlayed: boolean = false;

  // HostListener, um auf die Bildschirmgröße zu reagieren
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth <= 600;
  }

  constructor() {}

  ngOnInit(): void {
    // this.isAnimationPlayed =
    //   localStorage.getItem('isAnimationPlayed') === 'true';

    if (!this.isAnimationPlayed) {
      this.isMobile = window.innerWidth <= 600; // Initialwert
      
      setTimeout(() => {
        this.faded = true;
      }, 3000);
      setTimeout(() => {
        this.isLogoVisible = true;
      }, 3100);
      setTimeout(() => {
        this.isLogoShifted = true;
      }, 3300);
      // setTimeout(() => {
      //   this.animationFinished = true; // Animation ist fertig, Login-Seite anzeigen
      // }, 4500);
      // localStorage.setItem('isAnimationPlayed', 'true');
    } else {
      // Setze die Seite in den Zustand nach der Animation
      this.faded = true;
      this.isLogoVisible = true;
      this.isLogoShifted = true;
      this.animationFinished = true;
    }
  }
}
