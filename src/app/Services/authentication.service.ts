import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationDetails, CognitoUserPool, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

const poolData = {
  UserPoolId: 'us-east-1_PKHD3KUtb', 
  ClientId: '7pmo5idudaltoo013f2u4nku36' 
};

const userPool = new CognitoUserPool(poolData);
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  attrresponse: any;
  cognitoUser: any;
  constructor() { }


  register(username, password) {

    const attributeList = [];

    var dataEmail = {
      Name: 'email',
      Value: 'joeliyn.tran@hhs.gov'
    };
    var dataPhoneNumber = {
      Name: 'phone_number',
      Value: '+19999999999'
    };
    var dataFamilyName = {
      Name: 'family_name',
      Value: 'Tran'
    }
    var dataGivenName = {
      Name: 'given_name',
      Value: 'Joeliyn'
    }
    var dataPicture = {
      Name: 'picture',
      Value: 'https://www.tenforums.com/geek/gars/images/2/types/thumb_User_Accounts.png'
    }
    var dataRole = {
      Name: 'custom:role',
      Value: 'Contracting Officer'
    }
    var dataOpdivision = {
      Name: 'custom:opdivision',
      Value: 'Agency for Healthcare Research and Quality, AHRQ'
    }
    var dataCode = {
      Name: 'custom:code',
      Value: '65FCME'
    }
    var dataAsapecialist = {
      Name: 'custom:asapecialist',
      Value: 'Michelle Smith, michelle.smith@hhs.gov, 555-555-5555'
    }
    var dataWarrant = {
      Name: 'custom:warrant',
      Value: 'High'
    }
    var dataPo = {
      Name: 'custom:po',
      Value: 'Administration for Children & Families, ACF, Mariah Carey, mariah.carey@hhs.gov, 555-555-5555'
    }
    var dataCo = {
      Name: 'custom:cntrctofc',
      Value: 'Imneet'
    }
    var dataCoContactInf = {
      Name: 'custom:coContactInf',
      Value: '200 Independence Ave SW Washington DC 20201'
    }
    var dataCoPhoneNum = {
      Name: 'custom:coPhonenNum',
      Value: '+18577569131'
    }
    var dataCoEmail = {
      Name: 'custom:coEmail',
      Value: 'imnnetpal.brar@aurotechcorp.com'
    }
    var dataBo = {
      Name: 'custom:budgtaprv',
      Value: 'Daren'
    }
    var dataBoContactInf = {
      Name: 'custom:baContatctInf',
      Value: '8701 Georgia Avenue Silver Spring, MD 20910'
    }
    var dataBoPhoneNum = {
      Name: 'custom:baPhoneNum',
      Value: '+19998887776'
    }
    var dataBoEmail = {
      Name: 'custom:baEmail',
      Value: 'daren.arnold@aurotechcorp.com'
    }


    var attributeEmail = new CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
    var attributeFamilyName = new CognitoUserAttribute(dataFamilyName);
    var attributeGivenName = new CognitoUserAttribute(dataGivenName);
    var attributePicture = new CognitoUserAttribute(dataPicture);
    var attributeRole = new CognitoUserAttribute(dataRole);
    var attributeOpdivision = new CognitoUserAttribute(dataOpdivision);
    var attributeCode = new CognitoUserAttribute(dataCode);
    var attributeAsapecialist = new CognitoUserAttribute(dataAsapecialist);
    var attributeWarrant = new CognitoUserAttribute(dataWarrant);
    var attributePo = new CognitoUserAttribute(dataPo);
    var attributeCo = new CognitoUserAttribute(dataCo);
    var attributeCoContactInf = new CognitoUserAttribute(dataCoContactInf);
    var attributeCoPhonenNum = new CognitoUserAttribute(dataCoPhoneNum);
    var attributeCoEmail = new CognitoUserAttribute(dataCoEmail);
    
    var attributeBo = new CognitoUserAttribute(dataBo);
    var attributeBoContactInf = new CognitoUserAttribute(dataBoContactInf);
    var attributeBoPhonenNum = new CognitoUserAttribute(dataBoPhoneNum);
    var attributeBoEmail = new CognitoUserAttribute(dataBoEmail);
    var attributeCode = new CognitoUserAttribute(dataCode);

    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
    attributeList.push(attributeFamilyName);
    attributeList.push(attributeGivenName);
    attributeList.push(attributePicture);
    attributeList.push(attributeRole);
    attributeList.push(attributeOpdivision);
    attributeList.push(attributeCode);
    attributeList.push(attributeAsapecialist);
    attributeList.push(attributeWarrant);
    attributeList.push(attributePo);
    attributeList.push(attributeCo);
    attributeList.push(attributeCoContactInf);
    attributeList.push(attributeCoPhonenNum);
    attributeList.push(attributeCoEmail);
    attributeList.push(attributeBo);
    attributeList.push(attributeBoContactInf);
    attributeList.push(attributeBoPhonenNum);
    attributeList.push(attributeBoEmail);



    return Observable.create(observer => {
      userPool.signUp(username, password, attributeList, null, (err, result) => {
        //console.log('list of attributes are', attributeList)
        if (err) {
          //console.log("signUp error", err);
          observer.error(err);
        }

        this.cognitoUser = result.user;
        //console.log("signUp success", result);
        observer.next(result);
        observer.complete();
      });
    });

  }

  confirmAuthCode(code) {
    const user = {
      Username: this.cognitoUser.username,
      Pool: userPool
    };
    return Observable.create(observer => {
      const cognitoUser = new CognitoUser(user);
      cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
          //console.log(err);
          observer.error(err);
        }
        //console.log("confirmAuthCode() success", result);
        observer.next(result);
        observer.complete();
      });


    });
  }

  signIn(username, password) {
    const authenticationData = {
      Username: username,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: username,
      Pool: userPool
    };
    ////console.log(userData);
    const cognitoUser = new CognitoUser(userData);

    return Observable.create(observer => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          // //console.log('access token + ' + result.getAccessToken().getJwtToken());
          // //console.log('idToken + ' + result.getIdToken().getJwtToken());
          // //console.log(result);
          ////console.log('idToken + ' ,result.getIdToken().payload['cognito:groups']);
          // //console.log(result);
          observer.next(result);
          observer.complete();

        },
        onFailure: function (err) {
          //console.log(err);
          observer.error(err);
        },
        newPasswordRequired: function (authenticationDetails, requiredAttributes) {
          cognitoUser.completeNewPasswordChallenge(
            password,
            {},
            {
              onSuccess: (user) => {
                //console.log('success hello', user);
              },
              onFailure: (error) => {
                //console.log(error);
              },

            },
          );
        }
      });


    });


  }

  public getAttributes() {

    return Observable.create(observer => {
      var cognitoUser = userPool.getCurrentUser();
      cognitoUser.getSession(function (err, session) {
        if (err) {
          alert(err);
          return;
        }
        ////console.log('session validity: ' + session.isValid());
      });

      return cognitoUser.getUserAttributes(function (err, result) {
        if (err) {
          alert(err);
          return;
        }
        observer.next(JSON.parse(JSON.stringify(result)));
        observer.complete();
        // //console.log(JSON.parse(JSON.stringify(result)));
        // //console.log(JSON.parse(JSON.stringify(result)))
        // return JSON.parse(JSON.stringify(result))
      });
    });
  }



  newPassword(npassword) {
    const user = {
      Username: this.cognitoUser.username,
      Pool: userPool
    };
    return Observable.create(observer => {
      const cognitoUser = new CognitoUser(user);
      cognitoUser.completeNewPasswordChallenge(
        npassword,
        {},
        {
          onSuccess: (user) => {
            //console.log('success', user);
          },
          onFailure: (error) => {
            //console.log(error);
          },

        },
      );
    });
  }

  isLoggedIn() {
    return userPool.getCurrentUser() != null;
  }

  getAuthenticatedUser() {
    // gets the current user from the local storage
    return userPool.getCurrentUser();

  }


  logout() {
    this.cognitoUser = null;
    this.getAuthenticatedUser().signOut();
  }


}
