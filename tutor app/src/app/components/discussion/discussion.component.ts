import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { DiscussionService } from "src/app/services/discussion.service";
import { map } from "rxjs/operators";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { EditorComponent } from "../editor/editor.component";
import { AuthService } from "src/app/services/auth.service";
export interface PostData {
  title: string;
  content: string;
  tags: string[];
}

@Component({
  selector: "app-discussion",
  templateUrl: "./discussion.component.html",
  styleUrls: ["./discussion.component.css"]
})
export class DiscussionComponent implements OnInit {
  placeholder =
    "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab";
  user;
  posts$;
  title;
  content;
  tags: string[];
  data: PostData;
  array;
  filteredOptions: Observable<any>;
  myControl = new FormControl();
  options: Observable<any>;
  constructor(
    private discussionService: DiscussionService,
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.authService.getUser().then(user => {
      this.user = user;
    });
    this.array = await this.getPostByPopularTags();
    this.options = this.discussionService.getOptions();
  }

  getAllPost() {
    this.posts$ = this.discussionService.getAllPost().pipe(map(value => value));
  }
  getPostByTag(tag) {
    return this.discussionService.getPostsByTag(tag).pipe(map(value => value));
  }
  async getPostByPopularTags() {
    return this.discussionService.getPostsByPopularTags();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogExampleDialog, {
      width: "60vw",
      height: "90vh",
      data: { title: this.title, content: this.content, tags: this.tags }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        const data = {
          title: result.title,
          content: result.content,
          tags: result.tags
        };
        this.discussionService.setPost(data);
      }
    });
  }
  get controlValue() {
    return this.myControl.value;
  }
  goToTag() {
    if (this.myControl.value != null && this.myControl.value != "") {
      this.router.navigate(["/discussion", "tag", this.myControl.value]);
    }
  }
  deletePost(postId, tags) {
    this.discussionService.deletePost(postId, tags);
  }
}

@Component({
  selector: "dialog-example-dialog",
  templateUrl: "dialog-example-dialog.html",
  styles: ["mat-form-field{width:100%;}"]
})
export class DialogExampleDialog {
  @ViewChild(EditorComponent, { static: true }) child;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags = [];
  postForm;
  constructor(
    public dialogRef: MatDialogRef<DialogExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public postData: PostData
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value
      .trim()
      .toLowerCase()
      .replace(/[^A-Za-z]+/g, "");
    if (value != "") {
      if (this.tags.includes(value)) {
      } else {
        this.tags.push(value);
      }
    }
    // Reset the input value
    if (input) {
      input.value = "";
    }
  }
  submit() {
    this.dialogRef.close({
      title: this.postData.title,
      content: this.child.editorData,
      tags: this.tags
    });
  }
  remove(tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
}
