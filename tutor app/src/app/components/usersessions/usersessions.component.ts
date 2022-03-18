import { Component, OnInit, ViewChild } from "@angular/core";
import { ChatService } from "src/app/services/chat.service";
import { AuthService } from "src/app/services/auth.service";
import { SessionService } from "src/app/services/session.service";
import { CountdownComponent } from "ngx-countdown";

@Component({
  selector: "app-usersessions",
  templateUrl: "./usersessions.component.html",
  styleUrls: ["./usersessions.component.css"]
})
export class UsersessionsComponent implements OnInit {
  now = new Date();
  @ViewChild("i", { static: false }) private countdown: CountdownComponent;
  sessions$;
  user;
  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private sessionService: SessionService
  ) {
    this.authService.getUser().then(d => {
      this.user = d;
      this.sessions$ = this.sessionService.getUserSessions(d.uid);
    });
  }

  ngOnInit() {}
  eventHandler($event) {
    console.log($event);
    if ($event.action.done) {
      this.countdown.stop();
    }
  }
  trackBySession(i, session) {
    return session.startTime;
  }
  getChatBySession(sessionid) {
    this.chatService.getChatBySession(sessionid);
  }
}
