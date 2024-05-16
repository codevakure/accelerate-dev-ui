import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClausesectionsComponent } from './clausesections.component';

describe('ClausesectionsComponent', () => {
  let component: ClausesectionsComponent;
  let fixture: ComponentFixture<ClausesectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClausesectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClausesectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
