import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DiscussionService } from "src/app/services/discussion.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-discussionposts",
  templateUrl: "./discussionposts.component.html",
  styleUrls: ["./discussionposts.component.css"]
})
export class DiscussionpostsComponent implements OnInit {
  postId;
  post$;
  user;
  comments$;
  newComment = "";
  placeholder =
    "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab";

  constructor(
    private route: ActivatedRoute,
    private discussionService: DiscussionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get("id");
    this.post$ = this.getPost();
    this.authService.getUser().then(d => (this.user = d));
  }

  getPost() {
    return this.discussionService.getPostById(this.postId);
  }
  getComments() {
    this.comments$ = this.discussionService.getPostComments(this.postId);
  }
  setComment() {
    if (this.newComment != "") {
      this.authService.getUser().then(d => {
        let data = {
          ...d,
          content: this.newComment,
          createdAt: Date.now()
        };
        this.discussionService.setComment(this.postId, data);
        this.newComment = "";
      });
    }
  }

  trackByCreated(i, comment) {
    return comment.createdAt;
  }
  delete(id, tag) {
    this.discussionService.deletePost(id, tag);
  }
  deleteComment(postId,commentId){
    this.discussionService.deleteComment(postId,commentId);
  }
  resolve(id, tag) {
    this.discussionService.resolve(id, tag);
  }
}
