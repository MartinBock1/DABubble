import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

/**
 * UserService is responsible for handling user-related operations,
 * including checking if a user exists, creating a user, and retrieving user data.
 * It also manages the current user state and allows for tracking the current user
 * through a BehaviorSubject.
 *
 * Der UserService ist für die Verwaltung von benutzerspezifischen Operationen verantwortlich,
 * einschließlich der Überprüfung, ob ein Benutzer existiert, der Erstellung eines Benutzers
 * und dem Abrufen von Benutzerdaten. Er verwaltet auch den aktuellen Benutzerzustand
 * und ermöglicht es, den aktuellen Benutzer durch ein BehaviorSubject zu verfolgen.
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCollection: CollectionReference<DocumentData>;
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  /**
   * Constructor to initialize the UserService with Firestore.
   * It also checks if there's a stored guest user in localStorage
   * and sets it as the current user if available.
   *
   * Konstruktor zur Initialisierung des UserService mit Firestore.
   * Es wird auch geprüft, ob ein gespeicherter Gastbenutzer im localStorage vorhanden ist
   * und dieser wird als aktueller Benutzer gesetzt, falls verfügbar.
   */
  constructor(private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, 'users');
    const storedGuestUser = localStorage.getItem('guestUser');
    if (storedGuestUser) {
      const guestUser = JSON.parse(storedGuestUser);
      this.setCurrentUser(guestUser);
    }
  }

  /**
   * Checks if a user exists by UID.
   *
   * Überprüft, ob ein Benutzer anhand der UID existiert.
   *
   * @param {string} uid - The UID of the user to check.
   * @returns {Promise<boolean>} - Returns a promise that resolves to true if the user exists, otherwise false.
   */
  async checkIfUserExists(uid: string): Promise<boolean> {
    const q = query(this.usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  /**
   * Creates a new user with the provided user data.
   *
   * Erstellt einen neuen Benutzer mit den angegebenen Benutzerdaten.
   *
   * @param {object} userData - The user data to create the new user.
   * @param {string} userData.uid - The unique identifier of the user.
   * @param {string} userData.name - The name of the user.
   * @param {string} userData.email - The email of the user.
   * @param {string} userData.avatar - The avatar image of the user.
   * @returns {Promise<void>} - Returns a promise that resolves once the user is created.
   */
  async createUser(userData: {
    uid: string;
    name: string;
    email: string;
    avatar: string;
  }): Promise<void> {
    const userExists = await this.checkIfUserExists(userData.uid);
    if (userExists) {
      console.log('Benutzer existiert bereits');
      return;
    }
    await addDoc(this.usersCollection, userData);
  }

  /**
   * Retrieves user data by UID.
   *
   * Ruft Benutzerdaten anhand der UID ab.
   *
   * @param {string} uid - The UID of the user to retrieve.
   * @returns {Promise<any>} - Returns a promise that resolves with the user data if the user exists, otherwise null.
   */
  async getUserByUID(uid: string): Promise<any> {
    try {
      const q = query(this.usersCollection, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        this.currentUserSubject.next(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Fehler beim Abrufen des Benutzers:', error);
      return null;
    }
  }

  /**
   * Sets the current user in the service.
   *
   * Setzt den aktuellen Benutzer im Service.
   *
   * @param {any} user - The user object to set as the current user.
   */
  setCurrentUser(user: any): void {
    if (user) {
      this.currentUserSubject.next(user);
    } else {
      console.warn('Ungültige Benutzerdaten.');
    }
  }
}
