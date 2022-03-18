import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[drop-zone]'
})
export class DropzoneDirective {
  @Output() dropped = new EventEmitter<FileList>();
  @Output() hovered = new EventEmitter<boolean>();

  @HostListener('drop', ['$event'])
  onDrop($event) {
    let url = $event.dataTransfer.getData('url');
    this.dropped.emit(url);
    $event.preventDefault();
    //console.log($event.dataTransfer.files);
    this.dropped.emit($event.dataTransfer.files);
    this.hovered.emit(false);
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event) {
    //console.log($event);
    $event.preventDefault();
    this.hovered.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event) {
    //console.log($event);
    $event.preventDefault();
    this.hovered.emit(false);
  }
}
