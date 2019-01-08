import { ModalComponent } from '../modal/modal.component';
import { CookieService } from 'ngx-cookie-service';
import { WebsocketService } from '../websocket.service';
import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../requests.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IPresentation } from '../models';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-projector-view-page',
  templateUrl: './projector-view-page.component.html',
  styleUrls: ['./projector-view-page.component.css']
})
export class ProjectorViewPageComponent implements OnInit {

  isLoading = true;
  isOwnerPresent = false;
  currentSlide = 0;
  totalSlides = 0;
  usersOnline = 0;
  presentation: IPresentation = {};
  showModal = true;
  isControlPage = false;

  constructor(private _wsService: WebsocketService,
    private _requestService: RequestsService,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private _cookieService: CookieService,
    private _modalService: NgbModal,
    modalConfig: NgbModalConfig) {
      modalConfig.backdrop = 'static';
      modalConfig.keyboard = false;
  }

  ngOnInit() {
    // decide if it's a control page or not
    this._activeRoute.params.subscribe(params => {
      const id = params['id'];
      if (id === 'control') {
        this.isControlPage = true;
      }
      else if (id === 'presentation') {
        this.isControlPage = false;
      }
    });
    // get stats repeatedly and open socket
    this._requestService.getStatsRepeatedly(10000).subscribe(
      res => {
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
              this._requestService._isAlive = false;
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
      if (data.currentSlide) {
        this.currentSlide = data.currentSlide
      }
      if (data.totalSlides) {
        this.totalSlides = data.totalSlides
      }
      if (data.preview) {
        this.presentation.uploadFile = this._sanitizer.bypassSecurityTrustUrl(data.preview);
      }
      if (data.command === 'slideshow_finished') {
        this.open();
        this._wsService.close();
        this._requestService._isAlive = false;
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
    this._requestService._isAlive = false;
    this._cookieService.deleteAll();
  }
  /**
   * Open the warning modal
   */
  open() {
    if (!this._modalService.hasOpenModals() && !this.isControlPage) {
      const modalRef = this._modalService.open(ModalComponent, {centered: true});
      modalRef.componentInstance.title = 'About';
    }
  }
}
