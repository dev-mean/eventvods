/**
 * @license Angulartics
 * (c) 2013 Luis Farzati http://luisfarzati.github.io/angulartics
 * License: MIT
 */
!function(a,b){"use strict";function c(){
// General buffering handler
function b(a){return function(){k.waitForVendorCount&&(j[a]||(j[a]=[]),j[a].push(arguments))}}
// As handlers are installed by plugins, they get pushed into a list and invoked in order.
function c(b,c,d){return l[b]||(l[b]=[]),l[b].push(c),m[c]=d,function(){var c=Array.prototype.slice.apply(arguments);return this.$inject(["$q",a.bind(this,function(d){return d.all(l[b].map(function(b){var e=m[b]||{};if(e.async){var f=d.defer(),g=a.copy(c);return g.unshift(f.resolve),b.apply(this,g),f.promise}return d.when(b.apply(this,c))},this))})])}}
// Will run setTimeout if delay is > 0
// Runs immediately if no delay to make sure cache/buffer is flushed before anything else.
// Plugins should take care to register handlers by order of precedence.
function d(a,b){b?setTimeout(a,b):a()}
// General function to register plugin handlers. Flushes buffers immediately upon registration according to the specified delay.
function e(b,e,f){
// Do not add a handler if developerMode is true
if(!h.developerMode){n[b]=c(b,e,f);var g=h[b],i=g?g.bufferFlushDelay:null,k=null!==i?i:h.bufferFlushDelay;a.forEach(j[b],function(a,b){d(function(){e.apply(this,a)},b*k)})}}function f(a){return a.replace(/^./,function(a){return a.toUpperCase()})}
// Adds to the provider a 'register#{handlerName}' function that manages multiple plugins and buffer flushing.
function g(a){var d="register"+f(a);o[d]=function(b,c){e(a,b,c)},n[a]=c(a,b(a))}var h={pageTracking:{autoTrackFirstPage:!0,autoTrackVirtualPages:!0,trackRelativePath:!1,autoBasePath:!1,basePath:"",excludedRoutes:[]},eventTracking:{},bufferFlushDelay:1e3,// Support only one configuration for buffer flush delay to simplify buffering
trackExceptions:!1,developerMode:!1},i=["pageTrack","eventTrack","exceptionTrack","transactionTrack","setAlias","setUsername","setUserProperties","setUserPropertiesOnce","setSuperProperties","setSuperPropertiesOnce","incrementProperty","userTimings"],j={},l={},m={},n={settings:h},o={$get:["$injector",function(a){return p(a)}],api:n,settings:h,virtualPageviews:function(a){this.settings.pageTracking.autoTrackVirtualPages=a},excludeRoutes:function(a){this.settings.pageTracking.excludedRoutes=a},firstPageview:function(a){this.settings.pageTracking.autoTrackFirstPage=a},withBase:function(b){this.settings.pageTracking.basePath=b?a.element(document).find("base").attr("href"):""},withAutoBase:function(a){this.settings.pageTracking.autoBasePath=a},trackExceptions:function(a){this.settings.trackExceptions=a},developerMode:function(a){this.settings.developerMode=a}},p=function(b){return a.extend(n,{$inject:b.invoke})};
// Set up register functions for each known handler
a.forEach(i,g);for(var q in o)this[q]=o[q]}function d(b,c,d,e){function f(a){for(var b=0;b<d.settings.pageTracking.excludedRoutes.length;b++){var c=d.settings.pageTracking.excludedRoutes[b];if(c instanceof RegExp&&c.test(a)||a.indexOf(c)>-1)return!0}return!1}function g(a,b){f(a)||d.pageTrack(a,b)}d.settings.pageTracking.autoTrackFirstPage&&e.invoke(["$location",function(a){/* Only track the 'first page' if there are no routes or states on the page */
var b=!0;if(e.has("$route")){var f=e.get("$route");if(f)for(var h in f.routes){b=!1;break}else null===f&&(b=!1)}else if(e.has("$state")){var i=e.get("$state");for(var j in i.get()){b=!1;break}}if(b)if(d.settings.pageTracking.autoBasePath&&(d.settings.pageTracking.basePath=c.location.pathname),d.settings.pageTracking.trackRelativePath){var k=d.settings.pageTracking.basePath+a.url();g(k,a)}else g(a.absUrl(),a)}]),d.settings.pageTracking.autoTrackVirtualPages&&e.invoke(["$location",function(a){d.settings.pageTracking.autoBasePath&&(/* Add the full route to the base. */
d.settings.pageTracking.basePath=c.location.pathname+"#");var f=!0;if(e.has("$route")){var h=e.get("$route");if(h)for(var i in h.routes){f=!1;break}else null===h&&(f=!1);b.$on("$routeChangeSuccess",function(b,c){if(!c||!(c.$$route||c).redirectTo){var e=d.settings.pageTracking.basePath+a.url();g(e,a)}})}e.has("$state")&&!e.has("$transitions")&&(f=!1,b.$on("$stateChangeSuccess",function(b,c){var e=d.settings.pageTracking.basePath+a.url();g(e,a)})),e.has("$state")&&e.has("$transitions")&&(f=!1,e.invoke(["$transitions",function(b){b.onSuccess({},function(b){var c=b.options();
// only track for transitions that would have triggered $stateChangeSuccess
if(c.notify){var e=d.settings.pageTracking.basePath+a.url();g(e,a)}})}])),f&&b.$on("$locationChangeSuccess",function(b,c){if(!c||!(c.$$route||c).redirectTo)if(d.settings.pageTracking.trackRelativePath){var e=d.settings.pageTracking.basePath+a.url();g(e,a)}else g(a.absUrl(),a)})}]),d.settings.developerMode&&a.forEach(d,function(a,b){"function"==typeof a&&(d[b]=function(){})})}function e(b){return{restrict:"A",link:function(c,d,e){var f=e.analyticsOn||"click",g={};a.forEach(e.$attr,function(a,b){i(b)&&(g[j(b)]=e[b],e.$observe(b,function(a){g[j(b)]=a}))}),a.element(d[0]).bind(f,function(f){var i=e.analyticsEvent||h(d[0]);g.eventType=f.type,e.analyticsIf&&!c.$eval(e.analyticsIf)||(
// Allow components to pass through an expression that gets merged on to the event properties
// eg. analytics-properites='myComponentScope.someConfigExpression.$analyticsProperties'
e.analyticsProperties&&a.extend(g,c.$eval(e.analyticsProperties)),b.eventTrack(i,g))})}}}function f(a){a.decorator("$exceptionHandler",["$delegate","$injector",function(a,b){return function(c,d){var e=a(c,d),f=b.get("$analytics");return f.settings.trackExceptions&&f.exceptionTrack(c,d),e}}])}function g(a){return["a:","button:","button:button","button:submit","input:button","input:submit"].indexOf(a.tagName.toLowerCase()+":"+(a.type||""))>=0}function h(a){return g(a)?a.innerText||a.value:a.id||a.name||a.tagName}function i(a){return"analytics"===a.substr(0,9)&&["On","Event","If","Properties","EventType"].indexOf(a.substr(9))===-1}function j(a){var b=a.slice(9);// slice off the 'analytics' prefix
// slice off the 'analytics' prefix
return"undefined"!=typeof b&&null!==b&&b.length>0?b.substring(0,1).toLowerCase()+b.substring(1):b}var k=window.angulartics||(window.angulartics={});k.waitForVendorCount=0,k.waitForVendorApi=function(a,b,c,d,e){e||k.waitForVendorCount++,d||(d=c,c=void 0),!Object.prototype.hasOwnProperty.call(window,a)||void 0!==c&&void 0===window[a][c]?setTimeout(function(){k.waitForVendorApi(a,b,c,d,!0)},b):(k.waitForVendorCount--,d(window[a]))},/**
 * @ngdoc overview
 * @name angulartics
 */
a.module("angulartics",[]).provider("$analytics",c).run(["$rootScope","$window","$analytics","$injector",d]).directive("analyticsOn",["$analytics",e]).config(["$provide",f])}(angular);
!function(window,angular,undefined){"use strict";angular.module("angulartics.google.analytics",["angulartics"]).config(["$analyticsProvider",function($analyticsProvider){function dimensionsAndMetrics(properties){if(window.ga){for(var customData={},idx=1;idx<=200;idx++)"undefined"!=typeof properties["dimension"+idx]&&(customData["dimension"+idx]=properties["dimension"+idx]),"undefined"!=typeof properties["metric"+idx]&&(customData["metric"+idx]=properties["metric"+idx]);return customData}}function eventTrack(action,properties){if(!$analyticsProvider.settings.ga.disableEventTracking){if(properties&&properties.category||(properties=properties||{},properties.category="Event"),properties.value){var parsed=parseInt(properties.value,10);properties.value=isNaN(parsed)?0:parsed}if(properties.hitCallback&&"function"!=typeof properties.hitCallback&&(properties.hitCallback=null),properties.hasOwnProperty("nonInteraction")||(properties.nonInteraction=properties.noninteraction),window.ga){var eventOptions={eventCategory:properties.category,eventAction:action,eventLabel:properties.label,eventValue:properties.value,nonInteraction:properties.nonInteraction,page:properties.page||window.location.hash.substring(1)||window.location.pathname,userId:$analyticsProvider.settings.ga.userId,hitCallback:properties.hitCallback},dimsAndMets=dimensionsAndMetrics(properties);angular.extend(eventOptions,dimsAndMets),$analyticsProvider.settings.ga.transport&&angular.extend(eventOptions,$analyticsProvider.settings.ga.transport),ga("send","event",eventOptions),angular.forEach($analyticsProvider.settings.ga.additionalAccountNames,function(accountName){ga(accountName+".send","event",eventOptions)})}else window._gaq&&_gaq.push(["_trackEvent",properties.category,action,properties.label,properties.value,properties.nonInteraction])}}$analyticsProvider.settings.pageTracking.trackRelativePath=!0,$analyticsProvider.settings.ga={additionalAccountNames:undefined,disableEventTracking:null,disablePageTracking:null,userId:null},$analyticsProvider.registerPageTrack(function(path){$analyticsProvider.settings.ga.disablePageTracking||(window._gaq&&(_gaq.push(["_trackPageview",path]),angular.forEach($analyticsProvider.settings.ga.additionalAccountNames,function(accountName){_gaq.push([accountName+"._trackPageview",path])})),window.ga&&($analyticsProvider.settings.ga.userId&&ga("set","userId",$analyticsProvider.settings.ga.userId),ga("send","pageview",path),angular.forEach($analyticsProvider.settings.ga.additionalAccountNames,function(accountName){ga(accountName+".send","pageview",path)})))}),$analyticsProvider.registerEventTrack(eventTrack),$analyticsProvider.registerExceptionTrack(function(error,cause){eventTrack(error.toString(),{category:"Exceptions",label:error.stack,nonInteraction:!0})}),$analyticsProvider.registerSetUsername(function(userId){$analyticsProvider.settings.ga.userId=userId}),$analyticsProvider.registerSetUserProperties(function(properties){if(properties){var dimsAndMets=dimensionsAndMetrics(properties);ga("set",dimsAndMets)}}),$analyticsProvider.registerUserTimings(function(properties){return properties&&properties.timingCategory&&properties.timingVar&&"undefined"!=typeof properties.timingValue?void(window.ga&&ga("send","timing",properties)):void console.log("Properties timingCategory, timingVar, and timingValue are required to be set.")})}])}(window,window.angular);