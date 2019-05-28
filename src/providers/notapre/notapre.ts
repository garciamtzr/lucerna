import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from '@angular/core/src/util';


@Injectable()
export class NotapreProvider {

  constructor(public http: HttpClient) {
    console.log('Hello NotapreProvider Provider');
  }

  getNotasPre(): Observable<any>{
    return this.http
    .get('https://rateapiugl.herokuapp.com/api/notaPreVenta/all');
  }

}
