import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TutorService {
  constructor(private afs: AngularFirestore) {}

  getTutorsList() {
    return this.afs
      .collection("users", ref => ref.where("roles", "==", "tutor"))
      .valueChanges();
  }
  getTutorById(id) {
    return this.afs.doc(`users/${id}`).valueChanges();
  }
  showReview(id) {
    return this.afs.collection<any>(`users/${id}/reviews`).valueChanges();
  }
  setReview(id, data) {
    this.afs.collection(`users/${id}/reviews`).add(data);
  }
  getPopularTutors() {
    return this.afs
      .collection("users", ref => ref.where("roles", "==", "tutor").limit(3))
      .valueChanges();
  }
}
