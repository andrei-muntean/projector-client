import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, interval } from 'rxjs';
import { IPresentation } from './models';
import * as AppConfig from '../assets/app-config.json'
import { map, catchError, repeatWhen, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private _url = AppConfig.default['requestUrl'];
  _isAlive = true;

  constructor(private _http: HttpClient) {
  }

  /**
   * Get stats from server:
   * 404 - means that slideshow is not present
   * 200 - means that slideshow is present
   */
  getStats(): Observable<any> {
    return this._http.get(this._url + '/stats', { observe: 'response' }).pipe(
      map((response: any) => {
        return [{ status: response.status, json: response }];
      }),
      catchError(error => of([{ status: error.status, json: error }]))
    );
  }
  /**
   * Get stats from server repeatedly and last while the socket is alive
   * @param intervalToRepeat 
   */
  getStatsRepeatedly(intervalToRepeat: number): Observable<any> {
    return this._http.get(this._url + '/stats', { observe: 'response' }).pipe(
      map((response: any) => {
        return [{ status: response.status, json: response }];
      }),
      catchError(error => of([{ status: error.status, json: error }])),
      repeatWhen(() => interval(intervalToRepeat)),
      takeWhile(() => this._isAlive)
    );
  }
  /**
   * Post presentation on local server
   * Returns a response regarding it's success
   */
  postPresentation(presentation: IPresentation): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('fileName', presentation.fileName);
    formData.append('uploadFile', presentation.uploadFile);
    return this._http.post(this._url + '/upload', formData);
  }
}
