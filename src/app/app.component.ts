
import { Component, OnInit, HostListener } from "@angular/core";
import {
  NavigationCancel,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from "@angular/router";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { UserIdleService } from 'angular-user-idle';
import { timer } from "rxjs/observable/timer";
import { AuthenticationService } from "./Services/authentication.service";
import { AcquisitionService } from "./Services/acquisition.service";
import { environment } from "../environments/environment";
import Quill from 'quill'
const parchment = Quill.import('parchment')
const block = parchment.query('block')
block.tagName = 'DIV'
Quill.register(block /* or NewBlock */, true)

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "HHS-PACD-FRONTEND";
  constructor(
    private _router: Router,
  ) {}

  ngOnInit() {


    this._router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
