import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoprofileComponent } from './coprofile.component';

describe('CoprofileComponent', () => {
  let component: CoprofileComponent;
  let fixture: ComponentFixture<CoprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
