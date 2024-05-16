import { Cookie } from "ng2-cookies/ng2-cookies";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit, HostListener } from "@angular/core";
import { AuthenticationService } from "../../../Services/authentication.service";
import { AcquisitionService } from "../../../Services/acquisition.service";
import { environment } from "../../../../environments/environment";
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  role = "";
  UNITED_URL = environment.LOGOUT;
  UNITEDs_URL = environment.UNITED_ENV;
  constructor(
    private auth: AuthenticationService,
    private ap: AcquisitionService,
    private toastr: ToastrService,
    private userIdle: UserIdleService
  ) {}

  ngOnInit() {
    this.ap.getUserprofile().subscribe(
      response => {
        //console.log(response);
        if (response.roles[0].roleName == "Contracting Officer (CO)") {
          this.role = "Contracting Officer";
        } else if (response.roles[0].roleName == "Program Manager (PM)") {
          this.role = "Program Officer";
        } else {
          console.log("Error With User");
          setTimeout(() => this.toastr.success("User Doesnot exist"));
          document.location.href = `${this.UNITED_URL}`;
          setTimeout(() => {
            document.location.href = `${this.UNITEDs_URL}/landing`;
          }, 300);
          Cookie.deleteAll();
        }
      },
      error => {
        setTimeout(() => this.toastr.error("Error occured in user service dashboard component" + error));
        console.log("Error occured in user service dashboard component" + error);
      }
    );


    //this.startWatching();
    // this.userIdle.onTimerStart().subscribe(count =>{
    //   if (
    //     confirm(
    //       "Session will be logged out in 1min. If you want to continue press Ok"
    //     )
    //   ) {
    //     this.ap.refreshToken();
    //     this.restart();
    //   }
    //   setTimeout(() => {
    //     document.location.href = `${this.UNITED_URL}`;
    //     setTimeout(() => {
    //       document.location.href = `${this.UNITEDs_URL}/landing`;
    //     }, 300);
    //     Cookie.deleteAll();
    //   }, 60000);
    //    console.log(count)}
    //    );
    

    // this.userIdle.onTimeout().subscribe(() =>{
    //   // document.location.href = `${this.UNITED_URL}`;
    //   // setTimeout(() => {
    //   //   document.location.href = `${this.UNITEDs_URL}/landing`;
    //   // }, 300);
    //   // Cookie.deleteAll();

    //   console.log('Time is up!')
    // });
  }
  @HostListener("window:scroll", []) onWindowScroll() {
    this.scrollFunction();
  }
  // When the user scrolls down 20px from the top of the document, show the button
  scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      document.getElementById("myBtn").style.display = "block";
    } else {
      document.getElementById("myBtn").style.display = "none";
    }
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
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
}
