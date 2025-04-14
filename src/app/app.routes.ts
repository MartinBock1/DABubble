import { Routes } from '@angular/router';
// Importiere die Standalone-Komponenten
import { MainComponent } from './main/main.component';
import { LegalComponent } from './shared/legal/legal.component';
import { PolicyComponent } from './shared/policy/policy.component';
import { LoginComponent } from './main/login/login.component';
import { ChooseAvatarComponent } from './main/signup/choose-avatar/choose-avatar.component';
import { SignInMethod } from '@angular/fire/auth';
import { SignupComponent } from './main/signup/signup.component';
import { PasswordResetComponent } from './main/password-reset/password-reset.component';
import { ContentComponent } from './main/content/content.component';
import { NewPasswordComponent } from './main/password-reset/new-password/new-password.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'choose-avatar', component: ChooseAvatarComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'new-password', component: NewPasswordComponent },
  { path: 'content', component: ContentComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'policy', component: PolicyComponent },
];
