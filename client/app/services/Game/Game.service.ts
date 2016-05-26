'use strict';

interface Game {
  _id : string
  status: number
}

(function() {

class GameService {
  private socket
  public model : Game = { _id: '', status: 0}

  constructor (private $rootScope, socket, private $q, private $state){
    this.socket = socket.socket
    this.startSocketListeners()
  }

  startSocketListeners(): void {
    this.socket.on('game:update', game => {
      this.model = game
      this.$rootScope.$emit('game:updated')
    })
  }

  getUpdate(gameID: string): void {
    this.socket.emit('game:getupdate', gameID)
  }

  join(gameID: string): void {
    console.log('attempting to join game:', gameID)
    let deferred = this.$q.defer()
    if (this.model._id !== gameID) {
      console.log("\n\n************\LOADING GAME************\n\n")
      this.socket.emit('game:join', gameID, success => {
        if (success) {
          deferred.resolve()
        }
        else {
          console.log('game not found')
          deferred.reject()
        }
      })
    }
    return deferred.promise
  }

  joinObs(gameID: string): void {
    console.log('attempting to join game:', gameID)
    let deferred = this.$q.defer()
    if (this.model._id !== gameID) {
      console.log("\n\n************\LOADING GAME************\n\n")
      this.socket.emit('game:joinObs', gameID, success => {
        if (success) {
          deferred.resolve()
        }
        else {
          console.log('game not found')
          deferred.reject()
        }
      })
    }
    return deferred.promise
  }

  create(): void {
    this.socket.emit('game:create')
  }

  leave(): void {
    console.log('left - go to home')
    this.$state.go("root.home")
    this.socket.emit('game:leave')
    this.model = { _id: '', status: null}
    console.log(this.model)
  }

  changeName(name: string): void {
    this.socket.emit('game:changeName', name)
  }

  start(): void {
    this.socket.emit('game:start')
  }

  replay(): void {
    this.socket.emit('game:replay')
  }

  proposeMission(participants: number[]): void {
    this.socket.emit('game:missionPropose', participants)
  }

  acceptMission(participants: number[]): void {
    this.socket.emit('game:missionVote', 2)
  }

  rejectMission(participants: number[]): void {
    this.socket.emit('game:missionVote', 1)
  }

  passMission(): void {
    this.socket.emit('game:missionGo', 1)
  }

  failMission(): void {
    this.socket.emit('game:missionGo', 2)
  }
}

angular.module('resistanceApp')
  .service('Game', GameService)

})();
