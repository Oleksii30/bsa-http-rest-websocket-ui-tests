// @ts-check
const { test, expect } = require('@playwright/test');
import { SECONDS_FOR_GAME } from '../mocks/config';
import { SECONDS_TIMER_BEFORE_START_GAME } from '../mocks/config';

const username = 'username-test';
let app = null;
let server = null;
const url = 'http://localhost:3002';

import {
	getAppAndServer,
	login,
	sleep,
	createRoom,
	joinRoom,
	checkIsInRoom,
	quitRoom,
	checkNoRoomShown,
	pressReadyButton,
	getRoomName,
	createRoomWithTwoUsers,
	checkIsInRoomSelector,
	checkTimerAppeared,
	checkTextDoesNotExists,
	checkReadyButtonDoesNotExists,
	checkTextToAppear,
	checkTimerDoesNotExists,
	checkQuitRoomDoesNotExists,
	getTextToEnter,
	checkProgress,
	enterText,
	checkFinished,
	checkUserPlace,
	closeResultsModal,
	checkReadyButtonToAppear,
	checkQuitRoomToAppear,
	checkNoReadyUser,
} from './utils';

const initPages = async (numberOfContext, browser) => {
	const pages = await Promise.all(
	  Array(numberOfContext)
		.fill(null)
		.map(async () => {
		  const context  = await browser.newContext();
		  const page = await context.newPage();
		  await page.goto(url);
		  return page;
		}
		)
	);

	return pages
  };

test.beforeEach(async ({ page }, testInfo) => {
  const { app: serverApp, httpServer } = getAppAndServer();
  app = serverApp;
  server = httpServer;
});

test.afterEach(async ({ page }, testInfo) => {
  server?.close();
});

test('SHOULD_SHOW_WARNING_WHEN_USERNAME_IS_EXISTS', async ({ browser }) => {
	test.setTimeout(10000);

  const [page1, page2] = await initPages(2, browser);

  await login(page1, username);
  await login(page2, username);

  await sleep(1000);
  const modal = await page2.locator(".modal");

  await expect(modal).toBeVisible();
})

test('SHOULD__NOT_SAVE_USERNAME_WHEN_IT_IS_EXISTS', async ({ browser }) => {
	test.setTimeout(10000);

  const [page1, page2] = await initPages(2, browser);

  await login(page1, username);
  await login(page2, username);

  const submit = await page2.locator(".submit-btn");
  await submit.click();

  const usernameFromSessionStorage = await page1.evaluate(() => window.sessionStorage.username);
  const usernameFromSessionStorage1 = await page2.evaluate(() => window.sessionStorage.username);

  expect(usernameFromSessionStorage).not.toEqual(usernameFromSessionStorage1);
})

test('SHOULD_CREATE_ROOM_AND_BE_REDIRECTED_TO_IT', async ({ page }) => {
	test.setTimeout(10000);
  await page.goto(url);
  await login(page, username);
  await createRoom(page, 'room1');
  const roomPage = await page.locator("#game-page");
  await expect(roomPage).toBeVisible();
})

test('SHOULD_SHOW_CREATED_ROOMS', async ({ browser }) => {
	test.setTimeout(10000);

  const username1 = 'user1';
  const username2 = 'user2';
  const username3 = 'user3';
  const roomName1 = 'room-1';
  const roomName2 = 'room-2';

  const [page1, page2, page3] = await initPages(3, browser);

  await login(page1, username1);
  await login(page2, username2);
  await login(page3, username3);

  await createRoom(page1, roomName1);
  await createRoom(page2, roomName2);

  await expect(page3.getByText(roomName1)).toBeVisible();
  await expect(page3.getByText(roomName2)).toBeVisible();
});

test('SHOULD_SHOW_NUMBER_OF_USERS_IN_ROOM', async ({ browser }) => {
	test.setTimeout(10000);
  const [page1, page2, page3] = await initPages(3, browser);

  const username1 = 'user1';
  const username2 = 'user2';
  const username3 = 'user3';
  const roomName = 'room-1';

  await login(page1, username1);
  await login(page2, username2);
  await login(page3, username3);

  await createRoom(page1, roomName);

  const locator = await page2.locator("[data-room-number-of-users='1']")
  await expect(locator).toBeVisible();

  const locator1 = await page3.locator("[data-room-number-of-users='1']")
  await expect(locator1).toBeVisible();

  await joinRoom(page2);

  const locator2 = await page3.locator("[data-room-number-of-users='2']")
  await expect(locator2).toBeVisible();
});

