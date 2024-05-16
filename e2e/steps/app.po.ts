
import { browser, by, element, protractor, until } from 'protractor';
declare var $: any;

export class AppPage {
  public navigateToCertPage() {
    return browser.get(
      "https://outer-api-svc.accelerate-dev.com/acc-api/contract"
    );
  }

  public navigateToSandbox() {
    return browser.get(
      "https://sandbox-accelerate.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=5sp4tl4bdfo6v06ajk8bdsb1or&redirect_uri=https://sandbox.accelerate.hhs.gov/public/auth/cognito/callBack"
    );
  }


  public navigateToSandboxLogout() {
    return browser.get(
      "https://sandbox-accelerate.auth.us-east-1.amazoncognito.com/logout?response_type=code&client_id=5sp4tl4bdfo6v06ajk8bdsb1or&redirect_uri=https://sandbox.accelerate.hhs.gov/public/auth/cognito/callBack"
    );
  }

  public enterInput_id(id, string) {
    return element(by.id(id)).sendKeys(string);
  }

  public enterInput_css(css, string) {
    return element(by.css(css)).sendKeys(string);
  }

  public click_id(id) {
    return element(by.id(id)).click();
  }


  public click_tagname(tagname) {
    return element(by.tagName(tagname)).click();
  }

  public click_css(css) {
    return element(by.css(css)).click();
  }


  public activeElement_send_keys(string) {
    return browser.switchTo().activeElement().sendKeys(string);
  }


  public elementClickable_id(id) {
    var EC = protractor.ExpectedConditions;
  //  browser.sleep(1500);
    var findelement = element(by.id(id));
  //  browser.sleep(1500);
    browser.wait(EC.elementToBeClickable(findelement), 1000);
 //   browser.sleep(1500);
    return findelement.click();
  }


  public elementClickable_css(css) {
    var EC = protractor.ExpectedConditions;
  //  browser.sleep(500);
    var findelement = element(by.css(css));
   // browser.sleep(500);
    browser.wait(EC.elementToBeClickable(findelement), 1000);
   // browser.sleep(500);
    return findelement.click();
  }

  public clickEnter(){
      return browser.actions().sendKeys(protractor.Key.ENTER).perform();
  }


  public clickEscape(){
    return browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
}


public selectDropdown(){
      return browser.executeScript("document.querySelectorAll('.ng-option')[0].click()");
  }

  public s(timer) {
    return browser.sleep(timer);
  }

  public pressEsc() {
    $('body').trigger({
        type: 'keyup',
        which: 27 // Escape key
    });
}
}
