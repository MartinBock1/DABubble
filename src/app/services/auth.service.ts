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
  updatePassword as firebaseUpdatePassword,
} from 'firebase/auth';
import { UserService } from './user.service';
import { User } from './../interfaces/user';

/**
 * AuthService is responsible for handling authentication-related operations,
 * including user sign-up, login, logout, password reset, and profile updates.
 * It interacts with Firebase Authentication and Firestore to manage user authentication
 * and store user data.
 *
 * Der AuthService ist für die Verwaltung von Authentifizierungsoperationen verantwortlich,
 * einschließlich der Benutzerregistrierung, Anmeldung, Abmeldung, Passwortzurücksetzung und Profilaktualisierungen.
 * Er interagiert mit Firebase Authentication und Firestore, um die Benutzerauthentifizierung zu verwalten
 * und Benutzerdaten zu speichern.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private userService: UserService) {}

  auth = inject(Auth);
  firestore = inject(Firestore);
  name = '';
  isUserLoggedIn = false;

  /**
   * Google authentication method (not yet implemented).
   *
   * Google-Authentifizierungsmethode (noch nicht implementiert).
   *
   * @param auth - The Auth instance from Firebase Authentication.
   * @param googleAuthProvider - The Google Auth Provider instance.
   */
  googleAuthProvider(auth: Auth, googleAuthProvider: any) {
    throw new Error('Method not implemented.');
  }

  /**
   * Signs up a user with the provided name, email, and password.
   * Creates a new user in Firebase Authentication and adds user data to Firestore.
   *
   * Meldet einen Benutzer mit dem angegebenen Namen, E-Mail und Passwort an.
   * Erstellt einen neuen Benutzer in Firebase Authentication und fügt Benutzerdaten zu Firestore hinzu.
   *
   * @param {string} name - The name of the user to register.
   * @param {string} email - The email of the user to register.
   * @param {string} password - The password for the new user.
   * @returns {Promise<void>} - A promise that resolves once the user is signed up.
   */
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
          avatar: 'avatar.svg',
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

  /**
   * Updates the avatar of the current user.
   * The avatar is stored in Firestore under the user document.
   *
   * Aktualisiert das Avatar des aktuellen Benutzers.
   * Das Avatar wird in Firestore unter dem Benutzerdokument gespeichert.
   *
   * @param {string} avatarPath - The path to the new avatar image.
   * @returns {Promise<void>} - A promise that resolves once the avatar is updated.
   */
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

  /**
   * Logs in a user with the provided email and password.
   * Checks if the user exists in Firestore and returns the user data.
   *
   * Meldet einen Benutzer mit der angegebenen E-Mail und dem Passwort an.
   * Überprüft, ob der Benutzer in Firestore existiert und gibt die Benutzerdaten zurück.
   *
   * @param {string} email - The email of the user to log in.
   * @param {string} password - The password of the user to log in.
   * @returns {Promise<any>} - A promise that resolves with user data if login is successful, or an error message.
   */
  async loginUser(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      if (userCredential) {
        const user = userCredential.user;
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

  /**
   * Sends a password reset email to the provided email address.
   *
   * Sendet eine Passwort-Reset-E-Mail an die angegebene E-Mail-Adresse.
   *
   * @param {string} email - The email address to send the password reset email to.
   * @returns {Promise<void>} - A promise that resolves once the password reset email is sent.
   */
  passwordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email).then(() => {
      // console.log('Passwort-Reset-E-Mail gesendet!');
    });
  }

  async updatePassword(newPassword: string): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      try {
        await firebaseUpdatePassword(currentUser, newPassword);
        console.log('Passwort erfolgreich aktualisiert');
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Passworts:', error);
        throw error; 
      }
    } else {
      console.log('Kein Benutzer angemeldet');
    }
  }

  /**
   * Logs out the current user and removes any guest user data from local storage.
   *
   * Meldet den aktuellen Benutzer ab und entfernt alle Gastbenutzerdaten aus dem localStorage.
   *
   * @returns {Promise<void>} - A promise that resolves once the user is logged out.
   */
  logout(): Promise<void> {
    return signOut(this.auth)
      .then(() => {
        // console.log('User wurde ausgeloggt');
        localStorage.removeItem('guestUser');
        this.isUserLoggedIn = false;
        this.name = '';
      })
      .catch((error) => {
        console.error('Mist, ist schief gelaufen', error);
      });
  }

  /**
   * Gets the current user's data from Firestore based on authentication state.
   * Returns user data if the user is logged in, otherwise null.
   *
   * Ruft die Benutzerdaten des aktuellen Benutzers aus Firestore basierend auf dem Authentifizierungsstatus ab.
   * Gibt die Benutzerdaten zurück, wenn der Benutzer angemeldet ist, andernfalls null.
   *
   * @returns {Promise<User | null>} - A promise that resolves with the user data or null if the user is not logged in.
   */
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

  /**
   * Updates the name of the current user in Firestore and Firebase Authentication.
   *
   * Aktualisiert den Namen des aktuellen Benutzers in Firestore und Firebase Authentication.
   *
   * @param {string} newName - The new name of the user.
   * @returns {Promise<void>} - A promise that resolves once the user's name is updated.
   */
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
        await this.userService.getUserByUID(this.auth.currentUser.uid);
      }
    }
  }
}
