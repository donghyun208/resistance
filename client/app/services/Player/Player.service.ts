'use strict';

interface Player {
  _id : string
  gameID : string
  name : string
  pass : string    // pass is used to decrypt server data
}

(function() {

class PlayerService {
  private $rootScope
  private socket
  private $q
  private Game
  private $state
  public model : Player = {_id: '', gameID: null, name: '', pass: ''}
  private loaded : boolean = false

  constructor($rootScope, socket, $q, Game, $state) {
    this.$rootScope = $rootScope
    this.socket = socket.socket
    this.$q = $q
    this.Game = Game
    this.$state = $state
    this.startSocketListeners()
    this.startWatchers()
  }

  startSocketListeners(): void {
    this.socket.on('player:update', player => {
      this.model = player
    })
  }

  startWatchers(): void {
    /*
    Player service will automatically join the proper Game
    */
    this.$rootScope.$watchCollection(
      () => {
        return [this.model._id, this.model.gameID]
      },
      ([playerID, gameID], ov) => {
        if (gameID) {
          this.Game.getUpdate(gameID)
        }
        else if (playerID && !gameID) {
          this.$state.go("root.home")
          console.log('go to home')
        }
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
