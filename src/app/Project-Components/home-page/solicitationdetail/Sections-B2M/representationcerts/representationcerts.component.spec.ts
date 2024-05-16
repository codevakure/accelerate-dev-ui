import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentationcertsComponent } from './representationcerts.component';

describe('RepresentationcertsComponent', () => {
  let component: RepresentationcertsComponent;
  let fixture: ComponentFixture<RepresentationcertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepresentationcertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentationcertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
