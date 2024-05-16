import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialcontractreqComponent } from './specialcontractreq.component';

describe('SpecialcontractreqComponent', () => {
  let component: SpecialcontractreqComponent;
  let fixture: ComponentFixture<SpecialcontractreqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialcontractreqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialcontractreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
