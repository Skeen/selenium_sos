var browser = 'firefox';
var profiler_host = 'http://localhost:1987';
var profiler_target = 'http://www.google.dk';
var pickChannel = null;
var difficulty = null;
var ambient = false;
var metaDesc = null;
var random_wait = 0;
var private_browsing = false;

var reading_time = 14;
var ramp_time = 4;

var filename = "_google";
var timestamp = false;

// Max time to wait for page to load before quitting, in ms.
var loadTimeout = 600000; // Current value means 10 minutes

//console.log("Running Test: " + filename);

var webdriver = require('selenium-webdriver');
var firefox = require('selenium-webdriver/firefox');
var chrome = require('selenium-webdriver/chrome');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

// Take arguments if any

if(process.argv.length > 10 && process.argv[10] > 0)
	private_browsing = true;
if(process.argv.length > 9)
{
	var wait_max = process.argv[9];
	random_wait = getRandomInt(1, wait_max);
}
if(process.argv.length > 8)
	metaDesc = process.argv[8];
if(process.argv.length > 7 && (process.argv[7] > 0))
	ambient = true;
if(process.argv.length > 6)
	difficulty = process.argv[6];
if(process.argv.length > 5)
	pickChannel = process.argv[5];
if(process.argv.length > 4)
{
		browser = process.argv[2];
		profiler_target = process.argv[3];
		filename = process.argv[4];

	console.log("Using to: '" + browser + "' '" + profiler_target + "' '" + filename + "'");
}
else
{
	console.log("Defaulting to: '" + browser + "' '" + profiler_target + "' '" + filename + "'");
}

