import { Component, OnInit, Inject } from "@angular/core";
import { AdminService } from "src/app/services/admin.service";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"]
})
export class AdminComponent implements OnInit {
  pageTitle = "Admin";
  tutor$;
  title;
  content;
  tags;
  placeholder =
    "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab";

  constructor(private adminService: AdminService, public dialog: MatDialog) {}
  ngOnInit() {
    this.tutor$ = this.adminService.getTutorName();
  }

  openDialog(tutor): void {
    const dialogRef = this.dialog.open(TutorDetailDialog, {
      width: "60vw",
      maxHeight: "90vh",
      data: { ...tutor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.updateTutorInfo(result);
      }
    });
  }
}

@Component({
  selector: "tutorinfo-dialog",
  templateUrl: "tutorinfo-dialog.html",
  styles: ["mat-form-field{width:100%;}"]
})
export class TutorDetailDialog {
  subjects: String = "";
  constructor(
    public dialogRef: MatDialogRef<TutorDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: MatDialog,
    private adminService: AdminService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateTutor() {
    this.dialogRef.close({
      subjects: this.subjects.split(","),
      ...this.data
    });
  }
}
