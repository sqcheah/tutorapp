import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { StorageService } from "src/app/services/storage.service";
import { Observable } from "rxjs";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  placeholder =
    "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab";
  user;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.user = this.authService.user$;
  }
  upload(event) {
    let image = event.target.files[0];
    console.log(image);
    this.storageService.uploadImage(image);
  }
  sendPasswordReset(email) {
    this.authService
      .sendPasswordResetEmail(email)
      .then(() =>
        this.snackbar.open("Password reset email sent!", "", {
          duration: 5000
        })
      )
      .catch(e => console.log(e));
  }
}
