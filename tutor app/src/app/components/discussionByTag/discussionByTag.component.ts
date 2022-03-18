import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { DiscussionService } from "src/app/services/discussion.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-discussionByTag",
  templateUrl: "./discussionByTag.component.html",
  styleUrls: ["./discussionByTag.component.css"]
})
export class DiscussionByTagComponent implements OnInit, OnDestroy {
  tagId;
  posts$;
  placeholder =
    "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab";
  subscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private discussionService: DiscussionService
  ) {}

  ngOnInit() {
    this.subscription = this.route.paramMap.subscribe(routeParams => {
      this.tagId = routeParams.get("tag");
      this.posts$ = this.getPostByTag(this.tagId);
    });
  }
  getPostByTag(tag) {
    return this.discussionService.getPostsByTag(tag).pipe(map(value => value));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
