#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NOCOLOR='\033[0m'

if which node > /dev/null
  then
    npm i
    read -p "Enter Your API Key: "  apiKey
    read -p "Enter Your Service Account Key: "  serviceAccountKey
    echo -e "${GREEN}Starting import of products!${NOCOLOR}"
    node index.js "{\"apiKey\": \"${apiKey}\",\"serviceAccountKey\": \"${serviceAccountKey}\"}"
  else
    echo -e "${RED}Node is not installed${NOCOLOR}"
  fi
