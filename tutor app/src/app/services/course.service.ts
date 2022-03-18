import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class CourseService {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) {}
  getChapterContent(courseId, chapterId) {
    if (
      courseId == "7aFRKFULz6aHWoMAw2Qh" ||
      courseId == "WTXdCMS0rjRyqlzdlKMs" ||
      courseId == "btXc1mBuhasKuVHRTYYB"
    ) {
      return this.afs
        .collection("courses")
        .doc(`${courseId}`)
        .collection(`${chapterId}`, ref => ref.orderBy("position"))
        .snapshotChanges()
        .pipe(
          map(doc =>
            doc.map(d => {
              return { id: d.payload.doc.id, ...d.payload.doc.data() };
            })
          )
        );
    }
    return this.afs
      .collection(`courses/${courseId}/chapters/${chapterId}/contents`, ref =>
        ref.orderBy("position")
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
  getContents(courseId, chapterId, contentId) {
    if (
      courseId == "7aFRKFULz6aHWoMAw2Qh" ||
      courseId == "WTXdCMS0rjRyqlzdlKMs" ||
      courseId == "btXc1mBuhasKuVHRTYYB"
    ) {
      return this.afs
        .doc(`courses/${courseId}/${chapterId}/${contentId}`)
        .valueChanges();
    }
    return this.afs
      .doc(`courses/${courseId}/chapters/${chapterId}/contents/${contentId}`)
      .valueChanges();
  }

  getCourseList() {
    return this.afs
      .collection<any>("courses")
      .snapshotChanges()
      .pipe(
        map(c =>
          c.map(d => {
            return {
              tutorDetails: this.afs
                .doc(`users/${d.payload.doc.data().tutorId}`)
                .valueChanges(),
              ...d.payload.doc.data(),
              courseId: d.payload.doc.id
            };
          })
        )
      );
  }
  getCourses(courseId) {
    console.log(courseId);
    if (
      courseId == "7aFRKFULz6aHWoMAw2Qh" ||
      courseId == "WTXdCMS0rjRyqlzdlKMs" ||
      courseId == "btXc1mBuhasKuVHRTYYB"
    ) {
      return;
    }

    return this.afs.collection(`courses/${courseId}/chapters`).valueChanges();
  }
  addCourse(courseData) {
    const courseRef = this.afs.collection("courses").doc(this.afs.createId());
    courseRef.set({ courseId: courseRef.ref.id, ...courseData });
    this.router.navigate(["/course", courseRef.ref.id]);
  }
  addChapter(courseId, courseData) {
    const chapterRef = this.afs
      .collection(`courses/${courseId}/chapters`)
      .doc(this.afs.createId());
    chapterRef.set({ id: chapterRef.ref.id, ...courseData });
    this.router.navigate(["/course", courseId, chapterRef.ref.id]);
  }
  addContent(courseId, chapterId, data) {
    const contentRef = this.afs
      .collection(`courses/${courseId}/chapters/${chapterId}/contents`)
      .doc(this.afs.createId());
    contentRef.set({ id: contentRef.ref.id, ...data });
    this.router.navigate(["/course", courseId, chapterId, contentRef.ref.id]);
  }
  getPopularCourses() {
    return this.afs
      .collection<any>("courses", ref => ref.limit(3))
      .snapshotChanges()
      .pipe(
        map(c =>
          c.map(d => {
            return {
              tutorDetails: this.afs
                .doc(`users/${d.payload.doc.data().tutorId}`)
                .valueChanges(),
              ...d.payload.doc.data(),
              courseId: d.payload.doc.id
            };
          })
        )
      );
  }
  deleteCourse(courseId) {
    if (
      courseId == "7aFRKFULz6aHWoMAw2Qh" ||
      courseId == "WTXdCMS0rjRyqlzdlKMs" ||
      courseId == "btXc1mBuhasKuVHRTYYB"
    ) {
      console.log("cannot be deleted");
    } else {
      this.afs.doc(`courses/${courseId}`).delete();
    }
  }
}
