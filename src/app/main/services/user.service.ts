import { inject, Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  firestore: Firestore = inject(Firestore);
  userList: User[] = [];

  unsubUser;

  constructor() {
    this.unsubUser = this.subUserList();
  }

  ngOnDestroy() {
    this.unsubUser();
  }

  subUserList() {
    return onSnapshot(this.getUserRef(), (user) => {
      this.userList = [];

      user.forEach((e) => {
        this.userList.push(this.setUserObj(e.data(), e.id));
      });
    });
  }

  getUserRef() {
    return collection(this.firestore, 'contacts');
  }

  setUserObj(obj: any, id: string): User {
    return {
      id: id || '',
      name: obj.name || '',
      email: obj.email || '',
      password: obj.password || '',
    };
  }

  async addUser(item: User) {
    try {
      await addDoc(this.getUserRef(), item);
      console.log('User erstellt');
      // this.notifyContactCreated();
    } catch (err) {
      console.error('Error adding contact:', err);
    }
  }

  async deleteUser(id: string) {
    if (id) {
      await deleteDoc(doc(this.getUserRef(), id));
    }
  }

  async updateContact(
    id: string | undefined,
    newName: string | undefined,
    newEmail: string | undefined,
    newPassword: string | undefined
  ) {
    const updateRef = doc(this.getUserRef(), id);
    console.info(newName, newEmail, newPassword);

    if (newName && newEmail && newPassword) {
      await updateDoc(updateRef, {
        name: newName,
        email: newEmail,
        initials: newPassword,
      });
    }
  }
}
