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
  public model : Player = {_id: '', gameID: null, name: '', pass: ''}
  private loaded : boolean = false

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
    let playerID : string = localStorage.getItem("playerID")
    // let playerID : string = sessionStorage.getItem("playerID")
    if (!this.loaded) {
      this.loaded = true
      console.log("\n\n************LOADING PLAYER************\n\n")
      this.socket.emit('player:load', playerID, player => {
        // sessionStorage.setItem("playerID", player._id)
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
