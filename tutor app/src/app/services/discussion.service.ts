import { Injectable } from "@angular/core";

import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { firestore } from "firebase/app";

@Injectable({
  providedIn: "root"
})
export class DiscussionService {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) {}
  getAllPost() {
    return this.afs.collection("post").valueChanges();
  }
  getPostsByTag(tag: string) {
    return this.afs.collection(`tags/${tag}/posts`).valueChanges();
  }
  setPost(data) {
    const postRef = this.afs.collection("posts").doc(this.afs.createId()).ref;
    let author;
    this.authService
      .getUser()
      .then(d => {
        const content = {
          ...data,
          ...d,
          status: "pending",
          createdAt: Date.now(),
          postId: postRef.id
        };
        console.log(content);
        const increment = firestore.FieldValue.increment(1);
        const batch = this.afs.firestore.batch();
        batch.set(postRef, content);
        for (let tag of data.tags) {
          console.log(tag);
          let tagRef = this.afs.doc(`tags/${tag}`).ref;
          batch.set(tagRef, { count: increment }, { merge: true });
          batch.set(this.afs.doc(`tags/${tag}/posts/${postRef.id}`).ref, {
            ...d,
            postId: postRef.id,
            title: data.title,
            createdAt: Date.now(),
            tags: data.tags,
            status: "pending"
          });
        }
        batch.commit();
      })
      .catch(e => console.log(e));
  }
  async getPostsByPopularTags() {
    let final;
    await this.afs
      .collection("tags")
      .ref.orderBy("count", "desc")
      .limit(5)
      .get()
      .then(c => {
        let result = c.docs.map(d => d.id);
        console.log(result);
        final = result.map(id => {
          return {
            name: id,
            data: this.afs.collection(`tags/${id}/posts`).valueChanges()
          };
        });
        console.log(final);
      });
    return final;
  }
  getPostById(id) {
    return this.afs.doc(`posts/${id}`).valueChanges();
  }
  getPostComments(id) {
    return this.afs
      .collection(`posts/${id}/comments`, ref =>
        ref.orderBy("createdAt", "desc")
      )
      .snapshotChanges()
      .pipe(
        map(doc =>
          doc.map(d => {
            return { id: d.payload.doc.id, ...d.payload.doc.data() };
          })
        )
      );
  }
  setComment(id, comment) {
    this.afs.collection(`posts/${id}/comments`).add(comment);
  }

  getOptions() {
    return this.afs
      .collection("tags")
      .snapshotChanges()
      .pipe(map(c => c.map(d => d.payload.doc.id)));
  }
  deletePost(id, tag) {
    const batch = this.afs.firestore.batch();
    batch.delete(this.afs.doc(`posts/${id}`).ref);
    for (let t of tag) {
      batch.set(
        this.afs.doc(`tags/${tag}`).ref,
        {
          count: firestore.FieldValue.increment(-1)
        },
        { merge: true }
      );

      batch.delete(this.afs.doc(`tags/${tag}/posts/${id}`).ref);
      console.log(t);
    }
    batch.commit();
    this.router.navigate(["/discussion"]);
  }
  resolve(id, tag) {
    const batch = this.afs.firestore.batch();
    batch.set(
      this.afs.doc(`posts/${id}`).ref,
      { status: "solved" },
      { merge: true }
    );
    for (let t of tag) {
      batch.set(
        this.afs.doc(`tags/${t}/posts/${id}`).ref,
        {
          status: "solved"
        },
        { merge: true }
      );
    }
    batch.commit();
  }
  getPostByUID(uid) {
    return this.afs
      .collection("posts", ref => ref.where("uid", "==", uid))
      .valueChanges();
  }
  deleteComment(postId, commentId) {
    const data = {
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab",
      displayName: "Anonymous",
      createdAt: Date.now(),
      content: "This comment has been deleted due to violation of rules!"
    };
    this.afs
      .doc(`posts/${postId}/comments/${commentId}`)
      .set(data, { merge: true });
  }
}
