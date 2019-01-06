import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPresentation } from './models';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private _url = 'http://localhost:8080/';
  private _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private _http: HttpClient) { }

  /**
   * Get stats from server:
   * 404 - means that slideshow is not present
   * 200 - means that slideshow is present
   */
  getStats(): Observable<any> {
    return this._http.get(this._url + 'stats', {observe: 'response'});
  }
  /**
   * Post presentation on local server
   * Returns a response regarding it's success
   */
  postPresentation(presentation: IPresentation): Observable<any> {
    let formData: FormData = new FormData();
    formData.append('fileName', presentation.fileName);
    formData.append('uploadFile', presentation.uploadFile);
    console.log(formData.get('uploadFile'));
    return this._http.post(this._url + 'upload', formData);
  }
}
