import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleveriesandperformanceComponent } from './deleveriesandperformance.component';

describe('DeleveriesandperformanceComponent', () => {
  let component: DeleveriesandperformanceComponent;
  let fixture: ComponentFixture<DeleveriesandperformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleveriesandperformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleveriesandperformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
