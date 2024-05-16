import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormdetailComponent } from './formdetail.component';

describe('FormdetailComponent', () => {
  let component: FormdetailComponent;
  let fixture: ComponentFixture<FormdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it("the soldata json loads the html onto the page", () =>{
    var object = document.getElementById("ov_editall");
    var attr =  document.getElementById("ov_editall").getAttribute("data-input-links");
    expect(attr).toEqual("SOLT ICO1 ICO2 ICO3");
  });


  it("verify the ipnut elements style change when the ov_editall button is clicked", () =>{
    var object = document.getElementById("ov_editall");
    object.click;
    var save = document.getElementsByTagName("ipnut")[0].getAttribute("class");
    expect(save).toEqual("onedit");
  });

});
