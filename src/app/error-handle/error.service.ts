import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  getClientErrorMessage(error: Error): string {
    return error.message ?
      error.message :
      error.toString();
  }

  getJSONErrorMessage(error: Error): string {
    console.log('getJSONErrorMessage');
    return error['errormsg'];
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    console.log('getServerErrorMessage');
    return navigator.onLine ?
      error.message :
      'No Internet Connection';
  }
}
