import { Component } from "@angular/core";

import Quill from "quill";

import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageResize", ImageResize);
@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.css"]
})
export class EditorComponent {
  editorData;
  modules = { imageResize: true, syntax: true };
  constructor() {}

}
