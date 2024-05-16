Feature: form sf-30
form sf-30

Scenario: Adding amendment to the solicitation
    Given User is back on SF-30
    When User clicks on deadlines in form SF-30
    And User enters effective date
    And User enters extension due date
    And User clicks on amendment description
    And User enters amendment description
    Then form sf-30 is done
