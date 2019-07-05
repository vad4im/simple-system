import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DynamicFormControlModel, DynamicFormService} from '@ng-dynamic-forms/core';
import {getDynFormModel} from './dynamic-form.model';

@Component({
  selector: 'app-table-edit-dialog',
  templateUrl: './table-edit-dialog.component.html',
  styleUrls: ['./table-edit-dialog.component.css']
})
export class TableEditDialogComponent implements OnInit {
  // formLayout: DynamicFormLayout = MATERIAL_SAMPLE_FORM_LAYOUT;

  formModel: DynamicFormControlModel[] = getDynFormModel(this.data);
  formGroup: FormGroup;
  formControl = new FormControl('', [
    Validators.required
  ]);

  constructor(public dialogRef: MatDialogRef<TableEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formService: DynamicFormService
              // ,public dataSource: SqlQueryDataSource
  ) {
  }

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.dialogRef.close(this.formGroup.value);
  }

  isFormGroupValid() {
    return (this.formGroup.status === 'VALID');
  }

  onBlur($event) {
    // console.log(`Material blur event on: ${$event.model.id}: `, $event, ` Form group status: ${$event.group.status}`);
  }

  onChange($event) {
    // console.log(`Material change event on: ${$event.model.id}: `, $event);
  }

  onFocus($event) {
    // console.log(`Material focus event on: ${$event.model.id}: `, $event);
  }

  onMatEvent($event) {
    console.log(`Material ${$event.type} event on: ${$event.model.id}: `, $event);
  }

  test() {
    console.log(JSON.stringify(this.formGroup.value));
  }

}
