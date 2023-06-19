// @ts-check
const { expect } = require('@playwright/test');
import { SECONDS_TIMER_BEFORE_START_GAME } from '../mocks/config';

const homeworkPath = '../homework/build/server';

export const getAppAndServer = () => {
	Object.keys(require.cache).forEach(key => delete require.cache[key]);

	const server = require(homeworkPath);

	return {
		app: server.default?.app || server.app,
		httpServer: server.default?.httpServer || server.httpServer,
	};
};

export const sleep = milliseconds => {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export const login = async (page, name) => {
  await page.type('input[id=username-input]', name);
  await page.click('#submit-button');
	return page;
};

export const createRoom = async (page, roomName) => {
    await page.click('#add-room-btn');
    await page.type('.modal input[class=modal-input]', roomName);
    await page.click('.modal .submit-btn');
};

export const joinRoom = async page => {
  await page.click('.room .join-btn');
};

export const checkIsInRoom = async page => {
  const roomPage = await page.locator("#game-page");
  await expect(roomPage, 'User has not entered the room').toBeVisible();
};

export const quitRoom = async page => {
  await page.click('#quit-room-btn');
};

export const checkNoRoomShown = async page => {
  const locator = await page.locator(".room .join-btn");
  await expect(locator).not.toBeVisible();
};

export const pressReadyButton = async page => {
  await page.click('#ready-btn');
};

export const getRoomName = async page => {
  const locator = await page.locator('#room-name');
  await expect(locator).toBeVisible();
  return locator.innerText()
}

export const checkIsInRoomSelector = async page => {
  const locator = await page.locator('#add-room-btn');
  await expect(locator, 'Is not on the page with rooms selection').toBeVisible();
};

export const createRoomWithTwoUsers = async ({
	page1,
	page2,
	roomName = 'room1',
}) => {

	await createRoom(page1, roomName);
	await joinRoom(page2);

	await Promise.all([checkIsInRoom(page1), checkIsInRoom(page2)]);
};

export const checkTimerAppeared = async page => {
  const locator = await page.locator('#timer');
  await expect(locator, 'Timer should be visible').toBeVisible();
};

export const checkTextDoesNotExists = async page => {
  const locator = await page.locator('#text-container');
  await expect(locator, 'Text should not be shown').not.toBeVisible();
};

export const checkReadyButtonDoesNotExists = async page => {
  const locator = await page.locator('#ready-btn');
  await expect(locator, 'Ready button should not be shown').not.toBeVisible();
};

export const checkTextToAppear = async page => {
	const locator = await page.locator('#text-container');
  await expect(locator, 'Text should not be displayed until the timeout is over').not.toBeVisible();
  const timeout = SECONDS_TIMER_BEFORE_START_GAME * 1000 + 2000;
  await expect(locator, 'Text should be visible').toBeVisible({timeout, visible: true});
};

export const checkTimerDoesNotExists = async page => {
  const locator = await page.locator('#timer');
  await expect(locator, 'Timer should not be shown').not.toBeVisible();
};

export const checkQuitRoomDoesNotExists = async page => {
  const locator = await page.locator('#quit-room-btn');
  await expect(locator, 'Quit room should not be shown').not.toBeVisible();
};

export const getTextToEnter = async page => {
  const text  = await page.locator('#text-container').evaluate(node => node.innerText.replace(/\n/g, ''));
	return text;
};

export const checkProgress = async (page, username, progress) => {
	const userProgress = await page.locator(`.user-progress[data-username='${username}']`).evaluate(node => node.style.width);
	await expect(userProgress, `Progress should be ${progress}%`).toBe(`${progress}%`);
};

export const enterText = async (page, textNumber) => {
	await page.keyboard.down('Shift');
	await page.keyboard.press(`KeyT`);
	await page.keyboard.up('Shift');
	await page.keyboard.press(`KeyE`);
	await page.keyboard.press(`KeyX`);
	await page.keyboard.press(`KeyT`);
	await page.keyboard.press(`-`);
	await page.keyboard.press(`#`);
	await page.keyboard.press(` `);
	await page.keyboard.press(`=`);
	await page.keyboard.press(`=`);
	await page.keyboard.press(`=`);
	await page.keyboard.press(` `);
	await page.keyboard.press(textNumber);
};

export const checkFinished = async (page, username) => {
	await checkProgress(page, username, 100);
  const locator = await page.locator(`.user-progress.finished[data-username='${username}']`);
	await expect(locator).toBeVisible();
};

export const checkUserPlace = async (page, username, place) => {
	const resultElementSelector = `.user-result[data-username='${username}']`;
	const locator = await page.locator(resultElementSelector);
	const userPlace = await locator.evaluate(node => node.dataset.place);

	await expect(Number(userPlace), `Should show valid place of user`).toBe(place);
};

export const closeResultsModal = async page => {
	await page.click('#quit-results-btn');
};

export const checkReadyButtonToAppear = async page => {
  const locator = await page.locator('#ready-btn');
  await expect(locator, 'Ready button should not be shown').toBeVisible();
};

export const checkQuitRoomToAppear = async page => {
  const locator = await page.locator('#quit-room-btn');
  await expect(locator, 'Quit room button should be shown').toBeVisible();
};

export const checkNoReadyUser = async page => {
  const locator = await page.locator('.ready-status-green');
  await expect(locator, 'Should reset ready status').toHaveCount(0);
};
