import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sf30Component } from './sf30.component';

describe('Sf30Component', () => {
  let component: Sf30Component;
  let fixture: ComponentFixture<Sf30Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sf30Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sf30Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
