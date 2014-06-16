(function ( f ){
  if ( typeof module != "undefined" && module.exports ) module.exports = f()
  else this.EventStation = f()
}(function (){

  function EventStation(){}

  EventStation.mixin = EventStation.extend = function ( prototype ){
    for( var name in proto ){
      prototype[name] = proto[name]
    }
    return prototype
  }

  function listen( channel, listener ){
    this.channels = this.channels || {};
    (this.channels[channel] = this.channels[channel] || []).push(listener)
    return this
  }

  function unListen( channel, listener ){
    if ( !channel ) {
      this.channels = {}
    }
    else if ( !listener ) {
      this.channels[channel] = []
    }
    else {
      channel = this.channels[channel]
      if( channel ) {
        var i = channel.indexOf(listener)
        if ( ~i ) {
          channel.splice(i, 1)
        }
      }
    }
    return this
  }

  function broadcast( channel, message ){
    message = [].slice(arguments, 1)
    channel = this.channels[channel]
    if ( channel ) {
      channel.forEach(function( listener ){
        listener.apply(this, message)
      }, this)
    }
    return this
  }

  function once( channel, listener ){
    function proxy(  ){
      unListen.call(this, channel, proxy)
      listener.apply(this, arguments)
    }
    listen.call(this, channel, proxy)
    return this
  }

  function hasListener( channel, listener ){
    return channel = this.channels[channel]
      ? listener ? !!~channel.indexOf(listener) : true
      : false
  }

  var proto = EventStation.prototype = {}
  proto.on = proto.listen = proto.addListener = proto.addEventListener = listen
  proto.off = proto.unListen = proto.removeListener = proto.removeEventListener = unListen
  proto.broadcast = proto.emit = proto.fire = broadcast
  proto.once = once
  proto.hasListener = hasListener

  return EventStation
}))