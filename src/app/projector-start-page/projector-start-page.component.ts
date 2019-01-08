import { CookieService } from 'ngx-cookie-service';
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
  errors: string; // error messages to be displayed
  private presentation: IPresentation = {};

  constructor(private _requestService: RequestsService, 
    private _coockieService: CookieService,
    private _router: Router) { }

  ngOnInit() {
    // delete all cookies
    this._coockieService.deleteAll('/');
    // request stats
    this._requestService.getStats().subscribe(
      res => {
        if (res[0].status === 200) {
          this.isFound = true;
          this.isOwnerPresent = res[0].json.body.isOwnerPresent;
          this.usersOnline = res[0].json.body.controllers;
          this.runningFileName = res[0].json.body.name;
        }
      }, err => {
        if (err[0].status === 404) {
          this.isFound = false;
        }
      });
  }
  /**
   * file chooser event listener
   * @param event 
   */
  fileChanged(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      // set presentation
      this.presentation.fileName = file.name;
      this.presentation.uploadFile = file;
      // update upload text
      this.uploadText = file.name;
    }
  }
  /**
   * Upload presentation and start it
   */
  upload() {
    // clear errors
    this.errors = '';
    // start loading annimation
    this.isLoading = true;
    // post presentation
    this._requestService.postPresentation(this.presentation).pipe(
      map((response: Response) => {
        return [{status: response.status, json: response }];
      }),
      catchError(error => 
        of(
          [{ status: error.status, json: error }]
        )
      )
    ).subscribe(response => {
      if (response[0].json.ownerUUID) {
        // store ownerUUID
        this._coockieService.set('ownerUUID', response[0].json.ownerUUID, 7200, '/');
        // go to next page
        this._router.navigate(['home/control']);
      }
      else if (response[0].status !== 200) {
        this.isLoading = false;
        this.isFound = false;
        this.errors = 'There is no upload file or the server is down'
      }
    }, err => {
      this.isFound = false;
      this.isLoading = false;
    });
  }
  /**
   * connect to running room
   */
  connect() {
    this.isLoading = true;
    // go to next page
    this._router.navigate(['/home/presentation']);
  }
}
