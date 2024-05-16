import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeoffsComponent } from './tradeoffs.component';

describe('TradeoffsComponent', () => {
  let component: TradeoffsComponent;
  let fixture: ComponentFixture<TradeoffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeoffsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeoffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
