import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"dabubble-1a1ac","appId":"1:549731092425:web:72e4ee3dbc56de2fea8a18","storageBucket":"dabubble-1a1ac.firebasestorage.app","apiKey":"AIzaSyB1NVKl-RWfOywnRSFfSQF4ha_eK5uyfRo","authDomain":"dabubble-1a1ac.firebaseapp.com","messagingSenderId":"549731092425"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
