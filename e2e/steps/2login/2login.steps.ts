import { expect } from "chai";
var { Given, When, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));

// Scenario1::  Enter user credentials and going to server page
Given("Going sandbox login page", { timeout: 2 * 20000 }, async () => {
  await app.navigateToSandbox();
  await app.s(2000);
});

When("Enter User Information", { timeout: 2 * 20000 }, async () => {
  await app.elementClickable_css(
    "body > div.container > div > div.modal-content.background-customizable.modal-content-mobile.visible-md.visible-lg > div.modal-body > div:nth-child(2) > div:nth-child(2) > div > div > form > div:nth-child(3)"
  );
  await app.activeElement_send_keys("daren.arnold@aurotechcorp.com");
 //await app.activeElement_send_keys("ashley.spence@aurotechcorp.com");
  await app.s(1500);
  await app.elementClickable_css(
    "body > div.container > div > div.modal-content.background-customizable.modal-content-mobile.visible-md.visible-lg > div.modal-body > div:nth-child(2) > div:nth-child(2) > div > div > form > div:nth-child(5)"
  );
 await app.activeElement_send_keys("Ilove2climb!");
  //await app.activeElement_send_keys("@Ashley123");
});

When("Click on Enter", { timeout: 2 * 20000 }, async () => {
  await app.s(1500);
  app.clickEnter();
});

Then("Server Page Appears", { timeout: 2 * 20000 }, async () => {
  await app.s(1000);
});


//Scenario2:: Enter server information and going to dev dashboard

Given(
  "User is on server information page",
  { timeout: 2 * 20000 },
  async () => {
    await app.s(1000);
  }
);

When("User Enter server information", { timeout: 2 * 20000 }, async () => {
  await app.enterInput_id("input1", "localhost:4300/#/home");
  await app.s(1000);
});

When("User clicks on http checkbox", { timeout: 2 * 20000 }, async () => {
  await app.click_id("input2");
  await app.s(1000);
});

When("User clicks on go button", { timeout: 2 * 20000 }, async () => {
  await app.click_tagname('button');
  await app.s(1000);
});

Then("Dev dashboard appears", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
  // Acquisition Route
  //await browser.get('http://localhost:4300/#/home/HHS12GKNDZWUV');
  
//Solicitation Route
//  await browser.get('http://localhost:4300/#/home/sol/HHSFAIFGOLRTX/preview');
//   await app.s(4000);
//   await app.click_id('savebutton1');
//   await app.s(3000);
//  // await app.click_css("body");
//   await browser.switchTo().activeElement().click();
// //  await browser.switchTo().window(browser.getWindowHandles().toArray()[1].toString());
//   await app.s(3000);
 // await browser.switchTo().activeElement().sendKeys(protractor.Key.ESCAPE)
 // await app.s(3000);
 // await browser.executeScript("return document.querySelector('print-preview-app').shadowRoot.querySelector('print-preview-sidebar').shadowRoot.querySelector('print-preview-destination-settings').shadowRoot.querySelector('cr-button.cancel-button').click();");
 // await app.click_css('div > cr-button.cancel-button');
 // await browser.refresh();
  // await browser.actions().mouseMove(this.pageTitleId).sendKeys('Test Hello').perform();


 // await app.clickEnter();
//   await browser.getAllWindowHandles().then((handles) => {
//     console.log("Handles",handles);
//     browser.switchTo().window(handles[0]);  

// })

  
  // await app.s(3000);
  // await app.click_css(
  //   "#btn_dropdown0 > button.btn.btn-primary.btn-sm.action"
  // );
//   await browser.driver.executeScript('window.focus();');
//   await app.s(2000);
//  // await app.click_css('div > cr-button.cancel-button');
//   await app.s(2000);

//   await browser.getCurrentUrl().then((url) => {
//     console.log("URL from window",url.split("/").reverse()[1])
//     browser.get(
//       `http://localhost:4300/#/home/sol/${url.split("/").reverse()[1]}`
//     );
//     app.s(2000);
//   });
  await app.s(3000);

});
