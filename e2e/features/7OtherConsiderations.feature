Feature: “Other Considerations” page in newly built acquisition page
    Scenario: “Other Considerations” page in newly built Acquisition page

        Given User is on Project General Page
        When User clicks on the “Other Considerations” option on the left nav
        And User should see a drop-down menu under “Contract Administration” option which is a mandatory field
        Then User should select one from the drop down according to their requirement
