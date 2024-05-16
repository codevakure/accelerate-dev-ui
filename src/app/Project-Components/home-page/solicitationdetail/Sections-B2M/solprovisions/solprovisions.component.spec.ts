import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolprovisionsComponent } from './solprovisions.component';

describe('SolprovisionsComponent', () => {
  let component: SolprovisionsComponent;
  let fixture: ComponentFixture<SolprovisionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolprovisionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolprovisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
