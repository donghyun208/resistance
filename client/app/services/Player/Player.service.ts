'use strict';

interface Player {
  _id : string
  gameID : string
  name : string
  pass : string    // pass is used to decrypt server data
}

(function() {

class PlayerService {
  private socket
  private loaded : boolean = false
  model: Player = {_id: '', gameID: null, name: '', pass: ''}
  private session = true

  constructor(private $rootScope, socket, private $q, private $state) {
    this.socket = socket.socket
    this.startSocketListeners()
  }

  startSocketListeners(): void {
    this.socket.on('player:update', player => {
      this.model = player
    })
  }

  load(): void {
    let deferred = this.$q.defer()
    let playerID : string
    console.log(this.session)
    if (this.session)
      playerID = sessionStorage.getItem("playerID")
    else
      playerID = localStorage.getItem("playerID")
    if (!this.loaded) {
      this.loaded = true
      console.log("\n\n************LOADING PLAYER************\n\n")
      this.socket.emit('player:load', playerID, player => {
        if (this.session)
          sessionStorage.setItem("playerID", player._id)
        else
          localStorage.setItem("playerID", player._id)
        console.log("\n\n************PLAYER LOADED************\n\n")
        deferred.resolve(player)
      })
    }
    else
      deferred.resolve(this.model)
    return deferred.promise
  }

}

angular.module('resistanceApp')
  .service('Player', PlayerService)
})();
