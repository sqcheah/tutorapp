import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent {
  isHovering: boolean;
  error;
  files: File[] = [];

  imgUrl: string = 'https://picsum.photos/200/300/?random';

  imageToShow: any;
  isImageLoading: boolean;
  toggleHover(event: boolean) {
    // console.log(event);
    this.isHovering = event;
  }
  constructor(private httpClient: HttpClient) {}
  onDrop(files) {
    this.isImageLoading = true;
    this.getImage(files).pipe(
      map(data => {
        console.log(data.type);
      })
    );
  }
  getImageFromService() {
    this.isImageLoading = true;
    this.getImage(this.imgUrl).subscribe(
      data => {
        if (data.type.split('/')[0] == 'image') {
          this.createImageFromBlob(data);
        } else {
          this.error = 'Not a valid image url';
        }
      },
      error => {
        // this.isImageLoading = false;
        // console.log(error);
      }
    );
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'loadend',
      () => {
        this.imageToShow = reader.result;
        console.log(this.imageToShow);
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(imageUrl, {
      responseType: 'blob'
    });
  }
}
