import { Component, OnInit } from "@angular/core";
import { CourseService } from "../../services/course.service";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-viewcourse",
  templateUrl: "./viewcourse.component.html",
  styleUrls: ["./viewcourse.component.css"]
})
export class ViewcourseComponent implements OnInit {
  courseId;

  content$;
  user;
  createChapterForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get("courseId");
    this.authService.getUser().then(user => {
      this.user = user;
      if (user.roles == "tutor") {
        this.createChapterForm = this.fb.group({
          chapterName: ["", [Validators.required]],
          position: ["", [Validators.required]]
          //limit: ["", [Validators.required]]
        });
      }
    });
    this.content$ = this.courseService.getCourses(this.courseId);
  }
  get chapterName() {
    return this.createChapterForm.get("chapterName");
  }
  get position() {
    return this.createChapterForm.get("position");
  }
  createCourseChapter() {
    const data = {
      chapterName: this.chapterName.value,
      position: this.position.value
    };
    //console.log(data);
    this.courseService.addChapter(this.courseId, data);
  }
}
