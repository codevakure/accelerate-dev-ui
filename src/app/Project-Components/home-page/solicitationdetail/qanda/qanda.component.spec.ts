import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QandaComponent } from './qanda.component';
declare var $: any;

describe('QandaComponent', () => {
  let component: QandaComponent;
  let fixture: ComponentFixture<QandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 //Start a test it("description of test",callback)

 it("test to verify if complete button activates when text is entered in the text area",()=>{
    //arrange(Step to declare nesscsary variables)
    var textarea = document.getElementById("textarea0") as HTMLTextAreaElement;
    var completebutton = document.getElementById("completed0") as HTMLButtonElement;
    function triggerEvent(el, type){
      if ('createEvent' in document) {
           // modern browsers, IE9+
           var e = document.createEvent('HTMLEvents');
           e.initEvent(type, false, true);
           el.dispatchEvent(e);
       } 
   }

    //act(Logic to run using variables)
    textarea.value = "working";
    triggerEvent(textarea,"keyup");
    

    //expect( Logic test the espected outcome) syntax expect(function/expression).jasminefunction ex. tobe(result)
      expect(completebutton.disabled).toBeFalsy();

 });


 it("the Assign curtian/selection box appears when the 'assign' button is clicked",()=>{

   //arrange(Step to declare nesscsary variables)
   var assignbutton = document.getElementById("assign0") as HTMLButtonElement;
   var dropdown = document.getElementById("curtain_assign0") as HTMLElement;
   var result;


   //act(Logic to run using variables)
   assignbutton.click();
   result=dropdown.offsetWidth;
  
   //expect( Logic test the espected outcome) syntax expect(function/expression).jasminefunction ex. tobe(result)
     expect(result).toBe(175);
 });


});
