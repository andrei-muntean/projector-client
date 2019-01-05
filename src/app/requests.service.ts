import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private _url = 'http://localhost:8080/';
  private _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(private _http: HttpClient) { }

  /**
   * Get stats from server:
   * 404 - means that slideshow is not present
   * 200 - means that slideshow is present
   */
  getStats(): Observable<any> {
    return this._http.get(this._url + 'stats');
  }
  /**
   * Post presentation on local server
   * Returns a response regarding it's success
   */
  postPresentation(presentation): Observable<any> {
    return this._http.post(this._url, JSON.stringify(presentation), this._httpOptions);
  }
}
