import { DomSanitizer } from '@angular/platform-browser';
import { WebsocketService } from './../websocket.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { map, catchError, repeatWhen, takeWhile } from 'rxjs/operators';
import { of, interval } from 'rxjs';
import { IPresentation } from '../models';
import { ModalComponent } from '../modal/modal.component';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-projector-view-page',
  templateUrl: './projector-view-page.component.html',
  styleUrls: ['./projector-view-page.component.css']
})
export class ProjectorViewPageComponent implements OnInit {

  currentSlide = 0;
  totalSlides = 0;
  usersOnline = 0;
  isLoading = true;
  isOwnerPresent = false;
  presentation: IPresentation = { fileName: '', uploadFile: '' };
  _isAlive = true;
  showModal = true;

  constructor(private _wsService: WebsocketService,
    private _requestService: RequestsService,
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private _modalService: NgbModal,
    modalConfig: NgbModalConfig) {
      modalConfig.backdrop = 'static';
      modalConfig.keyboard = false;
  }

  ngOnInit() {
    this._requestService.getStats().pipe(
      map((response: Response) => {
        return [{ status: response.status, json: response }];
      }),
      catchError(error => of([{ status: error.status, json: error }])),
      repeatWhen(() => interval(10000)),
      takeWhile(() => this._isAlive)
    ).subscribe(
      res => {
        console.log(res);
        if (res[0].status === 200) {
          this.isLoading = false;
          // populate local values
          this.isOwnerPresent = res[0].json.body.isOwnerPresent;
          this.usersOnline = res[0].json.body.controllers;
          this.presentation.fileName = res[0].json.body.name;
          // open socket
          this._wsService.getEventListener().subscribe(event => {
            if (event.type == "message") {
              this.handleMessages(event);
            }
            if (event.type == "close") {
              this._isAlive = false;
            }
            if (event.type == "open") {
              this.handleMessages(event);
            }
          });
        }
        else {
          this.redirectToHomePage();
        }
      }, err => {
        console.log(err);
        if (err[0].status === 404) {
          this.redirectToHomePage();
        }
      });
  }
  /**
   * Handle emited messages
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
        //this.presentation.fileName = file.name;
        this.presentation.uploadFile = this._sanitizer.bypassSecurityTrustUrl(data.preview);
      }
      if (data.command === 'slideshow_finished') {
        this.open();
        this._wsService.close();
        this._isAlive = false;
        this.redirectToHomePage();
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
   * Open the warning modal
   */
  open() {
    const modalRef = this._modalService.open(ModalComponent, {centered: true});
    modalRef.componentInstance.title = 'About';
  }
}
