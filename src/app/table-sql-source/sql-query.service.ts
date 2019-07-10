import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/index';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, tap} from "rxjs/internal/operators";

@Injectable()
export class SqlQueryService {
  private sqlDataUrl = 'http://localhost:8222';  // URL to web api
  private dmlPath = '/dict/sql/dml';
  private confPath = '/dict/sql/dml/conf';
  private objDescPath = '/dict/sql/dml/obj-desc';

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

  getConfDataSql(objName): Observable<[]> {
    return this.http.get(this.sqlDataUrl + this.confPath,  {
      params: new HttpParams()
        .set('objName', objName)
    }).pipe(
      map(res => res['data']['rows']
      )
      // map(res => console.log(res))
    );
  }
  getObjDescSql(objName): Observable<[]> {
    return this.http.get(this.sqlDataUrl + this.objDescPath,  {
      params: new HttpParams()
        .set('objName', objName)
    }).pipe(
      map(res => res['data']['rows']
      )
      // map(res => console.log(res))
    );
  }

  getObjDataSql(objName, filter = '', sortOrder = '', pageNumber = 0, pageSize = 3, fields ): Observable<[]> {
    return this.http.get(this.sqlDataUrl + this.dmlPath,  {
      params: new HttpParams()
        .set('objName', objName)
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
        .set('fields', fields)
    }).pipe(
      map(res => res['data']['rows']
      )
       // map(res => console.log(res))
    );
  }

  /** PUT: add a new data to the server */
  addObjDataSql(dataObj, data): Observable<{}> {
// console.log('ObjDataSql.service.addObjDataSql: ' + JSON.stringify(data));
    return this.http.put(this.sqlDataUrl + this.dmlPath, {data: data, dataObj: dataObj} )
      .pipe(
        map(res => res)
        // tap(result => console.log('Sql-query.service.addObjDataSql result ->' + JSON.stringify(result))
      );
  }

  /** POST: add a new data to the server */
  editObjDataSql(dataObj, data): Observable<{}> {
    // console.log('ObjDataSql.service.editObjDataSql: ' + JSON.stringify(data));
    return this.http.post(this.sqlDataUrl + this.dmlPath, {data: data, dataObj: dataObj} )
      .pipe(
        map(res => res)
        // tap(result => console.log('Sql-query.service.addObjDataSql result ->' + JSON.stringify(result))
      );
  }

  /** DELETE: add a new data to the server */
  delObjDataSql(objName, prKey, id ): Observable<{}> {
    console.log('ObjDataSql.service.delObjDataSql: ' + JSON.stringify(objName));
    return this.http.delete(this.sqlDataUrl + this.dmlPath +`/${id}`,{
      params: new HttpParams()
      .set('objName', objName)
      .set('prKey', prKey)
  } ).pipe(
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
