import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sf1449part2Component } from './sf1449part2.component';

describe('Sf1449part2Component', () => {
  let component: Sf1449part2Component;
  let fixture: ComponentFixture<Sf1449part2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sf1449part2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sf1449part2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
