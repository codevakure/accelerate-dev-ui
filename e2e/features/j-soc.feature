Feature: Summary of Changes
Summary of Changes

Scenario: Summary of Changes Update Functionality
    Given User is on Form Sf-30
    When User clicks on continuation of sf-30
    And User enters information for contract admin data
    And User enters information for statement of work
    And User enters information for Deliverables
    And User enters information for Special Contract requirements
    Then Summary of changes will be updated
