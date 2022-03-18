import { Component, OnInit, Inject } from "@angular/core";
import { TutorService } from "src/app/services/tutor.service";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatChipInputEvent,
  MatDialog
} from "@angular/material";

import {
  NgbCalendar,
  NgbDateStruct,
  NgbDatepickerConfig,
  NgbTimeStruct
} from "@ng-bootstrap/ng-bootstrap";
import { FormControl, Validators } from "@angular/forms";
import { SessionService } from "src/app/services/session.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-tutor",
  templateUrl: "./tutor.component.html",
  styleUrls: ["./tutor.component.css"]
})
export class TutorComponent implements OnInit {
  tutors$;
  date;
  content;
  tags;
  duration;
  data;
  user;
  placeholder =
    "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab";
  error;
  constructor(
    private tutorService: TutorService,
    public dialog: MatDialog,
    private sessionService: SessionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.tutors$ = this.tutorService.getTutorsList();
    this.authService.getUser().then(user => (this.user = user));
  }
  openDialog(tutor): void {
    const dialogRef = this.dialog.open(BookSessionDialog, {
      width: "60vw",
      maxHeight: "90vh",
      data: { date: this.date, duration: this.duration, ...tutor }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        const data = {
          date: result.date,
          tutorName: result.tutorName,
          tutorId: result.id
        };
        if (new Date(result.date) < new Date()) {
          this.error = "Date must be larger than current time";
        } else {
          this.sessionService.addNewSession(data);
        }
      }
    });
  }
  get addNewSessionError() {
    return this.sessionService.error;
  }
}

@Component({
  selector: "book-session-dialog",
  templateUrl: "book-session.html"
})
export class BookSessionDialog {
  duration;
  time: NgbTimeStruct;
  model: NgbDateStruct;
  date: { year: number; month: number };
  today = new Date();
  constructor(
    public dialogRef: MatDialogRef<BookSessionDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private config: NgbDatepickerConfig,
    private calendar: NgbCalendar
  ) {
    config.minDate = {
      year: this.today.getFullYear(),
      month: this.today.getMonth() + 1,
      day: this.today.getDate()
    };
    this.duration = new FormControl("", { validators: Validators.required });
  }

  ctrl = new FormControl(
    { hour: 8, minute: 0, second: 0 },
    (control: FormControl) => {
      const value = control.value;
      if (!value) {
        return null;
      }
      if (value.hour < 8) {
        return { tooEarly: true };
      }
      if (value.hour > 16) {
        return { tooLate: true };
      }
      return null;
    }
  );
  cancel(): void {
    console.log(this.duration);
    this.dialogRef.close();
  }

  submit(tutor) {
    console.log(tutor);
    this.dialogRef.close({
      date: `${this.model.year}-${this.model.month}-${this.model.day} ${this.ctrl.value.hour}:${this.ctrl.value.minute}`,
      tutorName: tutor.displayName,
      id: tutor.uid
    });
  }
}
