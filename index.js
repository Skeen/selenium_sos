var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;
var Key = webdriver.Key;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

driver.get('localhost:8081');

// Setup prefix field
var prefix_field = By.id('prefix');
driver.wait(until.elementLocated(prefix_field));
driver.findElement(prefix_field).sendKeys("selenium");
// Setup timeout field
var timeout_field = By.id('timeout');
driver.wait(until.elementLocated(timeout_field));
driver.findElement(timeout_field).sendKeys(
        Key.chord(Key.CONTROL, "a"),
        "5");
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
driver.wait(until.elementTextContains(driver.findElement(output_field), "Channel calibrated!"), 10000);

// Start reading
var read_button = By.id('reading');
driver.wait(until.elementLocated(read_button));
driver.findElement(read_button).click();
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
