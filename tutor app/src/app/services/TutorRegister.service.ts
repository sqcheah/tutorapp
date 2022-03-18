import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: "root"
})
export class TutorRegisterService {
  status;
  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}
  async submit(data) {
    const storage = this.afStorage.storage.app.storage(
      "capstone-project-additional-bucket"
    );

    this.status = "Uploading image...";
    const imageRef = storage.ref(
      `tutorRegisterFolder/${Date.now()}_${
        data.imageFile.split("\\").reverse()[0]
      }`
    );
    this.status = "Uploading video...";
    const videoRef = storage.ref(
      `tutorRegisterFolder/${Date.now()}_${
        data.videoFile.split("\\").reverse()[0]
      }`
    );
    await imageRef
      .put(data.image)
      .catch(e => (this.status = "Upload Image Error"));
    await videoRef
      .put(data.video)
      .catch(e => (this.status = "Upload Video Error"));
    const imageURL = await imageRef.getDownloadURL();
    const videoURL = await videoRef.getDownloadURL();
    let newdata = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contact: data.contact,
      image: imageURL,
      video: videoURL,
      description: data.description,
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab",
      registertime: Date.now(),
      status: "pending"
    };

    const path = this.afs.collection("tutors").doc(this.afs.createId());
    path.set({ id: path.ref.id, ...newdata });
    this.status = "Success. Please wait patiently for the approval!!";
  }
}
