var { Given, When, And, Then, Before } = require("cucumber");
import { AppPage } from "../app.po";
import { browser, by, element, protractor, until } from "protractor";

let app: AppPage;

Before(() => (app = new AppPage()));

Given("User is back on SF-1449", { timeout: 2 * 20000 }, async () => {
  await app.s(2000);
});

When("User clicks on Action on the top", { timeout: 2 * 20000 }, async () => {
await app.s(1000);
await app.click_css('#dropdownMenuButton');
await app.s(1000);

});

When("User clicks on Amendment", { timeout: 2 * 20000 }, async () => {
    await app.click_css('#content > app-formdetail > div.container-fluid > div.dropdown.float-right.show > div > a.dropdown-item.text-dark');
    await app.s(1000);
});

When("User clicks on Create", { timeout: 2 * 20000 }, async () => {
    await app.s(3000);
    await app.click_css('#exampleModal > div > div > div.modal-body > div:nth-child(2) > button.btn.btn-primary.btn-sm.mr-3');
});

Then("Amendment is added to the solicitation", { timeout: 2 * 20000 }, async () => {
  await app.s(4000);
});
