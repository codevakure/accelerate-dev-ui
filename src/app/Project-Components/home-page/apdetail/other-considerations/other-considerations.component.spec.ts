import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherConsiderationsComponent } from './other-considerations.component';

describe('OtherConsiderationsComponent', () => {
  let component: OtherConsiderationsComponent;
  let fixture: ComponentFixture<OtherConsiderationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherConsiderationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherConsiderationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
