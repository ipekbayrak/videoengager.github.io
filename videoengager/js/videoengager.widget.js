var popupinstance;
var iframeInstance;
var startVideoEngager = function(url) {
	var left = (screen.width/2)-(770/2);
	var top = (screen.height/2)-(450/2);
	if (!popupinstance) {
		popupinstance = window.open(url, "popup_instance", "width=770, height=450, left=" + left + ", top=" + top + ", location=no, menubar=no, resizable=yes, scrollbars=no, status=no, titlebar=no, toolbar = no");
	}
	popupinstance.focus();
};
var oVideoEngager;
var finalUserData = {};
var VideoEngager = function () {
	this.init = function (callHolder, platform, tenantId, veUrl, formData, userData, audioOnly, autoAccept, hideChat) {
		var TENANT_ID = tenantId;
		var startWithVideo = (audioOnly) ? !audioOnly : true;
		autoAccept = (autoAccept) ? autoAccept : true;
		hideChat = (hideChat) ? hideChat : true;
		var iframeHolder = null;
		if (callHolder) {
			iframeHolder = document.getElementById(callHolder);
			if (!iframeInstance) {
				console.log("iframe holder is passing, but not found: " + callHolder);
			}
		}
		var firstName = (formData.firstName) ? formData.firstName : '';
		var lastName = (formData.lastName) ? formData.lastName : '';
		var autoSubmit = (formData.autoSubmit) ? formData.autoSubmit : false;
		var email = (formData.email) ? formData.email : '';
		var message = (formData.message) ? formData.message : '';
		var custom = (formData.custom) ? formData.custom : '';
		var subject = (formData.subject) ? formData.subject : '';
		var form = formData; 
		var interactionId;

		var closeIframeOrPopup = function(){
			if (!iframeHolder) {
				if (popupinstance) {
					popupinstance.close();
				}
				popupinstance = null;
			} else {
				iframeHolder.removeChild(iframeHolder.getElementsByTagName('iframe')[0]);
				iframeHolder.style.display = 'none';
			}
		}

		var terminateCall = function(){
			//close toaster and terminate the call
			oVideoEngager.command('WebChat.endChat')
			.done(function(e){
				oVideoEngager.command('WebChat.close');
			})
			.fail(function(e){
				//
			});
		}

		var initiateToaster = function(){
			var fieldDefinition = {
				wrapper: "<table></table>",
					inputs: [
						{ name: "firstname", maxlength: "100", placeholder: "FirstName", label: "FirstName", autofocus: !0, "aria-required": !0 },
						{ name: "lastname", maxlength: "100", placeholder: "LastName", label: "LastName", "aria-required": !0 },
						{ type: "email", name: "email", maxlength: "100", placeholder: "Email", label: "Email", "aria-required": !0 },
						// to add custom fields to web chat
						{ value:"", name: "customField2", maxlength: "100", placeholder: "Cust", label: "Subject" },
						{ value:"Subject", name: "customField2Label", maxlength: "100", placeholder: "", label: !1, style:"display:none" },
						{ value:"", name: "customField1", maxlength: "100", placeholder: "Test 2", label: "BRAND NEW CUSTOM FIELD" },
						{ value:"BRAND NEW CUSTOM FIELD", name: "customField1Label", maxlength: !1, placeholder: !1, label: !1, style:"display:none"},
					]
			};

			oVideoEngager.command('WebChat.open', {
				userData: {},
				//prefill values
				form: {/*
					autoSubmit: false,
					firstname: 'John',
					lastname: 'Smith',
					email: 'John@mail.com',
					subject: 'Customer Satisfaction'
					*/
				},
				formJSON: fieldDefinition,
				markdown: false
			}).done(function (e2) {
				// form opened 
			});
		}

		var startVideoChat = function() {
		
			var getGuid = function () {
				function s4() {
					return Math.floor((1 + Math.random()) * 0x10000) .toString(16) .substring(1);
				}
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
			}

			if (interactionId == undefined) {
				interactionId = getGuid();
			}
			console.log("InteractionId :", interactionId);
			startWithVideo = startWithVideo.toString();
			var left = (screen.width / 2) - (770 / 2);
			var top = (screen.height / 2) - (450 / 2);
			var str = {
				"video_on": startWithVideo, 
				"sessionId": interactionId, 
				"hideChat": hideChat, 
				"type": "initial", 
				"defaultGroup": "floor", 
				"view_widget": "4", 
				"offline": true, 
				"aa": autoAccept, 
				skip_private: true,
				"inichat": "false"
			};
	
			var encodedString = window.btoa(JSON.stringify(str));
			var homeURL = veUrl + '/static/';
			var url = homeURL + 'popup.html?tennantId=' + window.btoa(TENANT_ID) + '&params=' + encodedString;
			
			if (!iframeHolder) {
				if (!popupinstance) {
					popupinstance = window.open(url, "popup_instance", "width=770, height=450, left=" + left + ", top=" + top + ", location=no, menubar=no, resizable=yes, scrollbars=no, status=no, titlebar=no, toolbar = no");
				}
				popupinstance.focus();
			} else {
				iframeInstance = document.createElement('iframe');
				iframeInstance.width = "100%"
				iframeInstance.height = "100%"
				iframeInstance.id = "videoengageriframe"
				iframeInstance.allow = "microphone; camera"
				iframeInstance.src = url;
				iframeHolder.insertBefore(iframeInstance, iframeHolder.firstChild);
				iframeHolder.style.display = 'block';
			}

			finalUserData = {}
			if (userData) {
				for (var key in userData) { 
					finalUserData[key] = userData[key]; 
				}
			}
			
			//to add custom fields to video chat
			finalUserData['firstName'] = firstName;
			finalUserData['lastName'] = lastName;
			finalUserData['email'] = email;
			finalUserData['veVisitorId'] = interactionId;
			finalUserData['customField1'] = custom;
			finalUserData['customField1Label'] = "CUSTOM HEADER";
			finalUserData['customField2'] = message;
			finalUserData['customField2Label'] = "Subject";

			if (platform == 'purecloud') {
				var message = '{"interactionId": "'+ interactionId+'", "displayName": "displayName","firstName": "First", "lastName": "Second"}';
				oVideoEngager.command('WebChatService.sendMessage',{message:message})
				.done(function (e) {
					console.log("send message success:" +message);
				})
				.fail(function(e) {
					console.log("fail to send message: "+message);
				});
			}
			
			window.removeEventListener('message', function (e) {});
			window.addEventListener('message', function (event) {
				if (event.data.type === 'popupClosed') {
					oVideoEngager.command('WebChatService.endChat')
					.done(function (e) {
						console.log('WebChatService.endChat');
					})
					.fail(function (e) {
						console.log('WebChatService.endChat failed');
					});
				}
			});
		};	 

		window._genesys.widgets.onReady = function(oCXBus){
			console.log('[CXW] Widget bus has been initialized!');
			oCXBus.command('WebChatService.registerPreProcessor', {preprocessor: function(oMessage){
				if (oMessage.text && oMessage.text.indexOf(veUrl) != -1) { 
					var url = oMessage.text;
					oMessage.html = true;
					oMessage.text = 'Please press button to start video:<br><br><button type="button" class="cx-btn cx-btn-primary i18n" onclick="startVideoEngager(\'' + url + '\');">Start video</button>';
					return oMessage;
				}
			}})
			.done(function(e){
				console.log('VE WebChatService.registerPreProcessor');
			})
			.fail(function(e){
				console.error('failed to regsiter preprocessor');
			});
		};

		window._genesys.cxwidget = window._genesys.widgets;
		if (!window._genesys.widgets.extensions) {
			window._genesys.widgets.extensions = {};
		}

		window._genesys.widgets.extensions["VideoEngager"] = function ($, CXBus, Common) {
			console.log("on init extension VideoEngager");

			oVideoEngager = CXBus.registerPlugin("VideoEngager");
			oVideoEngager.publish("ready"); 

			oVideoEngager.registerCommand("VideoEngagerStartVideo", function(e){
				console.log('VideoEngagerStartVideo registered' );
			});

			oVideoEngager.subscribe("Callback.opened", function(){
				console.log('custom Callback.opened');
			});
			
			oVideoEngager.subscribe("WebChat.opened", function(){
				console.log('custom WebChat.opened');
			});		

			oVideoEngager.subscribe("WebChat.open", function(){ 
				console.log('custom WebChat.open?');
			});					
			
			oVideoEngager.subscribe("SendMessage.opened", function(){
				console.log('custom SendMessage.opened');
			});	

			oVideoEngager.subscribe("WebChatService.startChat", function(){ 
				console.log("kapan start");
			});	

			oVideoEngager.registerCommand("WebChatService.startChat", function (e) {
				console.log("WebChatService.startChat triggered"); 
			});
			
			oVideoEngager.registerCommand("startVideo", function (e) {
				//videochat channel is selected
				console.log("startVideoTriggered");
				startWithVideo = true;

				//set language to change form language for videoengagar video chat
				var default_lang = window._genesys.widgets.main.lang;
				oVideoEngager.command('App.setLanguage', {lang: default_lang + "_videochat"}).done(function(e){
					// App set language successfully started
					initiateToaster();
				}).fail(function(e){
					// App failed to set language
				});
			});
			
			oVideoEngager.registerCommand("endCall", function (e) {
				window._genesys.cxwidget.bus.command("Toaster.close");
				oVideoEngager.command('WebChatService.endChat');

				if (!iframeHolder) {
					if (popupinstance) {
						popupinstance.close();
					}
					popupinstance = null;
				} else {
					iframeHolder.removeChild(iframeHolder.getElementsByTagName('iframe')[0]);
					iframeHolder.style.display = 'none';
				}
			});

			oVideoEngager.registerCommand("startAudio", function (e) {
				startWithVideo = false;
			});
			
			oVideoEngager.subscribe("WebChatService.ended", function(){
				console.log('WebChatService.ended');
				closeIframeOrPopup();
			});			
			
			oVideoEngager.subscribe("WebChatService.messageReceived", function(msg){
				console.log('custom WebChatService.messageReceived', msg);
			});
			
			oVideoEngager.subscribe("SendMessage.opened", function(){
				console.log('custom SendMessage.opened');
			});				

			oVideoEngager.subscribe("SendMessageService.messageSent", function(e){
				console.log('SendMessageService.messageSent', e);
			});
			
			oVideoEngager.subscribe("WebChatService.started", function(){
				console.log('WebChatService.started');
				startVideoChat();
			});
			oVideoEngager.ready();

			//terminate call on page close
			window.onbeforeunload = function(){
				terminateCall();
			}
		};
		
		var messageHandler = function (e) {
			console.log('messageHandler', e.data);
			if (e.data.type === 'popupClosed') {
				terminateCall();
			}
			if (e.data.type === 'callEnded') {
				terminateCall();
			}
		};
		
		if (window.addEventListener) {
			window.addEventListener("message", messageHandler, false);
		} else {
			window.attachEvent("onmessage", messageHandler);
		}
	
	};
};

var videoengager = new VideoEngager();
window.videoengager = videoengager;

var eventName = 'VideoEngagerReady';
let event;
if(typeof(Event) === 'function') {
	event = new Event(eventName);
}else{
	event = document.createEvent('Event');
	event.initEvent(eventName, true, true);
}
document.dispatchEvent(event);
