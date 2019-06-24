import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/index';
@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.css']
})
export class ClaimsComponent implements OnInit {
  claims: Observable<{}>;
  settingsToChild: any;

  constructor() { }
  ngOnInit() {
  }
}

/*
*  (choiseRequest)="choiseEvent($event)"
*                   [parentSettings]="settingsToChild"
*                   [state] = "clauses"
* */
