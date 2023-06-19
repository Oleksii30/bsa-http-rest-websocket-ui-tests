const greetings = (localization, maxScore) => {
    return localization.GREETINGS.replace(/\$\{total\}/gi, +maxScore.toFixed(2)) + '\n\n';
};

const icon = passed => (passed ? ' ✅' : ' ❌');

const renderBody = (localization, testResult) => {
    const tests = testResult.suites[0].specs;
    const passedTests = testResult.suites[0].specs.filter(spec => spec.ok).map(test => test.title);

    return (
        localization.GO_THROUGH_THE_LIST +
        '\n\n' +
        tests
            .map((test, i) => {
                const testPassed = passedTests.includes(test.title);

                return `${i + 1}) ${localization[test.title]} ${icon(testPassed)}`;
            })
            .join('\n')
    );
};

const result = (localization, mark, maxScore) => {
    let result = '';
    if (mark === maxScore) {
        result = localization.RESULT_PERFECT;
    } else if (mark > maxScore * 0.6) {
        result = localization.RESULT_GOOD;
    } else if (mark > 0) {
        result = localization.RESULT_BAD;
    } else {
        result = localization.RESULT_WORST;
    }

    return result.replace(/\$\{total\}/gi, +maxScore.toFixed(2)).replace(/\$\{score\}/gi, +mark.toFixed(2));
};

const feedback = (localization, maxScore) => greetings(localization, maxScore);

const trace = (localization, testResult, mark, maxScore) =>
    [renderBody(localization, testResult), result(localization, mark, maxScore)].join('\n\n');

module.exports = {
    feedback,
    trace,
};
