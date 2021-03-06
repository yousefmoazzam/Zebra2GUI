/**
 * Created by twi18192 on 18/02/16.
 */

var idLookupTableFunctions = require('./utils/idLookupTable');

function Client(url){

  var channelIDIndex = 0;
  var websocket = null;
  var webSocketOnOpenCallbacks = [];
  var webSocketOnCloseCallbacks = [];
  var webSocketOnErrorCallbacks = [];

  this.addWebSocketOnOpenCallback = function(callback){
    webSocketOnOpenCallbacks.push(callback);
  };

  this.addWebSocketOnCloseCallback = function(callback){
    webSocketOnCloseCallbacks.push(callback);
  };

  this.addWebSocketOnErrorCallback = function(callback){
    webSocketOnErrorCallbacks.push(callback);
  };

  this.sendText = function(message){
    websocket.send(message);
  };

  this.close = function(){
    websocket.close();
  };

  this.getNextAvailableId = function(){
    return channelIDIndex;
  };

  this.incrementId = function(){
    channelIDIndex += 1;
  };

  openWebSocket(url);

  function openWebSocket(url){

    if("WebSocket" in window){
      websocket = new WebSocket(url);
    }
    else if("MozWebSocket" in window){
      websocket = new MozWebSocket(url);
    }
    else{
      throw new Error("WebSocket isn't supported by this browser.");
    }
    websocket.binaryType = "arraybuffer";

    websocket.onopen = function(evt){
      console.log("jofswf");
      for(var i = 0; i < webSocketOnOpenCallbacks.length; i++){
        webSocketOnOpenCallbacks[i](evt);
      }
    };

    websocket.onclose = function(evt){
      for(var j = 0; j < webSocketOnCloseCallbacks.length; j++){
        webSocketOnCloseCallbacks[j](evt);
      }
    };

    websocket.onerror = function(evt){
      /* This is not for websocket messages which are informing the client
       of an error with an interaction with the server, this is for an
       error that is about the websocket itself
       */
      for(var k = 0; k < webSocketOnErrorCallbacks.length; k++){
        webSocketOnErrorCallbacks[k](evt);
      }
    };

    websocket.onmessage = function(evt){
      var json  = JSON.parse(evt.data);

      if(json.type === 'Error'){
        idLookupTableFunctions.invokeIdCallback(json.id, false, json.message);
      }
      else if(json.type === 'Return' || json.type === 'Value'){
        idLookupTableFunctions.invokeIdCallback(json.id, true, json.value);
      }
    };

  }

}

var WebSocketClient = new Client('ws://pc0090:8080/ws');
module.exports = WebSocketClient;