function getRandomInt(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

// Return a promise that accepts once element contains text
var waitForText = function(wele, text)
{
	return function()
	{
		var end = Date.now() + 20000;
		return new Promise(function(accept, reject)
		{
		var helper = function()
			{
				wele.getText().then( function(value) 
				{
					if(value.includes(text))
					{
						//console.log("found", text);
						accept(1);
					}
					else if(Date.now() > end)
					{
						exitWithError(driverTarget, profiler_target);
					}
					else
						//setTimeout(reject.bind(this,0), 1000);
						setTimeout(helper, 1000);
				});

			}
			helper();

		});
	}
};

var timeoutFunction = function(timer)
{
	return function()
	{
		return new Promise( function(accept, reject)
			{
				setTimeout(accept.bind(this,1), timer);	
			});
	};
};

var open = function(driver, site)
{
	driver.get(site).catch(exitWithError.bind(this,site));
};

var exitWithError = function(site, exception)
{
	driverMain.quit().then(
		function()
		{
			driverTarget.quit().then(
				function()
				{
					console.log("Site failed to load:", site);
					console.log("Error was:");
					console.log(exception.message);
					process.exit(1);
				})
		})
};

var buildBrowser = function(browser)
{
	if(browser == "firefox-bin")
	{
		return new webdriver.Builder()
			.forBrowser("firefox")
			.setFirefoxOptions(new firefox.Options().setBinary('firefox-bin'))
			.build();
	}
	else if(browser == "chrome-bin")
	{
		var chrOptions = new chrome.Options().setChromeBinaryPath('/opt/google/chrome/google-chrome');
		if(private_browsing)
			chrOptions.addArguments('incognito');
		
		return new webdriver.Builder()
			.forBrowser("chrome")
			.setChromeOptions(chrOptions)
			.build();
	}
	else
	{
		return new webdriver.Builder()
			.forBrowser(browser)
			.build();
	}
}

var driverMain = buildBrowser(browser);
var driverTarget = buildBrowser(browser);

// Time to wait for pages to load in ms, before throwing err.
//  err is caught when using open, and the process exits with 1.
driverMain.manage().timeouts().pageLoadTimeout(loadTimeout);
driverTarget.manage().timeouts().pageLoadTimeout(loadTimeout);

// Setup
open(driverMain, profiler_host);
if(ambient)
{
	driverTarget.manage().timeouts().pageLoadTimeout(loadTimeout);
	open(driverTarget, profiler_target);
}
// Was commented due to firefox no longer actually having an about:blank page.
// Browsers still use blank page when first opened by driver. FIX IF THEY DONT
/*
else
	//driverTarget.get("about:blank");
	//open(driverTarget, "about:newtab");
*/
// Setup prefix field
var prefix_field = By.id('prefix');
driverMain.wait(until.elementLocated(prefix_field));
driverMain.findElement(prefix_field).sendKeys(filename);

if(!(pickChannel === null))
{
	var channel_pick = By.id("li" + pickChannel);
	driverMain.wait(until.elementLocated(channel_pick));
	driverMain.findElement(channel_pick).click();
}

// If a difficulty was provided,
//  us that instead of making a new one.
if(!(difficulty === null))
{
	var difficulty_field = By.id('difficulty_field');
	driverMain.wait(until.elementLocated(difficulty_field));
	var difficulty_input = driverMain.findElement(difficulty_field);
	difficulty_input.sendKeys(Key.CONTROL, "a");
	difficulty_input.sendKeys(difficulty);
}

// If timestamp is not wanted,
//  unclicks the timestamp box.
if(!timestamp)
{
	var postfix_box = By.id('postfix');
	driverMain.wait(until.elementLocated(postfix_box));
	driverMain.findElement(postfix_box).click();
}

// Setup timeout field
var timeout_field = By.id('timeout');
driverMain.wait(until.elementLocated(timeout_field));
var timeout_input = driverMain.findElement(timeout_field);
timeout_input.sendKeys(Key.CONTROL, "a");
timeout_input.sendKeys(reading_time);

// Input metadata desc, if provided
if(metaDesc)
{
	var meta_field = By.id('meta');
	driverMain.wait(until.elementLocated(meta_field));
	var meta_input = driverMain.findElement(meta_field);
	meta_input.sendKeys(metaDesc);
}
// Find page elements
var output_field = By.id('output');
driverMain.wait(until.elementLocated(output_field));
var init_button = By.id('init');
driverMain.wait(until.elementLocated(init_button));
var calibrate_button = By.id('calibrate');
driverMain.wait(until.elementLocated(calibrate_button));
var read_button = By.id('reading');
driverMain.wait(until.elementLocated(read_button));
var send_button = By.id('send');
driverMain.wait(until.elementLocated(send_button));

// Load the page elements for interaction by the webdriver
var init = driverMain.findElement(init_button);
var calibrate = driverMain.findElement(calibrate_button);
var read = driverMain.findElement(read_button);
var send = driverMain.findElement(send_button);
var output = driverMain.findElement(output_field)
var body = driverMain.findElement(By.css("body"));

// Commence the test!

init.click();
// Check initialization completes
driverMain.wait(waitForText(output, "Channel initialized!"), 10000);

// Calibrate channel,
//  if a calibration was provided,
//  this will load it rather than making a new one.
calibrate.click();

// Check calibration completes
driverMain.wait(waitForText(output, "Channel calibrated!"), 60000);

if(random_wait)
	driverMain.wait(timeoutFunction(random_wait * 1000));

// Start reading
read.click();

// If not an ambient noise test,
//  this will load the page after waiting for ramp up.
if(!ambient)
{
	driverMain.wait(timeoutFunction(ramp_time * 1000));
	// Open profiling target
	// If the reading is supposed to be ambient,
	//  the page will already be open at this point.
	if(profiler_target != "about:blank")
		open(driverTarget, profiler_target);
}

// Check that reading completes
driverMain.wait(timeoutFunction(reading_time *1000));
driverMain.wait(waitForText(output, "Done readings."), 10000);


// Send results
send.click();
driverMain.wait(waitForText(output, "Done sending."), 10000);
// Exit orderly with 0
driverMain.quit().then(
	function()
	{
		driverTarget.quit().then(
			function()
			{
				process.exit(0);
			})
	});