test('SHOULD_CONNECT_TO_ROOM', async ({ browser }) => {
	test.setTimeout(10000);
  const [page1, page2, page3] = await initPages(3, browser);

  const username1 = 'user1';
  const username2 = 'user2';
  const username3 = 'user3';
  const roomName = 'room-1';

  await login(page1, username1);
  await login(page2, username2);
  await login(page3, username3);

  await createRoom(page1, roomName);
  await sleep(200);
  await checkIsInRoom(page1);

  await joinRoom(page2);
  await sleep(200);
  await checkIsInRoom(page2);

  await joinRoom(page3);
  await sleep(200);
  await checkIsInRoom(page3);
});

test('SHOULD_SHOW_WARNING_WHEN_ROOM_WITH_NAME_ALREADY_EXISTS', async ({ browser }) => {
	test.setTimeout(10000);
  const [page1, page2] = await initPages(2, browser);

  const username1 = 'user1';
  const username2 = 'user2';
  const roomName = 'room-1';

  await login(page1, username1);
  await login(page2, username2);

  await createRoom(page1, roomName);
  await checkIsInRoom(page1);

  await sleep(200);

  await createRoom(page2, roomName);

  const modal = await page2.locator(".modal");
  await expect(modal).toBeVisible();
});

test('ROOM_SHOULD_BE_DELETED_WHEN_THERE_IS_NO_USER', async ({ browser }) => {
	test.setTimeout(10000);
  const [page] = await initPages(1, browser);

  const username = 'username-test';
  const roomName = 'test-room';

  await login(page, username);

  await createRoom(page, roomName);
  await checkIsInRoom(page);

  await quitRoom(page);

  const locator = await page.locator('#add-room-btn')
  await expect(locator).toBeVisible();

  await expect(page.getByText(roomName)).not.toBeVisible();

});

test('ROOM_SHOULD_BE_DELETED_WHEN_SINGLE_USERS_DISCONNECTS', async ({ browser }) => {
	test.setTimeout(10000);
  const [page1, page2] = await initPages(2, browser);

  const username1 = 'username-test';
  const username2 = 'username-test-1';
  const roomName = 'test-room';

  await login(page1, username1);

  await createRoom(page1, roomName);
  await checkIsInRoom(page1);

  page1.close();

  await login(page2, username2);

  await expect(page2.getByText(roomName)).not.toBeVisible();
});

test('SHOULD_NOT_SHOW_ROOMS_WITH_MAXIMUM_NUMBER_OF_USERS', async ({ browser }) => {
	test.setTimeout(10000);
  const [page1, page2, page3, page4] = await initPages(4, browser);

  const username1 = 'user1';
  const username2 = 'user2';
  const username3 = 'user3';
  const username4 = 'user4';
  const roomName = 'room-1';

  await login(page1, username1);
  await login(page2, username2);
  await login(page3, username3);
  await login(page4, username4);

  await createRoom(page1, roomName);
  await checkIsInRoom(page1);

  await Promise.all([joinRoom(page2), joinRoom(page3)]);
  await Promise.all([checkIsInRoom(page2), checkIsInRoom(page3)]);

  await checkNoRoomShown(page4);
});

test('SHOULD_DELETE_ROOM_FROM_LIST_WHEN_TIMER_STARTED_OR_GAME_IN_PROGRESS', async ({ browser }) => {
	test.setTimeout(10000);
  const [page1, page2, page3] = await initPages(3, browser);

  const username1 = 'user1';
  const username2 = 'user2';
  const username3 = 'user3';
  const roomName = 'room-1';

  await login(page1, username1);
  await login(page2, username2);
  await login(page3, username3);

  await createRoom(page1, roomName);
  await joinRoom(page2);

  await Promise.all([checkIsInRoom(page1), checkIsInRoom(page2)]);

  await pressReadyButton(page1);
  await pressReadyButton(page2);

  await checkNoRoomShown(page3);

  await page3.reload();

  await checkNoRoomShown(page3);
});

