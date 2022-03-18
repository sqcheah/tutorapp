import { Component } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent {
  title: string = "Code4Student";
  user$;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }
  routes = [
    { path: "/discussion", display: "Discussion" },

    { path: "/course", display: "Course" },
    { path: "/tutor", display: "Tutor" },
    { path: "/aboutus", display: "About Us" }
  ];
  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
