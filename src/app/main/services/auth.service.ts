import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  googleAuthProvider(auth: Auth, googleAuthProvider: any) {
    throw new Error('Method not implemented.');
  }
  constructor() {}
  auth = inject(Auth);
  firestore = inject(Firestore);
  name = '';

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
}
