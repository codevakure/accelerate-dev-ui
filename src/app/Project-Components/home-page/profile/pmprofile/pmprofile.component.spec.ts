import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmprofileComponent } from './pmprofile.component';

describe('PmprofileComponent', () => {
  let component: PmprofileComponent;
  let fixture: ComponentFixture<PmprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
