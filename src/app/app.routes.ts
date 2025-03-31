import { Routes } from '@angular/router';
// Importiere die Standalone-Komponenten
import { MainComponent } from './main/main.component';
import { LegalComponent } from './shared/legal/legal.component';
import { PolicyComponent } from './shared/policy/policy.component';
import { LoginComponent } from './main/login/login.component';
import { ChooseAvatarComponent } from './main/signup/choose-avatar/choose-avatar.component';
import { SignInMethod } from '@angular/fire/auth';
import { SignupComponent } from './main/signup/signup.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'choose-avatar', component: ChooseAvatarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'policy', component: PolicyComponent },
];
