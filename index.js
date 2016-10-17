var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

driver.get('http://localhost:8081');
//driver.get('http://google.dk');
/*
driver.executeScript("window.open();");
driver.getAllWindowHandles().then(function(value) { console.log(value); driver.switchTo().window(value[1]) });
*/
driver.findElement(By.css("body")).sendKeys(Key.CONTROL +"t");
driver.switchTo().defaultContent();
driver.get('http://localhost:8081');
//driver.get('http://google.dk');


//setInterval(function() {}, 1000);

driver.findElement(By.css("body")).sendKeys(Key.CONTROL +"\t");
driver.switchTo().defaultContent();

// Setup prefix field
var prefix_field = By.id('prefix');
driver.wait(until.elementLocated(prefix_field));
driver.findElement(prefix_field).sendKeys("noise_test_firefox");
// Setup timeout field
var timeout_field = By.id('timeout');
driver.wait(until.elementLocated(timeout_field));
driver.findElement(timeout_field).sendKeys(
        Key.chord(Key.CONTROL, "a"),
        "50");
// TODO: Pick channel
// ...

// Find output field
var output_field = By.id('output');
driver.wait(until.elementLocated(output_field));

// Initialize channel
var init_button = By.id('init');
driver.wait(until.elementLocated(init_button));
driver.findElement(init_button).click();
// Check initialization completes
driver.wait(until.elementTextContains(driver.findElement(output_field), "Channel initialized!"), 10000);

// Calibrate channel
var calibrate_button = By.id('calibrate');
driver.wait(until.elementLocated(calibrate_button));
driver.findElement(calibrate_button).click();
// Check calibration completes
driver.wait(until.elementTextContains(driver.findElement(output_field), "Channel calibrated!"), 60000);

// Start reading
var read_button = By.id('reading');
driver.wait(until.elementLocated(read_button));
driver.findElement(read_button).click();

driver.findElement(By.css("body")).sendKeys(Key.CONTROL +"\t");
driver.switchTo().defaultContent();

// Start reading
var sos_button = By.id('sos');
//driver.wait(until.elementLocated(sos_button));
//driver.findElement(sos_button).click();

driver.findElement(By.css("body")).sendKeys(Key.CONTROL +"\t");
driver.switchTo().defaultContent();

// Check that reading completes
driver.wait(until.elementTextContains(driver.findElement(output_field), "Done readings."), 100 * 1000);

// Start sending results
var send_button = By.id('send');
driver.wait(until.elementLocated(send_button));
driver.findElement(send_button).click();
// Check that results were send
driver.wait(until.elementTextContains(driver.findElement(output_field), "Done sending"), 10000);

// Shutdown the webdriver
driver.quit();

