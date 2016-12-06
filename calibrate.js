// Calibrates the channel and prints the result, so it can be reused. 

var browser = 'firefox';
var profiler_host = 'http://localhost:1987';
var pickChannel = null;


//console.log("Running Test: " + filename);

var webdriver = require('selenium-webdriver');
var firefox = require('selenium-webdriver/firefox');
var chrome = require('selenium-webdriver/chrome');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

// Take arguments if any

if(process.argv.length > 2)
		browser = process.argv[2];
if(process.argv.length > 3)
		pickChannel = process.argv[3];


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
						accept(1);
					else
						setTimeout(helper, 1000);
				});

			}
			helper();

		});
	}
};

var buildBrowser = function (browser)
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
		return new webdriver.Builder()
			.forBrowser("chrome")
			.setChromeOptions(new chrome.Options().setChromeBinaryPath('/opt/google/chrome/google-chrome'))
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

// Setup
driverMain.get(profiler_host);

if(!(pickChannel===null))
{
	var channel_pick = By.id("li" + pickChannel);
	driverMain.wait(until.elementLocated(channel_pick));
	driverMain.findElement(channel_pick).click();
}

var output_field = By.id('output');
driverMain.wait(until.elementLocated(output_field));
var init_button = By.id('init');
driverMain.wait(until.elementLocated(init_button));
var calibrate_button = By.id('calibrate');
driverMain.wait(until.elementLocated(calibrate_button));

var init = driverMain.findElement(init_button);
var calibrate = driverMain.findElement(calibrate_button);
var output = driverMain.findElement(output_field)

var difficulty_field = By.id('difficulty_field');
driverMain.wait(until.elementLocated(difficulty_field));

init.click();
// Check initialization completes
driverMain.wait(waitForText(output, "Channel initialized!"), 10000);

// Calibrate channel
calibrate.click();

// Check calibration completes
driverMain.wait(waitForText(output, "Channel calibrated!"), 60000);

driverMain.findElement(difficulty_field).getAttribute("value")
	.then(function(val){ console.log(val); });

driverMain.quit();
