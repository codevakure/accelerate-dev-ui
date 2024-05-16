
import { type } from "os";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  OnChanges,
  EventEmitter,
  SimpleChanges
} from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { environment } from "../../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../../Services/authentication.service";
import { CognitoUser } from "amazon-cognito-identity-js";
import { AcquisitionService } from "../../Services/acquisition.service";
import { UserIdleService } from "angular-user-idle";

import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'
import { Observable, of, timer } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import {FormatTimePipe} from '../../formatTime.pipe';
declare var $: any;

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"]
})

export class HomePageComponent implements OnInit {
  search_flag: boolean;
  getattributes;
  role;
  notifications;
  countNotifications;
  emailUser;
  usercommentsname;
  solno;
  UNITED_URL = environment.LOGOUT;
  UNITEDs_URL = environment.UNITED_ENV;
  countDown;
  counter = 60;
  tick = 1000;
  username;
  count;
  private reset$ = new Subject();
  timer$: Observable<any>;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private ap: AcquisitionService,
    private toastr: ToastrService,
    private userIdle: UserIdleService
  ) {}

  ngOnInit() {
    this.ap.getUserprofile().subscribe(
      response => {

        this.username = response.firstName + " " + response.lastName;
        var fullName = response.email.split("@")[0].split(".");
        var firstName =
          fullName[0].charAt(0).toUpperCase() + fullName[0].slice(1);
        var lastName =
          fullName[fullName.length - 1].charAt(0).toUpperCase() +
          fullName[fullName.length - 1].slice(1);
        this.emailUser = firstName;
        if (response.firstName == "Not") {
          this.usercommentsname = this.emailUser;
          console.log(this.usercommentsname);
        } else {
          this.usercommentsname = this.username;
          console.log(this.usercommentsname);
        }
        console.log(this.username);
        this.ap
          .getAttnotifications(this.usercommentsname)
          .subscribe(response => {
            this.notifications = response;
            this.countNotifications = response.length;
           
            console.log(response);
          });
        if (response.roles[0].roleName == "Contracting Officer (CO)") {
          this.role = "Contracting Officer";
        } else if (response.roles[0].roleName == "Program Manager (PM)") {
          this.role = "Program Officer";
        }
      },
      error => {
        this.toastr.error(
          +error +
            "Error with the User Service.Application will be logged out in 30sec"
        );
        console.log(
          "Error occured in user service dashboard component" + error
        );
        setTimeout(() => {
          document.location.href = `${this.UNITED_URL}`;
          setTimeout(() => {
            document.location.href = `${this.UNITEDs_URL}/landing`;
          }, 300);
          Cookie.deleteAll();
        }, 30000);
      }
    );

    this.startWatching();
    this.userIdle.onTimerStart().subscribe(count => {
      console.log(count);
      this.countDown = Observable.timer(0, this.tick)
      .take(this.counter)
      .map(() => --this.counter);
      $("#exampleModal90").modal({
        show: true,
        backdrop: 'static', 
        keyboard: false
      }) 
    });

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
              document.location.href = `${this.UNITED_URL}`;
        setTimeout(() => {
          document.location.href = `${this.UNITEDs_URL}/landing`;
        }, 300);
        Cookie.deleteAll();
      console.log("Time is up!");
    });
  }

  getNotificationpage(alert) {
    console.log("Notification JSON", alert);
    if (alert.status == "Initiated") {
      console.log(alert.routeHeaders);
      if (alert.routeHeaders == undefined) {
        alert.routeHeaders = "";
        this.ap.deleteAttachment(alert.id).subscribe(response => {});
        this.ngOnInit();
      }
      
      this.router.navigate([
        "/home/sol/" + alert.ap_no + "/" + alert.routeHeaders
      ]);
      this.ap.deleteAttachment(alert.id).subscribe(response => {});
      this.ngOnInit();
      setTimeout(() => {
        document.getElementById("commentCollab").click();
      }, 500);
    } else if (alert.type == "PointoFContact") {
      this.router.navigate(["/home/" + alert.ap_no]);
      this.ap.deleteAttachment(alert.id).subscribe(response => {});
      this.ngOnInit();
    } else if (alert.type == "Share") {
      this.router.navigate(["/home/" + alert.ap_no]);
      this.ap.deleteAttachment(alert.id).subscribe(response => {});
      this.ngOnInit();
    } else if (alert.type == "Accepted") {
      this.router.navigate(["/home/" + alert.ap_no]);
      this.ap.deleteAttachment(alert.id).subscribe(response => {});
      this.ngOnInit();
    } else if (alert.type == "Initiated") {
      this.router.navigate(["/home/sol/" + alert.sol_no]);
      this.ap.deleteAttachment(alert.id).subscribe(response => {});
      this.ngOnInit();
    } else if (alert.type == "COR") {
      this.router.navigate(["/home/sol/" + alert.ap_no + "/" + "cor"]);
      this.ap.deleteAttachment(alert.id).subscribe(response => {});
      this.ngOnInit();
    } else {
      this.router.navigate(["/home/" + alert.ap_no + "/" + alert.routeHeaders]);
      this.ap.deleteAttachment(alert.id).subscribe(response => {});
      this.ngOnInit();
      setTimeout(() => {
        document.getElementById("commentCollab").click();
      }, 500);
    }
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  refreshTokenTimer(){
  $("#exampleModal90").modal('hide');
    this.ap.refreshToken();
    this.restart();
  }
}


