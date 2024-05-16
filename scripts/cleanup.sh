#!/bin/bash

if [ -d "/tmp/hhs-frontend-phase2" ]; then
  # Control will enter here if DIRECTORY exists.
  rm -rf /tmp/hhs-frontend-phase2
fi

#   Create the outout folder for CodeDeeploy
mkdir -p /tmp/hhs-frontend-phase2
