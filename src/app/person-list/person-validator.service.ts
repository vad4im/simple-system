import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidatorService } from '../mat-table-crud/validator.service';

@Injectable()
export class PersonValidatorService implements ValidatorService {
  getRowValidator(): FormGroup {
    return new FormGroup({
      'name': new FormControl(null, Validators.required),
      'age': new FormControl(),
    });
  }
}
