module.exports = {
	GREETINGS:
		'Hola amigo👋\n\n' +
		'I am a binary auto-test 🤖. Are you ready to get feedback on your work?\n\n' +
		'I want to note that I evaluate only the functionality for which you can get a maximum of ${total} points.\n' +
		'The rest of the points will be set by the developer from Binary-Studio',
	GO_THROUGH_THE_LIST: "Let's walk through the points 📔",
	RESULT_PERFECT: 'Perfectly! All tests passed 🎉. \n\nYour current score: ${score}/${total}🦜',
	RESULT_GOOD:
		'Good work 👍. But there are moments that can be improved. If you still have attempts, it would be good to correct the mistakes 🛠️\n\nYour current score: ${score}/${total}🦜',
	RESULT_BAD:
		'It could be better  🤷. If you still have attempts, correct the mistakes. I believe in you 🙏\n\nYour current score: ${score}/${total}🦜',
	RESULT_WORST:
		"Looks like you didn't do anything, but you used your attempt in vain.\n" +
		'If you completed the task, check whether the link to the repository is correct : https://bitbucket.org/<username>/<repository>.git\n' +
		'Also check if there is public access to the repository\n' +
		'If this does not help, then write to support.',

	SHOULD_SHOW_WARNING_WHEN_USERNAME_IS_EXISTS:
		'A modal window should appear when a user with a username already exists',
	SHOULD__NOT_SAVE_USERNAME_WHEN_IT_IS_EXISTS:
		'Nothing should be written in sessionStorage when a user with a username already exists',
	SHOULD_CREATE_ROOM_AND_BE_REDIRECTED_TO_IT: 'The user must create a room and be redirected to it',
	SHOULD_SHOW_CREATED_ROOMS: 'Rooms created by other users must be shown',
	SHOULD_SHOW_NUMBER_OF_USERS_IN_ROOM: 'The number of users in the room should be shown on the rooms list page',
	SHOULD_CONNECT_TO_ROOM: 'The user must connect to the room by clicking the join button',
	SHOULD_SHOW_WARNING_WHEN_ROOM_WITH_NAME_ALREADY_EXISTS:
		'The modal window should appear when creating a room, when the room with the entered name already exists',
	ROOM_SHOULD_BE_DELETED_WHEN_THERE_IS_NO_USER:
		'The room must be removed when the user clicks "Back to rooms" and there are no more users in the room',
	ROOM_SHOULD_BE_DELETED_WHEN_SINGLE_USERS_DISCONNECTS:
		'The room should be deleted when the user closes the tab and there are no other users in the room',
	SHOULD_NOT_SHOW_ROOMS_WITH_MAXIMUM_NUMBER_OF_USERS:
		'Rooms with more than MAXIMUM_USERS_FOR_ONE_ROOM users should not be shown',
	SHOULD_DELETE_ROOM_FROM_LIST_WHEN_TIMER_STARTED_OR_GAME_IN_PROGRESS:
		'The room should not be shown to other users when the timer starts or the game continues',
	SHOULD_SHOW_ROOM_NAME_INSIDE_ROOM: 'The room name should be displayed inside room',
	SHOULD_WORK_BACK_TO_ROOMS_BUTTON: 'The "Back to rooms" button should work',
	SHOULD_SHOW_READY_STATUS_OF_USERS_IN_ROOM: 'READY status must be shown to all users',
	SHOULD_SHOW_OTHER_USERS_IN_ROOM: 'All room users must be shown in the room',
	SHOULD_START_GAME_WHEN_ALL_USERS_READY_SHOULD_WORK_SECONDS_TIMER_BEFORE_START_GAME:
		'The game should start when all users are ready. SECONDS_TIMER_BEFORE_START_GAME timer should appear, text should appear after timer',
	SHOULD_START_GAME_WHEN_ALL_USERS_READY_AND_ONE_LEFT_GAME:
		'The game should start when 2/3 of the users are ready and not ready user is disconnected',
	SHOULD_SHOW_PROGRESS: 'The progress of the players must be shown',
	SHOULD_HIGHLIGHT_USER_THAT_ENDED_RACE: 'The user who finished the race must be selected',
	SHOULD_SHOW_RESULTS_AFTER_ALL_USERS_ENTERED_TEXT:
		'The modal with the results should be shown when all users have entered the text',
	SHOULD_END_GAME_WHEN_ONE_USER_DISCONNECTS_AND_OTHER_ENTERED_TEXT:
		'The game should end when one user has disconnected and the others have entered text',
	SHOULD_CLEAR_AFTER_END_GAME:
		'After closing the modal with the results, the status of all users should be reset, the "Ready" and "Back to rooms" buttons should be shown',
	SHOULD_MAKE_HTTP_REQUEST_TO_GET_TEXT:
		'An HTTP request must be made on the /game/texts/:id route to get the text for the game',
	SHOULD_END_GAME_WHEN_TIMER_ENDED_SECONDS_FOR_GAME: 'The game should end when the timer elapsed (SECONDS_FOR_GAME)',
};
