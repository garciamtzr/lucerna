import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { stringify } from '@angular/core/src/util';
import { Observable } from 'rxjs/Observable';


/*
  Generated class for the TraspasoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TraspasoProvider {

  constructor(public http: HttpClient) {
    console.log('Hello TraspasoProvider Provider');
  }


  getTraspaso(): Observable<any>{
    return this.http
    .get('https://rateapiugl.herokuapp.com/api/traspasos/all');
  }


}
