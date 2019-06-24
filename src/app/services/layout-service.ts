import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class LayoutService {
  public toggleSidenavLeft: EventEmitter<any> = new EventEmitter();
}
// It's important to remember that Services are singletons, so provide only in a core.module
// or in the app.module or your components could possibly have different instances of LayoutService.
