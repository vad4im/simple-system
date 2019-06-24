import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Claim } from '../claims/claim';
import { CLAIMS } from '../claims/mock-claims';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class ClaimsService {

  constructor(private messageService: MessageService) { }

  getHeroes(): Observable<Claim[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    return of(CLAIMS);
  }
}
