const fs = require('fs');
const render = require('./render');
const calculateScores = require('./calculateScores');
let testResultJSON = Buffer.alloc(0);

const scores = {
    SHOULD_SHOW_WARNING_WHEN_USERNAME_IS_EXISTS: 0.3,
    SHOULD__NOT_SAVE_USERNAME_WHEN_IT_IS_EXISTS: 0.2,
    SHOULD_SHOW_CREATED_ROOMS: 0.1,
    SHOULD_SHOW_NUMBER_OF_USERS_IN_ROOM: 0.2,
    SHOULD_CONNECT_TO_ROOM: 0.3,
    SHOULD_CREATE_ROOM_AND_BE_REDIRECTED_TO_IT: 0.5,
    SHOULD_SHOW_WARNING_WHEN_ROOM_WITH_NAME_ALREADY_EXISTS: 0.3,
    ROOM_SHOULD_BE_DELETED_WHEN_THERE_IS_NO_USER: 0.25,
    ROOM_SHOULD_BE_DELETED_WHEN_SINGLE_USERS_DISCONNECTS: 0.25,
    SHOULD_NOT_SHOW_ROOMS_WITH_MAXIMUM_NUMBER_OF_USERS: 0.5,
    SHOULD_DELETE_ROOM_FROM_LIST_WHEN_TIMER_STARTED_OR_GAME_IN_PROGRESS: 0.5,
    SHOULD_SHOW_ROOM_NAME_INSIDE_ROOM: 0.1,
    SHOULD_WORK_BACK_TO_ROOMS_BUTTON: 0.4,
    SHOULD_SHOW_READY_STATUS_OF_USERS_IN_ROOM: 1.1,
    SHOULD_SHOW_OTHER_USERS_IN_ROOM: 0.7,
    SHOULD_SHOW_PROGRESS: 1.1,
    SHOULD_START_GAME_WHEN_ALL_USERS_READY_SHOULD_WORK_SECONDS_TIMER_BEFORE_START_GAME: 0.7,
    SHOULD_START_GAME_WHEN_ALL_USERS_READY_AND_ONE_LEFT_GAME: 0.2,
    SHOULD_MAKE_HTTP_REQUEST_TO_GET_TEXT: 0.2,
    //typing process  0.5
    SHOULD_END_GAME_WHEN_TIMER_ENDED_SECONDS_FOR_GAME: 0.4,
    SHOULD_SHOW_RESULTS_AFTER_ALL_USERS_ENTERED_TEXT: 0.5,
    SHOULD_END_GAME_WHEN_ONE_USER_DISCONNECTS_AND_OTHER_ENTERED_TEXT: 0.1,
    SHOULD_HIGHLIGHT_USER_THAT_ENDED_RACE: 0.3,
    SHOULD_CLEAR_AFTER_END_GAME: 0.3,
};

const TOKEN = process.argv[2];
const LANGUAGE_VAR = process.argv[3] ? process.argv[3].toLowerCase() : 'ua';

let language = 'ua';
if (LANGUAGE_VAR === 'en') {
    language = 'en';
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', data => {
    testResultJSON = Buffer.concat([testResultJSON, Buffer.from(data)]);
});

process.stdin.on('end', () => {
    try {
        const maxScore = 9;
        const playwrightCliCommand = 'npx playwright test';
        const bufferData = testResultJSON.toString('utf8');
        const testResultStart = bufferData.indexOf(playwrightCliCommand) + playwrightCliCommand.length;
        const testResult = JSON.parse(bufferData.substring(testResultStart || 0).trim());

        const failedTests = testResult.suites[0].specs.filter(spec => !spec.ok);
        const passedTests = testResult.suites[0].specs.filter(spec => spec.ok);

        const localization = require('./localization/' + language);
        const mark = calculateScores(passedTests, scores, maxScore);

        const trace = render.trace(localization, testResult, mark, maxScore) + getFails(failedTests, localization);
        const generatedFeedback = render.feedback(localization, maxScore);

        fs.writeFileSync(__dirname + '/../rawTestResult.json', JSON.stringify(testResult, null, 4));
        console.log(trace);

        writeResult({
            mark,
            generatedFeedback,
            trace,
        });
        } catch (error) {
            console.error(error);
            writeResult({
                errorCode: 1001,
                errorDescription: error.message,
        });
    }
});

const getFails = (failedTests, localization) => {
	return (
		'\n---------------------------------\n' +
		failedTests.map((test, i) => `${i + 1}) ${localization[test.title]}`).join('\n') +
		'\n---------------------------------'
	);
};

const writeFails = (failedTests, localization) => {
    console.log('\n---------------------------------');
    failedTests.forEach((test, i) => console.log(`${i+1}) ${localization[test.title]}: ${test.err.message}`));
    console.log('\n---------------------------------');
};

const writeResult = result => {
    fs.writeFileSync(
        __dirname + '/../result.json',
        JSON.stringify(
            {
                token: TOKEN,
                buildNumber: String(process.env.BUILD_NUMBER || ''),
                ...result,
            },
            null,
            4
        ),
        { flag: 'w+' }
    );
};
