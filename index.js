var browser = 'firefox';
var profiler_host = 'http://localhost:1987';
var profiler_target = 'http://www.google.dk';

var reading_time = 10;
var ramp_time = 3;

var filename = "_google";

//console.log("Running Test: " + filename);

var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

// Take arguments if any

if(process.argv.length === 5)
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

var driverMain = new webdriver.Builder()
    .forBrowser(browser)
    .build();

var driverTarget = new webdriver.Builder()
	.forBrowser(browser)
	.build();

// Setup
driverMain.get(profiler_host);
driverTarget.get("about:blank");

// Setup prefix field
var prefix_field = By.id('prefix');
driverMain.wait(until.elementLocated(prefix_field));
driverMain.findElement(prefix_field).sendKeys(filename);
// Setup timeout field
var timeout_field = By.id('timeout');
driverMain.wait(until.elementLocated(timeout_field));
var timeout_input = driverMain.findElement(timeout_field);
timeout_input.sendKeys(Key.CONTROL, "a");
timeout_input.sendKeys(reading_time);
//driverMain.findElement(timeout_field).sendKeys(
//        Key.chord(Key.CONTROL, "a"),
//        reading_time);

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

var init = driverMain.findElement(init_button);
var calibrate = driverMain.findElement(calibrate_button);
var read = driverMain.findElement(read_button);
var send = driverMain.findElement(send_button);
var output = driverMain.findElement(output_field)
var body = driverMain.findElement(By.css("body"));


init.click();
// Check initialization completes
driverMain.wait(waitForText(output, "Channel initialized!"), 10000);

// Calibrate channel
calibrate.click();

// Check calibration completes
driverMain.wait(waitForText(output, "Channel calibrated!"), 60000);

// Start reading
read.click();

driverMain.wait(timeoutFunction(ramp_time * 1000));

// Open profiling target

driverTarget.get(profiler_target);

// Check that reading completes
driverMain.wait(timeoutFunction(reading_time *1000));
driverMain.wait(waitForText(output, "Done readings."), 10000);


// Send results
send.click();
driverMain.wait(waitForText(output, "Done sending"), 10000);
driverMain.quit();
driverTarget.quit();
