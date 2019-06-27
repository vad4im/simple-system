import {Injectable} from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.info('intercept.req.headers =', request.headers, ';');
    return next.handle(request)
      .pipe(
        // retry(1),
        //   tap((event: HttpEvent<any>) => {
        //     if (event instanceof HttpResponse) {
// console.info('intercept.event.body =', event.body, ';');
//             event = event.clone({body: this.checkBody(event.body)});
//           }
//           return event;
//         }),

        catchError((error: HttpErrorResponse) => {
          console.log('catchError.error.status->' + error.status);
          if (error.status === 401) {
            // refresh token
          } else {
            return throwError(error);
          }
        })

        // catchError((error: HttpErrorResponse) => {
        //   console.info('intercept.error =', error, ';');
        //   let errorMessage = '';
        //   if (error.error instanceof ErrorEvent) {
        //     --client-side error
        // errorMessage = `Error: ${error.error.message}`;
        // } else {
        // --  server-side error
        // errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        // }
        // window.alert(errorMessage);
        // return throwError(errorMessage);
        // })
      );
  }

  private checkBody(body: any) {
    if (body.success) {
      return body['data'];
    } else {
      return body['error'];
      // return new HttpErrorResponse( )
    }
  };

}
