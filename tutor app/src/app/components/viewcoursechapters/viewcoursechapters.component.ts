import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CourseService } from "src/app/services/course.service";
import { AuthService } from "src/app/services/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EditorComponent } from "../editor/editor.component";

@Component({
  selector: "app-viewcoursechapters",
  templateUrl: "./viewcoursechapters.component.html",
  styleUrls: ["./viewcoursechapters.component.css"]
})
export class ViewcoursechaptersComponent implements OnInit {
  @ViewChild(EditorComponent, { static: false }) child;
  courseId;
  chapterId;
  contentId;
  content$;
  user;
  createCourseChapterContentForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private courseSevice: CourseService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get("courseId");
    this.chapterId = this.route.snapshot.paramMap.get("chapterId");
    this.content$ = this.courseSevice.getChapterContent(
      this.courseId,
      this.chapterId
    );
    this.authService.getUser().then(user => {
      this.user = user;
      if (user.roles == "tutor") {
        this.createCourseChapterContentForm = this.fb.group({
          title: ["", [Validators.required]],
          position: ["", [Validators.required]]
          //limit: ["", [Validators.required]]
        });
      }
    });
  }
  get title() {
    return this.createCourseChapterContentForm.get("title");
  }
  get position() {
    return this.createCourseChapterContentForm.get("position");
  }
  createCourseChapterContent() {
    const data = {
      title: this.title.value,
      position: this.position.value,
      html: this.child.editorData
    };

    this.courseSevice.addContent(this.courseId, this.chapterId, data);
  }
}
