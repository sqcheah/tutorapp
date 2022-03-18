import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  AngularFirestoreModule,
  AngularFirestore
} from "@angular/fire/firestore";
import {
  NgbModule,
  NgbTabset,
  NgbModalModule,
  NgbRatingModule,
  NgbDatepickerModule,
  NgbTimepickerModule
} from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { HomeComponent } from "./components/home/home.component";
import { AngularFireAuth, AngularFireAuthModule } from "@angular/fire/auth";
import { AuthGuard } from "./auth.guard";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { AppMaterialModule } from "./app-material.module";
import { AuthService } from "./services/auth.service";
import { firebaseConfig } from "src/environments/environment";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { ProfileComponent } from "./components/profile/profile.component";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { UploaderComponent } from "./components/uploader/uploader.component";
import { UploadTaskComponent } from "./components/upload-task/upload-task.component";
import { DropzoneDirective } from "./dropzone.directive";
import { FileSizePipe } from "./fileSize.pipe";
import { ChatComponent } from "./components/chat/chat.component";
import { DisableControlDirective } from "./DisableControl.directive";
import { CourseComponent } from "./components/course/course.component";
import { CountdownModule } from "ngx-countdown";
import { EditorComponent } from "./components/editor/editor.component";
import {
  DiscussionComponent,
  DialogExampleDialog
} from "./components/discussion/discussion.component";
import { DiscussionByTagComponent } from "./components/discussionByTag/discussionByTag.component";
import { DiscussionpostsComponent } from "./components/discussionposts/discussionposts.component";
import {
  TutorComponent,
  BookSessionDialog
} from "./components/tutor/tutor.component";
import { TutorRegComponent } from "./components/tutorReg/tutorReg.component";
import { SafePipe } from "./safe.pipe";

import {
  AdminComponent,
  TutorDetailDialog
} from "./components/admin/admin.component";
import { QuillModule } from "ngx-quill";
import { AboutusComponent } from "./components/aboutus/aboutus.component";
import { UserpostsComponent } from "./components/userposts/userposts.component";
import { ViewtutorComponent } from "./components/viewtutor/viewtutor.component";
import { UsersessionsComponent } from "./components/usersessions/usersessions.component";
import { ViewcourseComponent } from "./components/viewcourse/viewcourse.component";
import { ViewcoursecontentComponent } from "./components/viewcoursecontent/viewcoursecontent.component";
import { ViewcoursechaptersComponent } from "./components/viewcoursechapters/viewcoursechapters.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavbarComponent,
    ProfileComponent,
    UploaderComponent,
    UploadTaskComponent,
    DropzoneDirective,
    FileSizePipe,
    ChatComponent,
    DisableControlDirective,
    CourseComponent,
    EditorComponent,
    DiscussionComponent,
    DialogExampleDialog,
    DiscussionByTagComponent,
    DiscussionpostsComponent,
    TutorComponent,
    BookSessionDialog,
    TutorRegComponent,
    SafePipe,
    AdminComponent,
    TutorDetailDialog,
    AboutusComponent,
    UserpostsComponent,
    ViewtutorComponent,
    UsersessionsComponent,
    ViewcourseComponent,
    ViewcoursecontentComponent,
    ViewcoursechaptersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AppMaterialModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgbCarouselModule,
    NgbModalModule,
    AngularFireStorageModule,
    AngularFireMessagingModule,
    NgbRatingModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    QuillModule.forRoot(),
    CountdownModule
  ],
  providers: [
    AngularFireAuth,
    AuthGuard,
    AngularFirestore,
    NgbTabset,
    AuthService
  ],
  entryComponents: [DialogExampleDialog, BookSessionDialog, TutorDetailDialog],
  bootstrap: [AppComponent]
})
export class AppModule {}
