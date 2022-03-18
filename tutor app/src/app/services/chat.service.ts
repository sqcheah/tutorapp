import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { firestore } from "firebase/app";

//https://angularfirebase.com/lessons/build-group-chat-with-firestore/
@Injectable({
  providedIn: "root"
})
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) {}

  getByChatId(chatId: string) {
    console.log("getByChatId");
    return this.afs
      .collection<any>(`chats/${chatId}/messages`, ref =>
        ref.orderBy("createdAt")
      )
      .valueChanges();
  }
  getChatInfo(chatId: string) {
    console.log("getChatInfo");
    return this.afs.doc<any>(`chats/${chatId}`).valueChanges();
  }
  getChatDetails(chatId) {
    let chat;
    return this.afs
      .doc<any>(`chats/${chatId}`)
      .ref.get()
      .then(doc => {
        const memberData = {};
        this.afs
          .doc(`users/${doc.data().tutorId}`)
          .get()
          .toPromise()
          .then(d => (memberData[doc.data().tutorId] = d.data()));
        this.afs
          .doc(`users/${doc.data().studentId}`)
          .get()
          .toPromise()
          .then(d => (memberData[doc.data().studentId] = d.data()));
        return { member: memberData };
      });
  }

  async create(id) {
    console.log("create");
    const { uid, displayName } = await this.authService.getUser();
    const chatDocId = uid < id ? `${uid}_${id}` : `${id}_${uid}`;
    console.log("chatDocID", chatDocId);
    let memberName = await this.afs
      .doc(`users/${id}`)
      .ref.get()
      .then(d => d.data().displayName);
    console.log("memberName", memberName);
    const batch = this.afs.firestore.batch();
    batch.set(this.afs.doc(`chats/${chatDocId}`).ref, {
      name: memberName,
      members: [uid, id],
      createdAt: this.timestamp
    });
    batch.set(this.afs.doc(`users/${id}/chats/${chatDocId}`).ref, {
      name: `${memberName}and${displayName}`,
      members: [uid, id]
    });
    batch.set(this.afs.doc(`users/${uid}/chats/${chatDocId}`).ref, {
      name: `${memberName}and${displayName}`,
      members: [uid, id]
    });
    await batch.commit();
    return this.router.navigate(["chats", chatDocId]);
  }
  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  async sendMessage(chatId, content) {
    const { uid } = await this.authService.getUser();
    const data = {
      uid,
      content,
      createdAt: this.timestamp
    };

    if (uid) {
      const ref = await this.afs
        .collection(`chats/${chatId}/messages`)
        .add(data);
    }
  }

  async getChatBySession(sessionID) {
    const { uid } = await this.authService.getUser();
    this.afs
      .doc(`users/${uid}/sessions/${sessionID}`)
      .ref.get()
      .then(d => d.data().chatID);
  }
  createChat(data) {
    const chatRef = this.afs.collection("chats").doc(this.afs.createId());
    chatRef.set({ ...data, id: chatRef.ref.id });
    return chatRef.ref.id;
  }
}
