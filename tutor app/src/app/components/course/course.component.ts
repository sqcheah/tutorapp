import { Component, OnInit } from "@angular/core";
import { CourseService } from "src/app/services/course.service";
import { AuthService } from "src/app/services/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"]
})
export class CourseComponent implements OnInit {
  courses$;
  user;
  createCourseForm: FormGroup;
  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.courses$ = this.courseService.getCourseList();
    console.log(this.courses$);
    this.authService.getUser().then(user => {
      this.user = user;
      if (user.roles == "tutor") {
        this.createCourseForm = this.fb.group({
          courseName: ["", [Validators.required]],
          subject: ["", [Validators.required]]
          //limit: ["", [Validators.required]]
        });
      }
    });
  }
  get courseName() {
    return this.createCourseForm.get("courseName");
  }
  get subject() {
    return this.createCourseForm.get("subject");
  }

  createCourse() {
    let icon;
    if (this.subject.value == "java") {
      icon = "https://img.icons8.com/color/48/000000/java-coffee-cup-logo.png";
    } else if (this.subject.value == "python") {
      icon = "https://img.icons8.com/color/48/000000/python.png";
    } else if (this.subject.value == "javascript") {
      icon = "https://img.icons8.com/color/48/000000/javascript.png";
    } else {
      icon = "";
    }
    const data = {
      tutorId: this.user.uid,
      courseName: this.courseName.value,
      subject: this.subject.value,
      icon: icon
    };
    this.courseService.addCourse(data);
  }
  deleteCourse(courseId) {
    this.courseService.deleteCourse(courseId);
  }
}
