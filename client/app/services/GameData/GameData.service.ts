'use strict';

(function() {

class GameDataService {
  public currRound:   Object
  public playerList:  string[] = []
  public playerIndex: number
  public currLeader:  string
  public spyList:     string[] = []
  public isSpy:       boolean
  public isLeader:    boolean
  public onMission:   boolean
  public selected:    Set = new Set()
  public showRole:    boolean = false

  constructor (private $rootScope, private $state, private Game, private Player) {
    this.startWatchers()
  }

  startWatchers(): void {
    this.$rootScope.$watchCollection(
      () => {
        return this.Game.model.players
      },
      (players, ov) => {
        if (players) {
          this.playerList = players
          this.playerIndex = players.indexOf(this.Player.model._id)
        }
      })

    this.$rootScope.$watch(
      () => {
        return this.Game.model.started
      },
      (nv, ov) => {
        if (nv === false) {
          console.log('go to lobby')
          this.currRound = null
          this.isSpy = null
          this.isLeader = null
          this.onMission = null
          this.$state.go("root.game.lobby", {gameID: this.Game.model._id})
        }
        else if (nv === true) {
          console.log('go to game')
          this.$state.go("root.game.main", {gameID: this.Game.model._id})
        }
      })

    this.$rootScope.$watchCollection(
      () => {
        return this.Game.model.roles
      },
      (roles, ov) => {
        if (this.Game.model.started) {
          this.spyList = []
          for (let i = 0; i < roles.length; i++) {
            if (roles[i] === 2) {
              this.spyList.push(this.Game.model.players[i])
          }
          if (this.spyList.indexOf(this.Player.model._id) >= 0)
            this.isSpy = true
          else
            this.isSpy = false
          }
        }
      })

    this.$rootScope.$watchCollection(
      () => {
        return this.Game.model.rounds
      },
      (rounds, ov) => {
        if (this.Game.model.started) {
          let currRoundIndex = this.Game.model.currRound
          this.currRound = this.Game.model.rounds[currRoundIndex]
          let attempt = this.currRound.attempt
          let currLeaderIndex = (this.currRound.leaderStart + attempt) % this.playerList.length
          this.currLeader = this.playerList[currLeaderIndex]
          if (this.currLeader === this.Player.model._id)
            this.isLeader = true
          else
            this.isLeader = false
        }
      })

    this.$rootScope.$watch(
      () => {
        return this.Game.model.status
      },
      (status, ov) => {
        if (this.Game.model.started) {
          if (status === 2) {
            // selecting mission
            this.selected.clear()
          }
          else if (status === 3) {
            // voting on mission
            this.selected.clear()
            // this.selected = new Set(this.currRound.participants)
          }
          else if (status === 4) {
            // go on mission
            this.selected.clear()
            if (this.currRound.participants.indexOf(this.playerIndex) >= 0)
              this.onMission = true
            else
              this.onMission = false
          }
        }
      })
  }
}

angular.module('resistanceApp')
  .service('GameData', GameDataService)

})();
