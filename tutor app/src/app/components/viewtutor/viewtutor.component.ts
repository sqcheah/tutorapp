import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TutorService } from "src/app/services/tutor.service";
import { AuthService } from "src/app/services/auth.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-viewtutor",
  templateUrl: "./viewtutor.component.html",
  styleUrls: ["./viewtutor.component.css"]
})
export class ViewtutorComponent implements OnInit {
  placeholder =
    "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab";
  id;
  tutor$;
  user;
  rating;
  avgRating;
  reviews$: Observable<any>;
  newReview = "";
  currentRate = 4;
  check = 0;
  constructor(
    private route: ActivatedRoute,
    private tutorService: TutorService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.tutor$ = this.tutorService.getTutorById(this.id);

    this.authService.getUser().then(user => (this.user = user));
  }
  showReview() {
    this.reviews$ = this.tutorService.showReview(this.id);
    this.avgRating = this.reviews$.pipe(
      map(arr => {
        const ratings = arr.map(v => v.rating);
        arr.forEach(v => {
          v.uid == this.user.uid ? (this.check = 1) : (this.check = 0);
        });

        return ratings.length
          ? ratings.reduce((total, val) => total + val) / arr.length
          : "not reviewed";
      })
    );
  }
  setReview() {
    if (this.newReview != "") {
      this.authService.getUser().then(d => {
        let data = {
          ...d,
          rating: this.currentRate,
          content: this.newReview,
          createdAt: Date.now()
        };
        this.tutorService.setReview(this.id, data);
        this.newReview = "";
      });
    }
  }

  trackByCreated(i, review) {
    return review.createdAt;
  }
}
