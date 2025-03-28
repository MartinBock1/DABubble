import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  auth = inject(Auth);
  name = '';

  signupUser(name: string, email: string, password: string): void {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        console.log('auth Service create works');
        console.log(email, password, name);

        if (this.auth.currentUser) {
          updateProfile(this.auth.currentUser, {
            displayName: name,
          })
            .then(() => {
              // console.log('auth Service signup change name');
              // console.log(name);
              this.name = name;
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;

              // console.log('auth Service change name error');
              // console.log(email, password);
              // console.log(errorCode, errorMessage);
            });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        console.log('auth Service create error');
        console.log(email, password);
        console.log(errorCode, errorMessage);
      });
  }
}
