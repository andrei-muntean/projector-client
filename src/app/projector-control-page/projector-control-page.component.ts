import { CookieService } from 'ngx-cookie-service';
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
    private _sanitizer: DomSanitizer,
    private _cookieService: CookieService) {
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
              this.redirectToHomePage();
            }
            if (event.type == "open") {

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
  /**
   * Handle Socket Messages
   * @param event 
   */
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
        this.presentation.uploadFile = this._sanitizer.bypassSecurityTrustUrl(data.preview);
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
    let command = JSON.stringify({command: 'transition_next'});
    this._wsService.send(command);
  }

  /**
   * send json with:
   * {command: 'transition_previous'}
   * to websocket
   */
  prevSlide() {
    let command = JSON.stringify({command: 'transition_previous'});
    this._wsService.send(command);
  }

  /**
  * send json with:
  * {command: 'presentation_stop'}
  * to websocket
  */
  stopSlide() {
    let command = JSON.stringify({command: 'presentation_stop'});
    this._wsService.send(command);
    this._wsService.close();
    this._cookieService.deleteAll();
  }
}
