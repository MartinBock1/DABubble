import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ContentComponent } from './content/content.component';
import { ChooseAvatarComponent } from './signup/choose-avatar/choose-avatar.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    LoginComponent,
    SignupComponent,
    ContentComponent,
    ChooseAvatarComponent,
    PasswordResetComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
