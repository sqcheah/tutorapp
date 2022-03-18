import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, of } from "rxjs";
import { User } from "src/app/models/user.model";
import { switchMap, first } from "rxjs/operators";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user$: Observable<User>;
  public isLoggedIn: boolean = true;
  error;
  redirectUrl: string;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          //    console.log(`Logged In: ${Object.values(user)}`);
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          console.log("not logged In");
          return of(null);
        }
      })
    );
  }

  register({ email, password, username }) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        const data: User = {
          uid: user.user.uid,
          email: user.user.email,
          displayName: username,
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab",
          roles: "student"
        };
        this.updateUserData(data);
        this.router.navigate(["/"]);
      })
      .catch(function(error) {
        this.error = error;
        return error;
      });
    this.changeLogin(true);
  }
  login({ email, password }, returnUrl) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        this.user$ = this.afs
          .doc<User>(`users/${user.user.uid}`)
          .valueChanges();
        this.router.navigate([returnUrl]);
      })
      .catch(error => (this.error = error));
    this.changeLogin(true);
  }
  logout() {
    this.afAuth.auth.signOut();
    this.changeLogin(false);
  }
  changeLogin(bool: boolean) {
    this.isLoggedIn = bool;
  }
  getLoginStatus() {
    return this.isLoggedIn;
  }
  updateUserData(data: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${data.uid}`
    );

    userRef
      .set(data, { merge: true })
      .then(() =>
        this.afAuth.auth.signInWithEmailAndPassword(
          "admin@gmail.com",
          "Adm1n123"
        )
      );
  }

  checkUsername(username: string) {
    return this.afs
      .collection("users", ref => ref.where("displayName", "==", username))
      .get();
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }
  sendPasswordResetEmail(email) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
