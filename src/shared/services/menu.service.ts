import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class MenuService {
  constructor (private http: Http) {}

  private _listUrl = 'api/menus/list' + environment.urlExtension;
  private _listItemsUrl = 'api/menus/items/list' + environment.urlExtension;
  private _addUrl = 'api/menus/add' + environment.urlExtension;
  private _editUrl = 'api/menus/edit' + environment.urlExtension;
  private _removeUrl = 'api/menus/remove' + environment.urlExtension;

  /**
   * Lists menus
   *
   */
  list () {

    let headers = new Headers();
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.get(this._listUrl, options).map((res:Response) => res.json());
  }

  /**
   * Adds a menu
   *
   * @param {string} name
   * @return {Observable}
   */
  add (name: string) {

    let body = JSON.stringify({ name });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._addUrl, body, options);

  }

  /**
   * Edits a menu
   *
   * @param {string} name
   * @return {Observable}
   */
  edit (id: string, name: string) {

    let body = JSON.stringify({ id, name });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._editUrl, body, options);

  }

  /**
   * Removes a menu
   *
   * @param {string} id
   * @return {Observable}
   */
  remove (id: string) {

    let body = JSON.stringify({ id });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('X-AUTH', 'Bearer ' + localStorage.getItem('id_token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this._removeUrl, body, options);

  }

}