test('SHOULD_SHOW_ROOM_NAME_INSIDE_ROOM', async ({ browser }) => {
	test.setTimeout(10000);
  const [page1] = await initPages(1, browser);
  const username = 'username-test';
  const roomName = 'room-1';

  await login(page1, username);

  await createRoom(page1, roomName);
  await checkIsInRoom(page1);

  const expectedRoomName = await getRoomName(page1);

  await expect(expectedRoomName).toBe(roomName);
});

test('SHOULD_WORK_BACK_TO_ROOMS_BUTTON', async ({ browser }) => {
	test.setTimeout(10000);
  const [page1] = await initPages(1, browser);
  const username = 'username-test';
  const roomName = 'room-1';

  await login(page1, username);

  await createRoom(page1, roomName);
  await checkIsInRoom(page1);
  await quitRoom(page1);
  await checkIsInRoomSelector(page1);
});

test('SHOULD_SHOW_READY_STATUS_OF_USERS_IN_ROOM', async ({ browser }) => {
	test.setTimeout(10000);

  const [page1, page2] = await initPages(2, browser);

  const username1 = 'user1';
  const username2 = 'user2';

  await login(page1, username1);
  await login(page2, username2);

  await createRoomWithTwoUsers({page1, page2});

  await pressReadyButton(page1);

  const user1ReadyOnPage1 = page1.locator(`.ready-status[data-username='${username1}']`);
  expect(await user1ReadyOnPage1.evaluate(node => String(node.dataset.ready))).toBe('true');

  const user1ReadyOnPage2 = page2.locator(`.ready-status[data-username='${username1}']`);
  expect(await user1ReadyOnPage2.evaluate(node => String(node.dataset.ready))).toBe('true');

  const user2NotReadyOnPage1 = page1.locator(`.ready-status[data-username='${username2}']`);
  expect(await user2NotReadyOnPage1.evaluate(node => String(node.dataset.ready))).toBe('false');

  const user2NotReadyOnPage2 = page2.locator(`.ready-status[data-username='${username2}']`);
  expect(await user2NotReadyOnPage2.evaluate(node => String(node.dataset.ready))).toBe('false');

  await pressReadyButton(page1);

  expect(await user1ReadyOnPage1.evaluate(node => String(node.dataset.ready))).toBe('false');
  expect(await user1ReadyOnPage2.evaluate(node => String(node.dataset.ready))).toBe('false');
});

test('SHOULD_SHOW_OTHER_USERS_IN_ROOM', async ({ browser }) => {
	test.setTimeout(10000);
  const [page1, page2] = await initPages(2, browser);

  const username1 = 'user1';
  const username2 = 'user2';

  await login(page1, username1);
  await login(page2, username2);

  await createRoomWithTwoUsers({page1, page2});

  const page1User1 = await page1.locator(`.username[data-username='${username1}']`).evaluate(node => node.innerText);
  const page2User1 = await page2.locator(`.username[data-username='${username1}']`).evaluate(node => node.innerText);
  const page1User2 = await page1.locator(`.username[data-username='${username2}']`).evaluate(node => node.innerText);
  const page2User2 = await page2.locator(`.username[data-username='${username2}']`).evaluate(node => node.innerText);

  expect(page1User1.includes('(you)')).toBe(true);
  expect(page2User2.includes('(you)')).toBe(true);
  expect(page2User1).toBe(username1);
  expect(page1User2).toBe(username2);
});

test('SHOULD_START_GAME_WHEN_ALL_USERS_READY_SHOULD_WORK_SECONDS_TIMER_BEFORE_START_GAME', async ({ browser }) => {
  test.setTimeout(15000);
  const [page1, page2] = await initPages(2, browser);

  const username1 = 'user1';
  const username2 = 'user2';

  await login(page1, username1);
  await login(page2, username2);

  await createRoomWithTwoUsers({page1, page2});

  await pressReadyButton(page1);
  await pressReadyButton(page2);

  await Promise.all([checkTimerAppeared(page1), checkTimerAppeared(page2)]);
  await Promise.all([checkTextDoesNotExists(page1), checkTextDoesNotExists(page2)]);
  await Promise.all([checkReadyButtonDoesNotExists(page1), checkReadyButtonDoesNotExists(page2)]);
  await Promise.all([checkTextToAppear(page1), checkTextToAppear(page2)]);
  await Promise.all([checkTimerDoesNotExists(page1), checkTimerDoesNotExists(page2)]);
  await Promise.all([checkQuitRoomDoesNotExists(page1), checkQuitRoomDoesNotExists(page2)]);
});

