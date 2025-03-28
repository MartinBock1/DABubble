import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          apiKey: 'AIzaSyB1NVKl-RWfOywnRSFfSQF4ha_eK5uyfRo',
          authDomain: 'dabubble-1a1ac.firebaseapp.com',
          projectId: 'dabubble-1a1ac',
          storageBucket: 'dabubble-1a1ac.firebasestorage.app',
          messagingSenderId: '549731092425',
          appId: '1:549731092425:web:72e4ee3dbc56de2fea8a18',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
