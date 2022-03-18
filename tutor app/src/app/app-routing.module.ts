import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ChatComponent } from "./components/chat/chat.component";
import { CourseComponent } from "./components/course/course.component";
import { DiscussionComponent } from "./components/discussion/discussion.component";
import { DiscussionByTagComponent } from "./components/discussionByTag/discussionByTag.component";
import { DiscussionpostsComponent } from "./components/discussionposts/discussionposts.component";
import { TutorComponent } from "./components/tutor/tutor.component";
import { TutorRegComponent } from "./components/tutorReg/tutorReg.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AboutusComponent } from "./components/aboutus/aboutus.component";
import { UserpostsComponent } from "./components/userposts/userposts.component";
import { ViewtutorComponent } from "./components/viewtutor/viewtutor.component";
import { UsersessionsComponent } from "./components/usersessions/usersessions.component";
import { ViewcourseComponent } from "./components/viewcourse/viewcourse.component";
import { ViewcoursechaptersComponent } from "./components/viewcoursechapters/viewcoursechapters.component";
import { ViewcoursecontentComponent } from "./components/viewcoursecontent/viewcoursecontent.component";
import { AuthGuard } from "./auth.guard";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    pathMatch: "full"
    //  canActivate: [AuthGuard]
  },
  { path: "", component: HomeComponent, pathMatch: "full" },
  {
    path: "discussion",
    component: DiscussionComponent,
    pathMatch: "full"
  },
  {
    path: "discussion/tag/:tag",
    component: DiscussionByTagComponent,
    pathMatch: "full"
  },
  {
    path: "discussion/post/:id",
    component: DiscussionpostsComponent,
    pathMatch: "full",
    canActivate: [AuthGuard]
  },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "chats/:id", component: ChatComponent, canActivate: [AuthGuard] },
  { path: "course", component: CourseComponent, canActivate: [AuthGuard] },
  { path: "tutor", component: TutorComponent, canActivate: [AuthGuard] },
  {
    path: "tutor/:id",
    component: ViewtutorComponent,
    canActivate: [AuthGuard]
  },
  { path: "posts", component: UserpostsComponent, canActivate: [AuthGuard] },
  { path: "tutorReg", component: TutorRegComponent },
  { path: "admin", component: AdminComponent, canActivate: [AuthGuard] },
  { path: "aboutus", component: AboutusComponent },
  {
    path: "sessions",
    component: UsersessionsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "course/:courseId",
    component: ViewcourseComponent,
    pathMatch: "full",
    canActivate: [AuthGuard]
  },

  {
    path: "course/:courseId/:chapterId",
    component: ViewcoursechaptersComponent,
    pathMatch: "full",
    canActivate: [AuthGuard]
  },
  {
    path: "course/:courseId/:chapterId/:contentId",
    component: ViewcoursecontentComponent,
    pathMatch: "full",
    canActivate: [AuthGuard]
  },
  { path: "**", component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