test('SHOULD_START_GAME_WHEN_ALL_USERS_READY_AND_ONE_LEFT_GAME', async ({ browser }) => {
  test.setTimeout(10000);
  const [page1, page2, page3] = await initPages(3, browser);

  const username1 = 'user1';
  const username2 = 'user2';
  const username3 = 'user3';

  await login(page1, username1);
  await login(page2, username2);
  await login(page3, username3);

  await createRoom(page1, 'room1');
  await Promise.all([joinRoom(page2), joinRoom(page3)]);

  await pressReadyButton(page1);
  await pressReadyButton(page2);

  await quitRoom(page3);

  await Promise.all([checkTimerAppeared(page1), checkTimerAppeared(page2)]);
  await Promise.all([checkTextDoesNotExists(page1), checkTextDoesNotExists(page2)]);
  await Promise.all([checkReadyButtonDoesNotExists(page1), checkReadyButtonDoesNotExists(page2)]);
  await Promise.all([checkTextToAppear(page1), checkTextToAppear(page2)]);
  await Promise.all([checkTimerDoesNotExists(page1), checkTimerDoesNotExists(page2)]);
  await Promise.all([checkQuitRoomDoesNotExists(page1), checkQuitRoomDoesNotExists(page2)]);
});

test('SHOULD_SHOW_PROGRESS', async ({ browser }) => {
  test.setTimeout(10000);
  const [page1, page2] = await initPages(2, browser);

  const username1 = 'user1';
  const username2 = 'user2';

  await login(page1, username1);
  await login(page2, username2);

  await createRoomWithTwoUsers({page1, page2});

  await pressReadyButton(page1);
  await pressReadyButton(page2);

  await Promise.all([checkTextToAppear(page1), checkTextToAppear(page2)]);

  const page1Text = await getTextToEnter(page1);

  await page1.keyboard.down('Shift');
  await page1.keyboard.press(`KeyT`);
  await page1.keyboard.up('Shift');
  await page1.keyboard.press(`KeyE`);
  await page1.keyboard.press(`KeyX`);
  await page1.keyboard.press(`KeyT`);
  await page1.keyboard.press(`-`);
  await page1.keyboard.press(`#`);

  await checkProgress(page1, 'user1', 50);
  await checkProgress(page2, 'user1', 50);
});

test('SHOULD_HIGHLIGHT_USER_THAT_ENDED_RACE', async ({ browser }) => {
  test.setTimeout(10000);
  const [page1, page2] = await initPages(2, browser);

  const username1 = 'user1';
  const username2 = 'user2';

  await login(page1, username1);
  await login(page2, username2);

  await createRoomWithTwoUsers({page1, page2});

  await Promise.all([pressReadyButton(page1), pressReadyButton(page2)]);
  await Promise.all([checkTextToAppear(page1), checkTextToAppear(page2)]);

  const page1Text = await getTextToEnter(page1);
  const page2Text = await getTextToEnter(page2);

  await expect(page1Text, 'Text should be the same on both pages').toBe(page2Text);

  await enterText(page1, page1Text[page1Text.length - 1]);

  await checkFinished(page1, 'user1');
  await checkFinished(page2, 'user1');
});

test('SHOULD_SHOW_RESULTS_AFTER_ALL_USERS_ENTERED_TEXT', async ({ browser }) => {
  test.setTimeout(10000);
  const [page1, page2] = await initPages(2, browser);

  const username1 = 'user1';
  const username2 = 'user2';

  await login(page1, username1);
  await login(page2, username2);

  await createRoomWithTwoUsers({page1, page2});

  await Promise.all([pressReadyButton(page1), pressReadyButton(page2)]);
  await Promise.all([checkTextToAppear(page1), checkTextToAppear(page2)]);

  const text = await getTextToEnter(page1);
  await enterText(page1, text[text.length - 1]);
  await enterText(page2, text[text.length - 1]);

  await Promise.all([
    checkUserPlace(page1, 'user1', 1),
    checkUserPlace(page1, 'user2', 2),
    checkUserPlace(page2, 'user1', 1),
    checkUserPlace(page2, 'user2', 2),
  ]);
});

