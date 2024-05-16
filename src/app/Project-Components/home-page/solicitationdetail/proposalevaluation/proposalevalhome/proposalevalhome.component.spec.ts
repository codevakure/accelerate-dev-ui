import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalevalhomeComponent } from './proposalevalhome.component';

describe('ProposalevalhomeComponent', () => {
  let component: ProposalevalhomeComponent;
  let fixture: ComponentFixture<ProposalevalhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalevalhomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalevalhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
