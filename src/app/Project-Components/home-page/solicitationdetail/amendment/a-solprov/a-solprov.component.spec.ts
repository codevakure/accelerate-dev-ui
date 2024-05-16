import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ASolprovComponent } from './a-solprov.component';

describe('ASolprovComponent', () => {
  let component: ASolprovComponent;
  let fixture: ComponentFixture<ASolprovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ASolprovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ASolprovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
