#!/bin/bash

GITHUB_URL=$1
TOKEN=$2
LANG=$3

# Initialize nvm and switch to 12 node
. /etc/profile.d/nvm.sh
nvm use 12

REPO_EXISTS=$(. check-repo.sh $GITHUB_URL)

if [ -f ./result.json ]; then
   rm ./result.json
fi

if [ -d ./homework ]; then
   rm -rf homework
fi

if [ $REPO_EXISTS == true ]
then
   echo 'Repo exists'
else
   $(. send-error.sh $HOMETASK_ID $TOKEN)
   return
fi

echo "CONTINUE"

CHECKFOLDER="homework"

# #Clone repo
mkdir $CHECKFOLDER
cd ./$CHECKFOLDER
git clone $GITHUB_URL .

#INSTALL DEPENDENCIES FOR HOMETASK
npm i

#COPY FILES FOR HOMETASK
rm ./src/socket/config.ts
rm ./src/data.ts
cp ../mocks/config.js ./src/socket/config.ts
cp ../mocks/data.js ./src/data.ts

#BUILD PROJECT (TypeScript)
npm run build

cd ../

#INSTALL DEPENDENCIES
npm i


#RUN TESTS
npm run test | npm run feedback -- $TOKEN $LANG
