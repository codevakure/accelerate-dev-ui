import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ADeliveriesandperformancesComponent } from './a-deliveriesandperformances.component';

describe('ADeliveriesandperformancesComponent', () => {
  let component: ADeliveriesandperformancesComponent;
  let fixture: ComponentFixture<ADeliveriesandperformancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ADeliveriesandperformancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ADeliveriesandperformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