test('SHOULD_END_GAME_WHEN_ONE_USER_DISCONNECTS_AND_OTHER_ENTERED_TEXT', async ({ browser }) => {
  test.setTimeout(10000);
  const [page1, page2, page3] = await initPages(3, browser);

  const username1 = 'user1';
  const username2 = 'user2';
  const username3 = 'user3';

  await login(page1, username1);
  await login(page2, username2);
  await login(page3, username3);

  await createRoomWithTwoUsers({page1, page2});

  await joinRoom(page3);
  await sleep(300);

  await Promise.all([pressReadyButton(page1), pressReadyButton(page2), pressReadyButton(page3)]);
  await Promise.all([checkTextToAppear(page1), checkTextToAppear(page2), checkTextToAppear(page3)]);

  const text = await getTextToEnter(page1);
  await enterText(page1, text[text.length - 1]);
  await sleep(200);
  await enterText(page2, text[text.length - 1]);

  await page3.close();

  await sleep(200);
  await Promise.all([
    checkUserPlace(page1, 'user1', 1),
    checkUserPlace(page1, 'user2', 2),
    checkUserPlace(page2, 'user1', 1),
    checkUserPlace(page2, 'user2', 2),
  ]);
});

test('SHOULD_END_GAME_WHEN_TIMER_ENDED_SECONDS_FOR_GAME', async ({ browser }) => {
  const [page1, page2] = await initPages(2, browser);

  const username1 = 'user1';
  const username2 = 'user2';

  await login(page1, username1);
  await login(page2, username2);

  await createRoomWithTwoUsers({page1, page2});

  await Promise.all([pressReadyButton(page1), pressReadyButton(page2)]);
  await Promise.all([checkTextToAppear(page1), checkTextToAppear(page2)]);

  const text = await getTextToEnter(page1);
  await enterText(page1, text[text.length - 1]);
  await sleep(200);

  await sleep(SECONDS_FOR_GAME * 1000);

  await Promise.all([
    checkUserPlace(page1, 'user1', 1),
    checkUserPlace(page1, 'user2', 2),
    checkUserPlace(page2, 'user1', 1),
    checkUserPlace(page2, 'user2', 2),
  ]);
});

test('SHOULD_CLEAR_AFTER_END_GAME', async ({ browser }) => {
  test.setTimeout(10000);
  const [page1, page2] = await initPages(2, browser);

  const username1 = 'user1';
  const username2 = 'user2';

  await login(page1, username1);
  await login(page2, username2);

  await createRoomWithTwoUsers({page1, page2});

  await Promise.all([pressReadyButton(page1), pressReadyButton(page2)]);
  await Promise.all([checkTextToAppear(page1), checkTextToAppear(page2)]);

  const text = await getTextToEnter(page1);
  await enterText(page1, text[text.length - 1]);
  await sleep(200);
  await enterText(page2, text[text.length - 1]);

  await sleep(1000);

  await closeResultsModal(page1);
  await closeResultsModal(page2);

  await sleep(200);
  await Promise.all([checkReadyButtonToAppear(page1), checkReadyButtonToAppear(page2)]);
  await Promise.all([checkQuitRoomToAppear(page1), checkQuitRoomToAppear(page2)]);
  await Promise.all([checkNoReadyUser(page1), checkNoReadyUser(page2)]);
});

test('SHOULD_MAKE_HTTP_REQUEST_TO_GET_TEXT', async ({ browser }) => {
  test.setTimeout(15000);
  const [page1, page2] = await initPages(2, browser);
  let isSendTextRequest = false;

  const username1 = 'user1';
  const username2 = 'user2';

  await login(page1, username1);
  await login(page2, username2);

  page1.on('request', request => {
		if(request.url().startsWith('http://localhost:3002/game/texts/')){
			isSendTextRequest = true
		}
	});

  await createRoomWithTwoUsers({page1, page2});

  await Promise.all([pressReadyButton(page1), pressReadyButton(page2)]);
  const timeout = SECONDS_TIMER_BEFORE_START_GAME * 1000 + 2000;
  await sleep(timeout);
  await expect(isSendTextRequest, 'Has to send http request to get text').toBe(true);
});
