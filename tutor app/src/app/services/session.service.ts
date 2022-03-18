import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { combineLatest } from "rxjs";

import { ChatService } from "./chat.service";

@Injectable({
  providedIn: "root"
})
export class SessionService {
  error;
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private chatService: ChatService
  ) {}
  addNewSession(data) {
    const firstDate = new Date(data.date);
    const secondDate = new Date(Date.parse(data.date) + 2 * 60 * 60 * 1000);
    const path = `users/${data.tutorId}/sessions`;

    const startTime = this.afs
      .collection(path, ref =>
        ref
          .orderBy("startTime")
          .startAt(firstDate)
          .endBefore(secondDate)
      )
      .valueChanges();
    const endTime = this.afs
      .collection(path, ref =>
        ref
          .orderBy("endTime")
          .startAfter(firstDate)
          .endAt(secondDate)
      )
      .valueChanges();

    combineLatest(startTime, endTime)
      .pipe(map(([one, two]) => [...one, ...two]))
      .subscribe(d => {
        console.log(d.map(e => e));
        if (d.length > 0) {
          console.log("NOT OK");
          //this.error ="The session is already booked, please book another time slot";
        } else {
          //this.error = "";
          console.log("OK");
          this.authService.getUser().then(d => {
            const sessionRef = this.afs
              .collection(path)
              .doc(this.afs.createId());
            const newData = {
              id: sessionRef.ref.id,
              startTime: firstDate,
              endTime: secondDate,
              tutorId: data.tutorId,
              tutorName: data.tutorName,
              studentId: d.uid,
              studentName: d.displayName
            };
            const chatId = this.chatService.createChat(newData);

            sessionRef.set({ ...newData, chatId: chatId });
            this.afs
              .doc(`users/${d.uid}/sessions/${sessionRef.ref.id}`)
              .set({ ...newData, chatId: chatId });
          });
        }
      });
  }

  getUserSessions(id) {
    return this.afs
      .collection(`users/${id}/sessions`, ref => ref.orderBy("startTime"))
      .valueChanges();
  }
}
