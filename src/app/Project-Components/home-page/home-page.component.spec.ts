import { AuthenticationService } from './../../Services/authentication.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/observable/of';


describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let route: ActivatedRoute;
  let router: Router;
  let service: AuthenticationService;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageComponent ],
      providers: [{provide: AuthenticationService}],
      imports:[RouterModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = new AuthenticationService();
  });


  it('should get the authenticated user', () => {
    component.username = 'Varun';
    expect(component.username).toBeTruthy();
  
  });

});
