var browser = 'firefox';
var profiler_target = 'http://www.google.dk';

var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

// Take arguments if any

if(process.argv.length > 3)
{
		browser = process.argv[2];
		profiler_target = process.argv[3];
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

var driverMain = new webdriver.Builder()
    .forBrowser(browser)
    .build();

driverMain.manage().timeouts().implicitlyWait(2000);
driverMain.manage().timeouts().pageLoadTimeout(2000);

driverMain.get(profiler_target).catch(
	function(err)
	{
		driverMain.quit().then(
			function()
			{
				process.exit(1);
			})
	});

driverMain.quit().then(function(){process.exit(0)});
