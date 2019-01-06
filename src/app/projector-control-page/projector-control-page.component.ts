import { map, catchError, repeat, repeatWhen } from 'rxjs/operators';
import { WebsocketService } from './../websocket.service';
import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';
import { of, interval } from 'rxjs';
import { Router } from '@angular/router';
import { IPresentation } from '../models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-projector-control-page',
  templateUrl: './projector-control-page.component.html',
  styleUrls: ['./projector-control-page.component.css']
})
export class ProjectorControlPageComponent implements OnInit {

  isLoading = true;
  isOwnerPresent = false;
  currentSlide = 0;
  totalSlides = 0;
  usersOnline = 0;
  presentation: IPresentation = {};

  messages: Array<any>;

  constructor(private _wsService: WebsocketService,
    private _requestService: RequestsService,
    private _router: Router,
    private _sanitizer: DomSanitizer) {
    this.messages = [];
  }

  ngOnInit() {

    this._requestService.getStats().pipe(
      map((response: Response) => {
        return [{ status: response.status, json: response }];
      }),
      catchError(error => of([{ status: error.status, json: error }])),
      repeatWhen(() => interval(10000))
    ).subscribe(
      res => {
        if (res[0].status === 200) {
          this.isLoading = false;
          // populate local values
          console.log(res[0].json.body);
          this.isOwnerPresent = res[0].json.body.isOwnerPresent;
          this.usersOnline = res[0].json.body.controllers;
          this.presentation.fileName = res[0].json.body.name;
          // open socket
          this._wsService.getEventListener().subscribe(event => {
            if (event.type == "message") {
              console.log(event.data);
              this.handleMessages(event);
            }
            if (event.type == "close") {
              console.log('The socket connection has been closed');
            }
            if (event.type == "open") {
              console.log('The socket connection has been establishe');
            }
          });
        }
        else {
          this.redirectToHomePage();
        }
      }, err => {
        if (err[0].status === 404) {
          this.redirectToHomePage();
        }
      });
  }

  handleMessages(event) {
    if (event.data) {
      let data = JSON.parse(event.data);
      console.log(data);
      if (data.currentSlide) {
        this.currentSlide = data.currentSlide
      }
      if (data.totalSlides) {
        this.totalSlides = data.totalSlides
      }
      if (data.preview) {
        this.presentation.uploadFile = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + data.preview);
      }
    }
  }
  /**
   * Redirect To Home Page
   */
  redirectToHomePage() {
    this._router.navigate(['/home']);
  }
  /**
   * send json with:
   * {command: 'transition_next'}
   * to websocket
   */
  nextSlide() {

  }

  /**
   * send json with:
   * {command: 'transition_previous'}
   * to websocket
   */
  prevSlide() {

  }

  /**
  * send json with:
  * {command: 'presentation_stop'}
  * to websocket
  */
  stopSlide() {

  }

}
