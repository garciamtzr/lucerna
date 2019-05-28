import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite'; //AGREGAR PARA USAR SQL

/*
  Generated class for the SqlUpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var SqlServer: any;
@Injectable()
export class SqlUpProvider {

  db: SQLiteObject;
  notaVenta
  detalleVenta

  constructor(public http: HttpClient,private sqlite: SQLite) {
  }

 
}
