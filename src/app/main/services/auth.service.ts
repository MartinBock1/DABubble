import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
}
