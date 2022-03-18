import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: [AuthService, AngularFireAuth]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.loginForm = this.formBuilder.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        ]
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}/)
        ]
      ]
    });
    console.log(this.loginForm);
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  login() {
    this.authService.login(this.loginForm.value, this.returnUrl);
    console.debug(this.authService.user$);
  }
  get errorMessage() {
    let { code } = this.authService.error || "";
    if (!code) return null;
    //https://stackoverflow.com/questions/49039712/cannot-access-error-message-from-auth-service-in-another-component-angular-4
    switch (code) {
      case "auth/user-not-found": {
        return "User not found！";
      }
      case "auth/user-disabled": {
        return "User disabled！";
      }
      case "auth/invalid-email": {
        return "Invalid email!";
      }
      case "auth/wrong-password": {
        return "Invalid email or password!";
      }
    }

    return "Something went wrong!";
  }
  sendPasswordReset() {
    console.log(this.email.value);
    if (this.email.value == "") {
      this.snackbar.open("Fill up the email and try again !", "", {
        duration: 5000
      });
    } else {
      this.authService
        .sendPasswordResetEmail(this.email)
        .then(() =>
          this.snackbar.open("Password reset email sent !", "", {
            duration: 5000
          })
        )
        .catch(e => console.log(e));
    }
  }
}
