import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { map, debounceTime, take } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  observable$;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private afs: AngularFirestore
  ) {}
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ["", [Validators.required], this.isUsernameTaken.bind(this)],
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
      ],
      confirmPass: ["", [Validators.required, this.isPasswordMatch.bind(this)]]
    });
  }
  get username() {
    return this.registerForm.get("username");
  }
  get email() {
    return this.registerForm.get("email");
  }

  get password() {
    return this.registerForm.get("password");
  }
  get confirmPass() {
    return this.registerForm.get("confirmPass");
  }

  isPasswordMatch(control: AbstractControl) {
    //console.log('here');
    if (control.value === "" || this.password.value === "") return null;
    return this.password.value === control.value
      ? null
      : { passwordmatch: true };
  }

  register() {
    this.authService.register(this.registerForm.value);
  }
  isUsernameTaken(control: AbstractControl) {
    if (control.value == "") return null;
    // console.log(control.value);
    var a = false;
    return this.authService.checkUsername(control.value).pipe(
      debounceTime(500),
      take(1),
      map(snapshot => {
        return snapshot.size > 0 ? { usernameTaken: true } : null;
      })
    );
  }
  onKeyDown(event: KeyboardEvent) {
    return event.keyCode != 32 ? event : event.preventDefault();
  }
  get errorMessage() {
    let { code } = this.authService.error || "";
    console.log(code);

    if (!code) return null;
    //https://stackoverflow.com/questions/49039712/cannot-access-error-message-from-auth-service-in-another-component-angular-4
    switch (code) {
      case "auth/email-already-in-use": {
        return "Email already been used by another user";
      }
      case "auth/invalid-email": {
        return "Invalid email";
      }
      case "auth/wrong-password": {
        return "Invalid email or password";
      }
    }

    return "Something went wrong";
  }
}
