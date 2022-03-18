import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class AdminService {
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  getTutorName() {
    const pending$ = this.afs
      .collection("tutors", ref => ref.where("status", "==", "pending"))
      .valueChanges();
    const rejected$ = this.afs
      .collection("tutors", ref => ref.where("status", "==", "rejected"))
      .valueChanges();
    return combineLatest(pending$, rejected$).pipe(
      map(([one, two]) => [...one, ...two])
    );
  }
  getDetailById(id) {
    return this.afs.doc(`tutors/${id}`).valueChanges();
  }

  updateTutorInfo(tutorInfo) {
    this.afs.doc(`tutors/${tutorInfo.id}`).set(tutorInfo, { merge: true });
    const password = "Tut0r123";
    if (tutorInfo.status == "approved") {
      this.afAuth.auth
        .createUserWithEmailAndPassword(tutorInfo.email, password)
        .then(user => {
          const data = {
            uid: user.user.uid,
            email: user.user.email,
            displayName: `${tutorInfo.lastName.trim() +
              tutorInfo.firstName.trim()}`,
            photoURL:
              "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab",
            roles: "tutor",
            subjects: tutorInfo.subjects
          };
          this.authService.updateUserData(data);
        });
    }
  }
}
