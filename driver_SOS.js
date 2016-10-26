var browser = 'firefox';
var profiler_host = 'http://localhost:1987';

var reading_time = 100;

var tabbed = false;
var send_SOS = true;
var send_SOS_Timeout = Math.floor((Math.random() * 50) + 1) * 1000;

var filename = "sos_4_100s_displacement_test_firefox_" + send_SOS_Timeout + "_seconds";

console.log("Running Test: " + filename);

var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

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

var changeTab = function()
{
	if(tabbed)
	{
		body.sendKeys(Key.CONTROL +"\t");
		driver.switchTo().defaultContent();
	}
}

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

driver.get(profiler_host);
//driver.get('http://google.dk');
/*
driver.executeScript("window.open();");
driver.getAllWindowHandles().then(function(value) { console.log(value); driver.switchTo().window(value[1]) });
*/
if(tabbed)
{
	driver.findElement(By.css("body")).sendKeys(Key.CONTROL +"t");
	driver.switchTo().defaultContent();
	driver.get(profiler_host);
}
//driver.get('http://google.dk');


//setInterval(function() {}, 1000);

driver.findElement(By.css("body")).sendKeys(Key.CONTROL +"\t");
driver.switchTo().defaultContent();

// Setup prefix field
var prefix_field = By.id('prefix');
driver.wait(until.elementLocated(prefix_field));
driver.findElement(prefix_field).sendKeys(filename);
// Setup timeout field
var timeout_field = By.id('timeout');
driver.wait(until.elementLocated(timeout_field));
driver.findElement(timeout_field).sendKeys(
        Key.chord(Key.CONTROL, "a"),
        reading_time);
// TODO: Pick channel
// ...

// Find page elements
var output_field = By.id('output');
driver.wait(until.elementLocated(output_field));
var init_button = By.id('init');
driver.wait(until.elementLocated(init_button));
var calibrate_button = By.id('calibrate');
driver.wait(until.elementLocated(calibrate_button));
var read_button = By.id('reading');
driver.wait(until.elementLocated(read_button));
var send_button = By.id('send');
driver.wait(until.elementLocated(send_button));

var init = driver.findElement(init_button);
var calibrate = driver.findElement(calibrate_button);
var read = driver.findElement(read_button);
var send = driver.findElement(send_button);
var output = driver.findElement(output_field)
var body = driver.findElement(By.css("body"));

// Switch to SOS Tab

// Initialize channel
init.click();

// Check initialization completes
//driver.wait(until.elementTextContains(output, "Channel initialized!"), 10000);
driver.wait(waitForText(output, "Channel initialized!"), 10000);

// Calibrate channel
calibrate.click();

// Check calibration completes
//driver.wait(until.elementTextContains(output, "Channel calibrated!"), 60000);
driver.wait(waitForText(output, "Channel calibrated!"), 60000);

// Start reading
read.click();

if(send_SOS)
{
changeTab();

var sos_button = By.id('sos');
driver.wait(until.elementLocated(sos_button));

var sos = driver.findElement(sos_button);

// Start reading

	driver.wait(timeoutFunction(send_SOS_Timeout));
	sos.click();

// Switch to Reading Tab

changeTab();
}

// Check that reading completes
driver.wait(timeoutFunction(reading_time *1000));
driver.wait(until.elementTextContains(output, "Done readings."), 1000);

// Start sending results

send.click();
// Check that results were send
driver.wait(until.elementTextContains(output, "Done sending"), 10000);

// Shutdown the webdriver
driver.quit();

