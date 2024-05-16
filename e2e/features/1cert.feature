Feature: Accept Certificate in Dev
         Accepting Custom Certificate in Dev

  Scenario: Going to api url and accepting custom certificate in dev
            Given Navigate to outer-api-svc.dev.com
            When Click on advanced feature
            And Click on proceed
            Then Unauthorized message screen appears

