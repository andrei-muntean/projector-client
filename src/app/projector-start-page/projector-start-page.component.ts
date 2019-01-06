import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';
import { IPresentation } from '../models';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projector-start-page',
  templateUrl: './projector-start-page.component.html',
  styleUrls: ['./projector-start-page.component.css']
})
export class ProjectorStartPageComponent implements OnInit {

  isFound = false;
  isLoading = false;
  isOwnerPresent = false;
  usersOnline = 0;
  uploadText = 'Upload Your Presentation';
  runningFileName = 'Running File Name';
  private presentation: IPresentation = {};

  constructor(private _requestService: RequestsService, private _router: Router) { }

  ngOnInit() {
    this._requestService.getStats().pipe(
      map((response: Response) => {
        return [{ status: response.status, json: response }];
      }),
      catchError(error => of([{ status: error.status, json: error }]))
    ).subscribe(
      res => {
        console.log(res);
        if (res[0].status === 200) {
          this.isFound = true;
          this.isOwnerPresent = res[0].json.body.isOwnerPresent;
          this.usersOnline = res[0].json.body.controllers;
          this.runningFileName = res[0].json.body.name;
        }
      }, err => {
        console.log(err);
        if (err[0].status === 404) {
          this.isFound = false;
        }
      });
  }

  fileChanged(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      // set presentation
      this.presentation.fileName = file.name;
      this.presentation.uploadFile = file;
      // update upload text
      this.uploadText = file.name;
      console.log(file);
    }
  }
  /**
   * Get base 64 of a text
   * @param text just the base64 content from the string
   */
  getBase64(text: string): string {
    return text.split(',')[1];
  }
  /**
   * Upload presentation and start it
   */
  upload() {
    this.isLoading = true;
    console.log(this.presentation);
    this._requestService.postPresentation(this.presentation).pipe(
      map((response: Response) => {
        return [{ json: response }];
      }),
      catchError(error => of([{ status: error.status, json: error }]))
    ).subscribe(response => {
      console.log(response);
      if (response[0].json.ownerUUID) {
        console.log('I got here!!')
        // TODO store ownerUUID
        // go to next page
        this._router.navigate(['/control']);
      }
    }, err => {
      console.log(err);
      this.isFound = false;
      this.isLoading = false;
    });
  }
  /**
   * connect to running room
   */
  connect() {
    this.isLoading = true;
    // TODO open websocket
    // go to next page
    this._router.navigate(['/presentation']);
  }
}
