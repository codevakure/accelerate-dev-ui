import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section508Component } from './section508.component';

describe('Section508Component', () => {
  let component: Section508Component;
  let fixture: ComponentFixture<Section508Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section508Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section508Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
