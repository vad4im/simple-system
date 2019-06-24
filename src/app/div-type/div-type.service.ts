import {Injectable} from '@angular/core';
import {DivType} from './div-type';
import {map} from 'rxjs/operators';
import {Observable } from 'rxjs/index';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AppError} from '../services/app-error';

@Injectable()
export class DivTypeService {
  private clausesUrl = 'http://localhost:8222';  // URL to web api
  constructor(private http: HttpClient) {

  }


  getAllDivTypes(): Observable<DivType[]> {
    return this.http.get('/dict/sql/div-type', {
      params: new HttpParams()
        .set('pageNumber', "0")
        .set('pageSize', "1000")
    }).pipe(
      map(res =>  res["data"])

    );
  }

  getDivTypes(filter = '', sortOrder = 'asc',
              pageNumber = 0, pageSize = 3): Observable<DivType[]> {
    return this.http.get(this.clausesUrl + '/dict/sql/div-type', {
      params: new HttpParams()
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
      map(res => res["data"])
      // map(res => console.log(res))
    );
  }
/*
// Service Class
  getTableData(): Observable<Table>{
    return this.http.get('url')
      .map ( res => {
        // transform data as needed
        return transformedData;
      })
      .catch(err => {
        // transform error as needed
        let transformedError = GlobalFunction.transformError(err);

        return Observable.throw(transformedError);
      }
  }
*/

}
