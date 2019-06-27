import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/index';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class SqlQueryService {
  private clausesUrl = 'http://localhost:8222';  // URL to web api
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

  getDivTypes(objName, filter = '', sortOrder = 'asc',
              pageNumber = 0, pageSize = 3): Observable<[]> {
    return this.http.get(this.clausesUrl + '/dict/sql/div-type', {
      params: new HttpParams()
        .set('objName', objName)
        .set('filter', filter)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
      map(res => res["data"]
      )
      // map(res => console.log(res))
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
