import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';

import { AuthenticationService } from '../Services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class RoleGuard implements CanActivate {
    authenticatedUser = this.authService.getAuthenticatedUser();
    public idToken: string;
    constructor(private authService: AuthenticationService,
        private router: Router,
        private toastr: ToastrService) {
        var group;
        if (this.authenticatedUser != null) {
            this.authenticatedUser.getSession(function (err, session) {
                if (err) {
                    alert(err);
                    return;
                }
                // token = session.getIdToken().getJwtToken();
                group = session.getIdToken().payload['cognito:groups'];
            });
        }
        this.idToken = group;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkLoggedIn(state.url);
    }

    checkLoggedIn(url: string): boolean {
        if (this.authService.isLoggedIn() && this.idToken == "Program-Officer") {
            //console.log(this.idToken);
            return true;
        } else if (this.authService.isLoggedIn() && this.idToken == "Contracting-Officer"){
            console.log('this hits when contracting officer messes up')
            this.toastr.error('Dont have required permssions to access this page', 'Authorization Error', {timeOut: 2000})
        } else
        //this.authService.logout();
        this.toastr.info('Please Login to acess this page', 'Credentials Required', {timeOut: 2000});
        this.router.navigate(['/login']);
        // this.authService.logout();
        return false;
    }
}
