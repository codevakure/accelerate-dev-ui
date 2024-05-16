import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ASowComponent } from './a-sow.component';

describe('ASowComponent', () => {
  let component: ASowComponent;
  let fixture: ComponentFixture<ASowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ASowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ASowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
