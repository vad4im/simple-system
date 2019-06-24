import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DivTypeComponent } from './div-type.component';

describe('DivTypeComponent', () => {
  let component: DivTypeComponent;
  let fixture: ComponentFixture<DivTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DivTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DivTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
