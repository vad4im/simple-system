import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShTableComponent } from './sh-table.component';

describe('ShTableComponent', () => {
  let component: ShTableComponent;
  let fixture: ComponentFixture<ShTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
