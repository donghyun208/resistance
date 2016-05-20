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
    console.log('starting PlayerService')
    this.$rootScope = $rootScope
    this.socket = socket.socket
    this.$q = $q
    this.Game = Game
    this.$state = $state

    this.startSocketListeners()
    this.startWatchers()
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

  startSocketListeners(): void {
    this.socket.on('player:update', player => {
      console.log('updated player', player)
      this.model = player
    })
  }


  load(): void {
    // let playerID : string = localStorage.getItem("playerID")
    let deferred = this.$q.defer()
    let playerID : string = sessionStorage.getItem("playerID")
    if (!this.loaded) {
      this.loaded = true
      console.log("\n\n************\LOADING PLAYER************\n\n")
      this.socket.emit('player:load', playerID, player => {
        sessionStorage.setItem("playerID", player._id)
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
