'use strict';

interface Game {
  _id:       string
  rounds:    Round[]
  currRound: number
  roles:     number[]
  spyList:   number[]
  numSpy:    number
  started:   boolean
  status:    number
  nameHash:  {}
  players:   string[]
}

interface Round {
  participants: number[]
  fail:         number
  result:       number
  leaderStart:  number
  attempt:      number
  votes:        number[]
  passfails:    number[]
}

(function() {

class GameService {
  private socket
  model: Game = {
    _id: null,
    rounds: [],
    currRound: null,
    roles: [],
    spyList: [],
    numSpy: null,
    started: null,
    status: null,
    nameHash: {},
    players: []
  }

  constructor (private $rootScope, socket, private $q, private $state){
    this.socket = socket.socket
    this.startSocketListeners()
  }

  startSocketListeners(): void {
    this.socket.on('game:update', game => {
      console.log('received a game update', game)
      this.model = game
      this.$rootScope.$emit('game:updated')
    })
  }

  getUpdate(gameID: string): void {
    this.socket.emit('game:getupdate', gameID)
  }

  join(gameID: string, joinAsObs: boolean): void {
    console.log('attempting to join game:', gameID)
    let deferred = this.$q.defer()
    if (this.model._id !== gameID) {
      console.log("\n\n************\LOADING GAME************\n\n")
      this.socket.emit('game:join', gameID, joinAsObs, success => {
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

  create(joinAsObs: boolean): void {
    this.socket.emit('game:create', joinAsObs)
  }

  leave(): void {
    console.log('left - go to home')
    this.$state.go("root.home")
    this.clearModel()
    this.socket.emit('game:leave')
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

  clearModel(): void {
    this.model._id = null
    this.model.rounds = []
    this.model.currRound = null
    this.model.roles = []
    this.model.spyList = []
    this.model.numSpy = null
    this.model.started = null
    this.model.status = null
    this.model.nameHash = {}
    this.model.players = []
  }
}

angular.module('resistanceApp')
  .service('Game', GameService)
})();
