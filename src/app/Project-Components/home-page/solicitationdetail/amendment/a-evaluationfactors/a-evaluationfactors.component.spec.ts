import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AEvaluationfactorsComponent } from './a-evaluationfactors.component';

describe('AEvaluationfactorsComponent', () => {
  let component: AEvaluationfactorsComponent;
  let fixture: ComponentFixture<AEvaluationfactorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AEvaluationfactorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AEvaluationfactorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
