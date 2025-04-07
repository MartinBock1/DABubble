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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, 'users');
  }

  async checkIfUserExists(uid: string): Promise<boolean> {
    const q = query(this.usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  async createUser(userData: {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    createdAt?: Date;
  }): Promise<void> {
    try {
      await addDoc(this.usersCollection, {
        ...userData,
        createdAt: userData.createdAt || new Date(),
      });
      // console.log('User erfolgreich hinzugefügt.');
    } catch (error) {
      // console.error('Fehler beim Speichern des Users:', error);
      throw error;
    }
  }
}
