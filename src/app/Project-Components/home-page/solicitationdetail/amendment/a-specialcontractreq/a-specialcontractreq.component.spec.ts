import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ASpecialcontractreqComponent } from './a-specialcontractreq.component';

describe('ASpecialcontractreqComponent', () => {
  let component: ASpecialcontractreqComponent;
  let fixture: ComponentFixture<ASpecialcontractreqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ASpecialcontractreqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ASpecialcontractreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
