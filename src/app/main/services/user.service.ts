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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCollection: CollectionReference<DocumentData>;
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, 'users');
  }

  async checkIfUserExists(uid: string): Promise<boolean> {
    const q = query(this.usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // async createUser(userData: {
  //   uid: string;
  //   name: string;
  //   email: string;
  //   avatar: string;
  //   // createdAt?: Date;
  // }): Promise<void> {
  //   try {
  //     await addDoc(this.usersCollection, {
  //       ...userData,
  //     });
  //     // console.log('User erfolgreich hinzugefügt.');
  //   } catch (error) {
  //     // console.error('Fehler beim Speichern des Users:', error);
  //     throw error;
  //   }
  // }
  async createUser(userData: {
    uid: string;
    name: string;
    email: string;
    avatar: string;
  }): Promise<void> {
    await addDoc(this.usersCollection, userData);
  }

  // async getUserByUID(uid: string): Promise<any> {
  //   const q = query(
  //     collection(this.firestore, 'users'),
  //     where('uid', '==', uid)
  //   );
  //   const querySnapshot = await getDocs(q);
  //   if (!querySnapshot.empty) {
  //     return querySnapshot.docs[0].data();
  //   }
  //   return null;
  // }
  async getUserByUID(uid: string): Promise<any> {
    const q = query(this.usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      this.currentUserSubject.next(user); // 👈 hier wird aktualisiert
      return user;
    }
    return null;
  }
}
