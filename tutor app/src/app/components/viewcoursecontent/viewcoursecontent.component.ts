import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: "app-viewcoursecontent",
  templateUrl: "./viewcoursecontent.component.html",
  styleUrls: ["./viewcoursecontent.component.css"]
})
export class ViewcoursecontentComponent implements OnInit {
  courseId;
  chapterId;
  contentId;
  content$;
  constructor(
    private route: ActivatedRoute,
    private courseSevice: CourseService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get("courseId");
    this.chapterId = this.route.snapshot.paramMap.get("chapterId");
    this.contentId = this.route.snapshot.paramMap.get("contentId");
    this.content$ = this.courseSevice.getContents(
      this.courseId,
      this.chapterId,
      this.contentId
    );
  }
}
