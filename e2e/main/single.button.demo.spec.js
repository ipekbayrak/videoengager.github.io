'use strict';

const { browser } = require("protractor");

describe('single page demo', function() {

  beforeEach(function() {
    browser.ignoreSynchronization = true;
    browser.waitForAngularEnabled(false);
  });
  

  var isPrecall = function() {
      return browser.driver
        .findElement(By.id("videoPreview"))
        .then(function(element){
          return true;
        }, function(err) {
          //console.log(err)
          return false;
      }); 
  };

  var joinCall = function() {
    return browser.driver
      .findElement(By.id("joinConferenceButton"))
      .then(function(joinConferenceButton){
        joinConferenceButton.click();
        return true;
      }, function(err) {
        //console.log(err)
        return false;
    }); 
};

var callEstablished = function(browser) {
  return browser.driver
    .findElement(By.id("remoteVideo"))
    .then(function(remoteVideo){
      return true;
    }, function(err) {
      //console.log(err)
      return false;
  }); 
};

 

  //single page demo
  it('should open precall in single button demo page', async function() {
    var url = 'http://localhost:3000/single-button-genesys-demo.html';
    await browser.get(url)
    var startButton = await element(by.xpath('//*[@id="textoProntoseraAtendido"]'));
    startButton.click();
    var iframeElement = await browser.driver.findElement(By.id('videoengageriframe'))
    var iframeUrl = await iframeElement.getAttribute('src')
    var sessionId = JSON.parse(Buffer.from(iframeUrl.split("&")[1].toString().substring(7), 'base64').toString() )["sessionId"];
    browser.driver.wait(browser.switchTo().frame(iframeElement), 3000);  
    browser.driver.wait(isPrecall, 3000);  
    browser.driver.sleep(1000);
    browser.driver.wait(joinCall, 3000);  
    //start second browser
    var browser2 = browser.forkNewDriverInstance();
    browser2.waitForAngularEnabled(false);
    var url2 = "https://videome.leadsecure.com/static/agent.popup.cloud.html?params=eyJsb2NhbGUiOiJlbl9VUyJ9&interaction=1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Zjk2YTc5ZTJmYjk4YzUzNzA0YTg2NGIiLCJwYWsiOiI5YmU3OGJjNS1hNzIxLTlhOWItODFhNS04Nzg1OGRkZDBiYjQiLCJpYXQiOjE2MjgwODk2NTQsImV4cCI6MTYzMDY4MTY1NH0.yTX6o7Iu2AX-u0z8ztb8xJy87psKme3Dcd1Bo4s4D7g&sk=true&conferenceId=NreayRaSS0rF&isPopup=false&invitationId=" + sessionId
    await browser2.get(url2);
    await browser2.driver.wait(callEstablished(browser2), 5000);
    await browser2.wait(async function() {
      return await browser2.driver.executeScript("return (window.document.querySelector('#remoteVideo') && (window.document.querySelector('#remoteVideo').webkitDecodedFrameCount > 0))")
      .then(async function(result) {
        if (result){
          // frame > 0 case
          console.log("result" + result);
          //console.log("result" + await browser2.driver.executeScript("return window.document.querySelector('#remoteVideo').webkitDecodedFrameCount"));
          return true;
        } 
        // null or frame < 0 case
        console.log("false" + false);
        return false;
      } , function(err) {
        //error case
        //console.log("err" + err);
        return false;
      }); 
    }, 30000);
  });

});
