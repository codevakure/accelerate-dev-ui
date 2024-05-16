var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));

Given("User is on SF-1449", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

When(
  "User clicks on Preview Icon on the top",
  { timeout: 2 * 20000 },
  async () => {
    await app.elementClickable_id("preview");
    await app.s(2000);
  }
);

Then("User clicks on Export-Print", { timeout: 2 * 20000 }, async () => {
 // await app.click_id("savebutton1");
  await browser.get('http://localhost:4300/#/home/sol/HHSR769BFQQWW');
  await app.s(4000);
});

// When("User clicks publish", { timeout: 2 * 20000 }, async () => {
//   await app.click_id("yes");
//   await app.s(4000);
// });

// Then(
//   "The solicitation is published by CO and it takes you to the form SF-1449",
//   { timeout: 2 * 20000 },
//   async () => {
//     await app.s(2000);
//     // await browser.getCurrentUrl().then((url) => {
//     //   console.log("URL from window",url)
//     //   browser.get(
//     //     `http://localhost:4300/#/home/sol/${url.split("/").reverse()[1]}`
//     //   );
//     //   app.s(2000);
//     // });
//     await app.s(3000);
//   }
// );
