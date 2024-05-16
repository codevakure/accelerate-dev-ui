import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketresearchComponent } from './marketresearch.component';

describe('MarketresearchComponent', () => {
  let component: MarketresearchComponent;
  let fixture: ComponentFixture<MarketresearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketresearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketresearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
