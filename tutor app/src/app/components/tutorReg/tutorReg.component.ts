import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup
} from "@angular/forms";
import { TutorRegisterService } from "src/app/services/TutorRegister.service";

@Component({
  selector: "app-tutorReg",
  templateUrl: "./tutorReg.component.html",
  styleUrls: ["./tutorReg.component.css"]
})
export class TutorRegComponent implements OnInit {
  tutorRegisterForm: FormGroup;
  observable$;

  imageData: File = null;
  videoData: File = null;
  imageURL: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private tutorRegisterService: TutorRegisterService
  ) {}
  ngOnInit() {
    this.tutorRegisterForm = this.formBuilder.group({
      firstname: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
        ]
      ],
      contact: ["", [Validators.required]],
      image: ["", [Validators.required]],
      video: ["", [Validators.required]],
      description: ["", [Validators.required]]
    });
    console.log(this.tutorRegisterForm);
  }
  get firstname() {
    return this.tutorRegisterForm.get("firstname");
  }

  get lastname() {
    return this.tutorRegisterForm.get("lastname");
  }
  get email() {
    return this.tutorRegisterForm.get("email");
  }
  get description() {
    return this.tutorRegisterForm.get("description");
  }
  get contact() {
    return this.tutorRegisterForm.get("contact");
  }

  register() {
    console.log(this.tutorRegisterForm.value);
    let data = {
      firstName: this.firstname.value,
      lastName: this.lastname.value,
      email: this.email.value,
      contact: this.contact.value,
      imageFile: this.tutorRegisterForm.controls.image.value,
      image: this.imageData,
      videoFile: this.tutorRegisterForm.controls.video.value,
      video: this.videoData,
      description: this.description.value
    };
    this.tutorRegisterService.submit(data);
    //this.authService.register(this.registerForm.value);
    //console.log(this.authService.user$);
  }

  onKeyDown(event: KeyboardEvent) {
    return event.keyCode != 32 ? event : event.preventDefault();
  }
  imagechange(fileInput: any) {
    this.imageData = <File>fileInput.target.files[0];
    this.preview();
  }
  videochange(fileInput: any) {
    this.videoData = <File>fileInput.target.files[0];
    console.log(this.videoData);
  }
  preview() {
    // Show preview
    var previewimg = this.imageData.type;
    if (previewimg.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.imageData);
    reader.onload = () => {
      this.imageURL = reader.result;
    };
  }
  get formvalue() {
    return this.tutorRegisterForm.value;
  }
  get currentStatus() {
    return this.tutorRegisterService.status;
  }

}
