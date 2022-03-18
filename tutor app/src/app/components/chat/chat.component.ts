import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ChatService } from "src/app/services/chat.service";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit {
  placeholder =
    "https://firebasestorage.googleapis.com/v0/b/capstone-257602.appspot.com/o/placeholder%2Favatar.gif?alt=media&token=4714bbde-a211-4cd3-b07d-87a5874dbbab";
  now = new Date();
  uid;
  chat$: Observable<any>;
  chatDetails;
  chatName;
  newMsg: string;
  chatId: string;
  chatInfo$;
  constructor(
    public chatService: ChatService,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {
    this.authService.getUser().then(d => (this.uid = d.uid));
  }

  async ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get("id");

    this.chat$ = await this.chatService.getByChatId(this.chatId);

    this.chatDetails = await this.chatService.getChatDetails(this.chatId);
    this.chatInfo$ = this.chatService.getChatInfo(this.chatId);
    //  console.log(this.chatDetails);
  }
  submit() {
    this.chatService.sendMessage(this.chatId, this.newMsg);
    this.newMsg = "";
  }
  trackByCreated(i, msg) {
    return msg.createdAt;
  }
  scrollToBottom() {
    document.getElementsByClassName(
      "mat-list"
    )[0].scrollTop = document.getElementsByClassName(
      "mat-list"
    )[0].scrollHeight;
  }
}
