import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DynamicFormService, DynamicFormControlModel, DynamicFormLayout } from "@ng-dynamic-forms/core";
import { GETDYNFORMMODEL } from "./material-dynamic-forms.model";
// import {GETDYNFORMMODEL} from "./material-dynamic-forms.model";

@Component({
  selector: 'app-ng-dynamic-form',
  templateUrl: './ng-dynamic-form.component.html',
  styleUrls: ['./ng-dynamic-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NgDynamicFormComponent implements OnInit {

  formModel: DynamicFormControlModel[] = GETDYNFORMMODEL ;
  formGroup: FormGroup;
  // formLayout: DynamicFormLayout = MATERIAL_SAMPLE_FORM_LAYOUT;

  constructor(private formService: DynamicFormService) {}

  ngOnInit() {
    this.formGroup = this.formService.createFormGroup(this.formModel);
  }

  onBlur($event) {
    console.log(`Material blur event on: ${$event.model.id}: `, $event);
  }

  onChange($event) {
    console.log(`Material change event on: ${$event.model.id}: `, $event);
  }

  onFocus($event) {
    console.log(`Material focus event on: ${$event.model.id}: `, $event);
  }

  onMatEvent($event) {
    console.log(`Material ${$event.type} event on: ${$event.model.id}: `, $event);
  }

  test() {
    console.log(JSON.stringify(this.formGroup.value));
  }
}
