import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { stringify } from '@angular/core/src/util';
import { Observable } from 'rxjs/Observable';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
/*
  Generated class for the OnlineProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OnlineProvider {

  constructor(public http: HttpClient,
    public sqlite: SQLite,
     private storage: Storage) {
    console.log('Hello OnlineProvider Provider');
     }

     getStatus(): Observable<any>{
      return this.http
      .get('https://rateapiugl.herokuapp.com/api/online/all')
    }

}
