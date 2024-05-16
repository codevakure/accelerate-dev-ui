import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ACertsComponent } from './a-certs.component';

describe('ACertsComponent', () => {
  let component: ACertsComponent;
  let fixture: ComponentFixture<ACertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ACertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ACertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
