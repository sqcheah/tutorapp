import { Component, OnInit } from "@angular/core";
import { DiscussionService } from "src/app/services/discussion.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-userposts",
  templateUrl: "./userposts.component.html",
  styleUrls: ["./userposts.component.css"]
})
export class UserpostsComponent implements OnInit {
  id;
  placeholder =
    "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab";

  constructor(
    private discussionService: DiscussionService,
    private authService: AuthService
  ) {}
  posts$;
  ngOnInit() {
    this.authService.getUser().then(d => {
      this.id = d.uid;
      console.log(this.id);
      this.posts$ = this.discussionService.getPostByUID(this.id);
    });
  }
}
