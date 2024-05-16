import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivate,
  ActivatedRoute,
  ParamMap
} from "@angular/router";

import { AuthenticationService } from "../Services/authentication.service";
import { ToastrService } from "ngx-toastr";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { environment } from "../../environments/environment";

@Injectable()
export class AuthGuard implements CanActivate {
  authenticatedUser = this.authService.getAuthenticatedUser();
  public idToken;
  public idToken1: string;
  tokenRouter;
  UNITED_URL = environment.LOGOUT;
  UNITEDs_URL = environment.UNITED_ENV;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    var group;

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    this.idToken = route.queryParams.token;
    return this.checkLoggedIn(state.url);
  }

  checkLoggedIn(url: string): boolean {
    if (
      this.idToken == "null" ||
      this.idToken == "undefined" ||
      this.idToken == undefined ||
      this.idToken == null
    ) {
      this.idToken = Cookie.get("hhs-a-token");
      if (
        this.idToken == "null" ||
        this.idToken == "undefined" ||
        this.idToken == undefined ||
        this.idToken == null
      ) {
        document.location.href = `${this.UNITED_URL}`;
        setTimeout(() => {
          document.location.href = `${this.UNITEDs_URL}/landing`;
        }, 300);
        return false;
      } else {
        return true;
      }
    } else {
      if (
        this.idToken == "null" ||
        this.idToken == "undefined" ||
        this.idToken == undefined ||
        this.idToken == null
      ) {
        document.location.href = `${this.UNITED_URL}`;
        setTimeout(() => {
          document.location.href = `${this.UNITEDs_URL}/landing`;
        }, 300);
        return false;
      } else {
        return true;
      }
    }
  }
}
