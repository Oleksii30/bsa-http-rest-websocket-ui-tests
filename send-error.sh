#!/bin/bash
 
HOMETASK_ID=$1
TOKEN=$2
 
REPO_ERROR_CODE=1001
REPO_ERROR_TEXT="Repository isnt accessible"
 
ERROR_CODE=$REPO_ERROR_CODE
ERROR_TEXT=$REPO_ERROR_TEXT
 
echo "{ \"userHometaskId\": \"$HOMETASK_ID\", \"token\": \"$TOKEN\", \"errorCode\": $ERROR_CODE, \"errorDescription\": \"$ERROR_TEXT\" }" >> result.json