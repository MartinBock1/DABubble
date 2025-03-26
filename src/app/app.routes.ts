import { Routes } from '@angular/router';
// Importiere die Standalone-Komponenten
import { MainComponent } from './main/main.component';
import { LegalComponent } from './shared/legal/legal.component';
import { PolicyComponent } from './shared/policy/policy.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'policy', component: PolicyComponent },
];
