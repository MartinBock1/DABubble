import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { UserService } from './user.service';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private userService: UserService) {} // <-- UserService injizieren

  auth = inject(Auth);
  firestore = inject(Firestore);
  name = '';

  //  Authentication State
  isUserLoggedIn = false;

  googleAuthProvider(auth: Auth, googleAuthProvider: any) {
    throw new Error('Method not implemented.');
  }

  async signupUser(
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      if (this.auth.currentUser) {
        await updateProfile(this.auth.currentUser, { displayName: name });
        this.name = name;
        const usersCollection = collection(this.firestore, 'users');
        await addDoc(usersCollection, {
          name: name,
          email: email,
          avatar: 'assets/img/char-icons/avatar.svg',
          uid: user.uid,
        });
        // console.log('Benutzer-Dokument wurde hinzugefügt');
      }
    } catch (error) {
      console.error(
        'Signup error:',
        (error as any).code,
        (error as any).message
      );
    }
  }

  async updateUserAvatar(avatarPath: string) {
    if (this.auth.currentUser) {
      const usersCollection = collection(this.firestore, 'users');
      const q = query(
        usersCollection,
        where('uid', '==', this.auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error('Kein Benutzerdokument mit dieser UID gefunden');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userRef = doc(this.firestore, `users/${userDoc.id}`);

      try {
        await updateDoc(userRef, { avatar: avatarPath });
        // console.log('Avatar erfolgreich aktualisiert:', avatarPath);
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Avatars:', error);
      }
    }
  }

  async loginUser(email: string, password: string): Promise<any> {
    try {
      // Hier überprüfen wir die Authentifizierung durch Firebase.
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      if (userCredential) {
        const user = userCredential.user;

        // Hole Benutzerdaten aus Firestore
        const usersCollection = collection(this.firestore, 'users');
        const userQuery = query(usersCollection, where('uid', '==', user.uid));
        const userDoc = await getDocs(userQuery);

        if (!userDoc.empty) {
          return { valid: true, user: userDoc.docs[0].data() };
        } else {
          return {
            valid: false,
            message: 'Kein Benutzer mit dieser UID gefunden.',
          };
        }
      }
      return { valid: false, message: 'Ungültige E-Mail oder Passwort.' };
    } catch (error) {
      console.error('Fehler bei der Anmeldung:', error);
      return {
        valid: false,
        message: 'Fehler bei der Anmeldung. Bitte versuche es erneut.',
      };
    }
  }

  passwordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email).then(() => {
      // console.log('Passwort-Reset-E-Mail gesendet!');
    });
  }

  logout(): Promise<void> {
    return signOut(this.auth)
      .then(() => {
        // console.log('User wurde ausgeloggt');
        this.isUserLoggedIn = false;
        this.name = '';
      })
      .catch((error) => {
        console.error('Mist, ist schief gelaufen', error);
      });
  }

  getCurrentUserData(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(
        this.auth,
        async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            const data = await this.userService.getUserByUID(firebaseUser.uid);
            resolve(data);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  // async updateUserName(newName: string): Promise<void> {
  //   if (this.auth.currentUser) {
  //     const usersCollection = collection(this.firestore, 'users');
  //     const q = query(
  //       usersCollection,
  //       where('uid', '==', this.auth.currentUser.uid)
  //     );
  //     const querySnapshot = await getDocs(q);

  //     if (!querySnapshot.empty) {
  //       const userDoc = querySnapshot.docs[0];
  //       const userRef = doc(this.firestore, `users/${userDoc.id}`);
  //       await updateDoc(userRef, { name: newName });
  //     }
  //   }
  // }
  async updateUserName(newName: string): Promise<void> {
    if (this.auth.currentUser) {
      const usersCollection = collection(this.firestore, 'users');
      const q = query(
        usersCollection,
        where('uid', '==', this.auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(this.firestore, `users/${userDoc.id}`);
        await updateDoc(userRef, { name: newName });

        // 👇 hole die aktuellen Daten erneut, triggert UserService Update
        await this.userService.getUserByUID(this.auth.currentUser.uid);
      }
    }
  }
}
