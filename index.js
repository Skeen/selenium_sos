var browser = 'firefox';
var profiler_host = 'http://localhost:1987';
var profiler_target = 'http://www.google.dk';
var pickChannel = null;
var difficulty = null;
var ambient = false;

var reading_time = 10;
var ramp_time = 1;

var filename = "_google";
var timestamp = false;

// Max time to wait for page to load before quitting, in ms.
var loadTimeout = 10000;

//console.log("Running Test: " + filename);

var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

// Take arguments if any

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


// Return a promise that accepts once element contains text
var waitForText = function(wele, text)
{
	return function()
	{

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
					else
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
					console.log(exception);
					process.exit(1);
				})
		})
};

var driverMain = new webdriver.Builder()
    .forBrowser(browser)
    .build();

var driverTarget = new webdriver.Builder()
	.forBrowser(browser)
	.build();

// Time to wait for pages to load in ms, before throwing err.
//  err is caught when using open, and the process exits with 1.
driverMain.manage().timeouts().pageLoadTimeout(loadTimeout);
driverTarget.manage().timeouts().pageLoadTimeout(loadTimeout);

// Setup
open(driverMain, profiler_host);
if(ambient)
	open(driverTarget, profiler_target);
else
	open(driverTarget, "about:blank");

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
