import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ASf30part2Component } from './a-sf30part2.component';

describe('ASf30part2Component', () => {
  let component: ASf30part2Component;
  let fixture: ComponentFixture<ASf30part2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ASf30part2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ASf30part2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
