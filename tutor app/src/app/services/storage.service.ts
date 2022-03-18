import { Injectable } from "@angular/core";
import { AngularFireStorage, StorageBucket } from "@angular/fire/storage";
import { FirebaseStorage } from "@angular/fire";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  defaultStorage: FirebaseStorage;
  otherStorage: FirebaseStorage;
  constructor(
    private afStorage: AngularFireStorage,
    private afs: AngularFirestore,
    private authService: AuthService
  ) {
    this.defaultStorage = this.afStorage.storage.app.storage();
    this.otherStorage = this.afStorage.storage.app.storage(
      "capstone-project-additional-bucket"
    );
  }
  async uploadImage(image) {
    this.authService.getUser().then(async u => {
      const userDocRef = this.afs.doc(`users/${u.uid}`);
      const path = this.afStorage.ref(`profile/${u.uid}/${image.name}`);
      const task = await path.put(image);
      const url = await path.getDownloadURL().toPromise();
      console.log(url);
      await this.afs.doc(`users/${u.uid}`).update({ photoURL: url });
    });
  }
}
