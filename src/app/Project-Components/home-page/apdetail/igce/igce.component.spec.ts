import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgceComponent } from './igce.component';

describe('IgceComponent', () => {
  let component: IgceComponent;
  let fixture: ComponentFixture<IgceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
