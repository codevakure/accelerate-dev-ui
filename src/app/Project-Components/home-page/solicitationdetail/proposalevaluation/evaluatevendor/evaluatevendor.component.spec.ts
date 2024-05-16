import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatevendorComponent } from './evaluatevendor.component';

describe('EvaluatevendorComponent', () => {
  let component: EvaluatevendorComponent;
  let fixture: ComponentFixture<EvaluatevendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluatevendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluatevendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
