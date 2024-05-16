import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationfactorsComponent } from './evaluationfactors.component';

describe('EvaluationfactorsComponent', () => {
  let component: EvaluationfactorsComponent;
  let fixture: ComponentFixture<EvaluationfactorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationfactorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationfactorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
