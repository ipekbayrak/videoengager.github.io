'use strict';

describe('Main View', function() {
  var page;
  var EC = protractor.ExpectedConditions;
 
beforeEach(function() {
    browser.ignoreSynchronization = true;
});
  

var isPrecall = function() {
    return browser.driver
      .findElement(By.id("videoPreview"))
      .then(function(element){
        return true;
      }, function(err) {
        console.log('Check display error: ', err.message, err.code);
        return false;
    });
};

it('should open precall in single button demo page', function() {
    browser.get('http://localhost:3000/single-button-genesys-demo.html');
    var startButton = element(by.xpath('//*[@id="textoProntoseraAtendido"]'));
    startButton.click();
    browser.switchTo().frame('videoengageriframe');
    browser.driver.wait(isPrecall, 10000); 
    
});


});
