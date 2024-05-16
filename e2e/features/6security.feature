Feature: Complete security page after creating acquisition
        Complete security page after creating acquisition

  Scenario: New Acquisition is created and user needs to complete information in the security page
            Given User clicks on security in the left side nav
            When User sees security page
            Then User enters information
