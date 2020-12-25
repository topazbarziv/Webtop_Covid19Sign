# Automatically signing Covid-19 digital health statement

## Supports
- [Webtop.co.il](https://www.webtop.co.il) - SmartSchool for students and parents

## Installation 
```
git clone https://github.com/topazbarziv/Webtop_Covid19Sign
cd Webtop_Covid19Sign
npm install
cp src/config.sample.js src/config.js
```
Edit src/config.js file and fill all fields.
For testing run:
```
npm start
```

### Using reminder and quickly signing
In the configuration file (src/config.js), set cronMode = false.

Type the following command in the command line:
```
crontab -e
```
To run the code in background on system startup, add these following line:
```
@reboot /usr/local/bin/node /CLONE_LOCATION/Webtop_Covid19Sign/src/index.js
```

### Using cron
In the configuration file (src/config.js), set cronMode = true.

Type the following command in the command line:
```
crontab -e
```
To run every day at 07:00 oclock, add these following line:
```
0 7 * * * /usr/local/bin/node /CLONE_LOCATION/Webtop_Covid19Sign/src/index.js
```

## Features
- Signing Covid-19 digital health statement by reminder to sign by telegram and by and a command as a reply you got an screenshot as a proof of success.
- Using [cron](https://en.wikipedia.org/wiki/Cron) to daily signing Covid-19 digital health statement without reply an command.

## Technologies
- [Node](https://nodejs.org)
- [puppeteer-core](https://github.com/puppeteer/puppeteer)
- [node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api)

## Contact Me
- [Telegram](https://t.me/topTopaz)
- [Email](<mailto:mail@topazbarziv.com?subject=Webtop_Covid19Sign>)

## Legal
This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by [SmartSchool.co.il](https://www.smartschool.co.il), [Webtop.co.il](https://www.webtop.co.il) or any of its affiliates or subsidiaries. This is an independent and unofficial software. Use at your own risk.
