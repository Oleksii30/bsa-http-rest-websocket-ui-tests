# Tests on Git lecture of BSA 2nd stage

## Run tests

```bash
# run test
./test.sh <repo url> <token> <language>

# show feedback
cat ./result.json
```
```json
{
    "token": string,
    "buildNumber": string,
    "mark": number,
    "generatedFeedback": string,
    "trace": string 
}
```

`language` can be 'ua','ru','en'

## Github REST API

To make more than 50 calls you need to setup token:

1. Create .env file

```bash
cp .env.example .env
```

2. Create github [personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)

Settings -> Developer Settings -> Personal access token -> Generate token

3. Add generated token to env variable: GITHUB_TOKEN

4. Enjoy


______________________________________
## TODO for homework

* Specify when use TS to set all files in folder src
* Create command npm build to build typescript 