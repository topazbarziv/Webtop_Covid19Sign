//
//  index.js
//  index
//
//  Created by Topaz Barziv on 2020-09-11.
//  Copyright © 2020 Topaz Barziv. All rights reserved.
//

const TelegramBot = require('node-telegram-bot-api')
const { Spinner } = require('cli-spinner')
const puppeteer = require('puppeteer-core')
const moment = require('moment-timezone')
const path = require('path')

const config = require('./config')
var bot = null

async function main() {
	bot = new TelegramBot(config.telegram.apiKey, {polling: true})

	if(config.messages.autoRemind) {
		setInterval(() => {
			if(moment.tz(config.timezone).format("HH:mm") == config.messages.autoRemindTime) {
				bot.sendMessage(config.messages.chatId, "It's time to sign for Covid-19 digital health statement!\n\nPress on /sign to do that.")
			}
		}, 60000)
	}

	bot.onText(/\/sign/, async(msg, match) => {
		if(!config.messages || msg.chat.id == config.messages.chatId){
			try {
				let result = await sign()

				if(result) {
					bot.sendPhoto(msg.chat.id, path.join(process.cwd(), "screenshot.png"))
				}
			} catch(e) {
				bot.sendMessage(msg.chat.id, "Because an error, the signing operation was did not succeed. Check the console.")
			}
		} else {
			bot.sendMessage(msg.chat.id, `You have to set this ${msg.chat.id} chat id to src/config.js. \nDon't forget to reload the app after you changed the configuration file.`)
		}
	})

	bot.onText(/\/chatid/, async(msg, match) => {
		bot.sendMessage(msg.chat.id, `Chat id: ${msg.chat.id}.`)
	})

	bot.on('message', msg => {})
}

async function sign() {
	let spinner = new Spinner('Downloading Chromium.. %s')
	spinner.setSpinnerString('|/-\\')
	spinner.start()

	const browserFetcher = puppeteer.createBrowserFetcher({
		path: process.cwd()
	})
	const revisionInfo = await browserFetcher.download(666595, (download, total) => {
		let percentage = (download * 100) / total
		spinner.setSpinnerTitle(`Downloading Chromium.. ${Math.round(percentage)}%`)
	})

	spinner.setSpinnerTitle("Launching Chromium.. %s")
	const browser = await puppeteer.launch({
		executablePath: revisionInfo.executablePath,
		headless: true,
		userDataDir: '/dev/null'
	})
	spinner.setSpinnerTitle("Launching Chromium ... done! %s")
	let pages = await browser.pages()
	if (pages.length > 0) {
		let page = pages[0]
		page.setBypassCSP(true)
		page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36")
		await page.goto('https://www.webtop.co.il')

		spinner.setSpinnerTitle("Opening Webtop ... done! %s")
		spinner.stop()
		page.exposeFunction("log", (message) => {
			console.log(message)
		})

		// Wait until page is loading
		await page.waitForSelector("#identityNumber", { timeout: 5000 })

		// Enter smartschool - username
		await page.focus('#identityNumber')
		await page.keyboard.type(config.smartschool.username)

		// Enter smartschool - password
		await page.focus('#password')
		await page.keyboard.type(config.smartschool.password)

		// Press submit
		await page.focus("#loginLogoutButton")
		await page.keyboard.press('Enter')

		// Wait until user connected
		try {
			await page.waitForSelector("#loginDetails", { timeout: 5000 })
		} catch(e) {
			console.error("Looks like your username or password to smartschool is wrong. Please check the configuration file.")
			if(bot != null)
				bot.sendMessage(config.messages.chatId, "Looks like your username or password to smartschool is wrong. Please check the configuration file.")

			// Close browser
			await browser.close()
			return false
		}

		// Go to corona sign page
		await page.goto('https://www.webtop.co.il/corona.aspx')

		// Make sure you start listening to the dialog event before clicking the link. Something like this:
		page.on('dialog', async dialog => {
			await dialog.accept();
		})

		// Check if you can sign right now
		try {
			await page.waitForSelector("#saveButton", { timeout: 5000 })
		} catch(e) {
			console.error("Looks like you can 't sign a Covid-19 digital health statement right now.")
			if(bot != null)
				bot.sendMessage(config.messages.chatId, "Looks like you can 't sign a Covid-19 digital health statement right now.")

			// Close browser
			await browser.close()
			return false
		}
		await page.focus("#saveButton")
		await page.keyboard.press('Enter')

		// Give a time to load the qr code
		await sleep(500)

		// Take a screenshot of the page
		await page.screenshot({ path: path.join(process.cwd(), "screenshot.png") })

		// Close browser
		await browser.close()

		return true
	}
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
} 


(async () => {
	if(config.cronMode || !config.telegram){
		await sign()
	} else {
		await main()
	}
})()