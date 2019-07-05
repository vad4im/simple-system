import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/index';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, tap} from "rxjs/internal/operators";

@Injectable()
export class SqlQueryService {
  private sqlDataUrl = 'http://localhost:8222';  // URL to web api
  constructor(private http: HttpClient) {
  }

  getAllDivTypes(): Observable<[]> {
    return this.http.get('/dict/sql/div-type', {
      params: new HttpParams()
        .set('pageNumber', "0")
        .set('pageSize', "1000")
    })
      .pipe(
        map(res => res["data"])
      );
  }

  getObjDataSql(objName, filter = '', sortOrder = 'asc', pageNumber = 0, pageSize = 3, fields ): Observable<[]> {
    return this.http.get(this.sqlDataUrl + '/dict/sql/div-type',  {
      params: new HttpParams()
        .set('objName', objName)
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
        .set('fields', fields)
    }).pipe(
      map(res => res["data"]
      )
      // map(res => console.log(res))
    );
  }

  /** POST: add a new data to the server */
  addObjDataSql(dataObj, data): Observable<{}> {
// console.log('ObjDataSql.service.addData: ' + JSON.stringify(data));
    return this.http.put(this.sqlDataUrl + '/dict/sql/div-type', {data: data, dataObj: dataObj} )
      .pipe(
        map(res => res)
        // tap(result => console.log('Sql-query.service.addObjDataSql result ->' + JSON.stringify(result))
      );
  }

  /** POST: add a new data to the server */
  editObjDataSql(dataObj, data): Observable<{}> {
    console.log('ObjDataSql.service.editData: ' + JSON.stringify(data));
    return this.http.post(this.sqlDataUrl + '/dict/sql/div-type', {data: data, dataObj: dataObj} )
      .pipe(
        map(res => res)
        // tap(result => console.log('Sql-query.service.addObjDataSql result ->' + JSON.stringify(result))
      );
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || [];
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
