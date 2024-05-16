import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as $ from 'jquery';
import { PreviewComponent } from './preview.component';

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Testing to verify if the form data is captured',()=>{
    var url ="https://www.accelerate-dev.com/forms/5bf38304a0ab7d1b9c3c6d85";
    $.get(url).done(function(response){
      var data = response.Sections;
      expect(data).not.toBeNull();
    });
  });


}); 
