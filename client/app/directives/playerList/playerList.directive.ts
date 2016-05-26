'use strict';
(function(){

class PlayerListCtrl {

  constructor(private GameData, public Game) {
  }

  clickPlayer(playerIndex: number): void {
    if (this.GameData.isLeader && this.Game.model.status === 2) {

      if (this.GameData.selected.has(playerIndex)) {
        console.log('deleted')
        this.GameData.selected.delete(playerIndex)
      }
      else if (this.GameData.selected.size < this.GameData.currRound.passfails.length) {
        console.log('added')
        this.GameData.selected.add(playerIndex)
      }
    }
  }

}

angular.module('resistanceApp')
  .directive('playerList', () => ({
    scope: {},
    bindToController: {
    },
    controller: PlayerListCtrl,
    controllerAs: "$ctrl",
    templateUrl: 'app/directives/playerList/playerList.html',
    restrict: 'EA'
  }))
  .directive('leaderGlyph', () => ({
    scope: {},
    controller: function() {},
    controllerAs: "$ctrl",
    restrict: 'EA',
    template: '<div class="glyphicon glyphicon-flag"></div>'
  }))
  .directive('spyGlyph', () => ({
    scope: {},
    controller: function() {},
    controllerAs: "$ctrl",
    restrict: 'EA',
    template: '<div class="glyphicon glyphicon-eye-open"></div>'
  }))
  .directive('thumbsUp', () => ({
    scope: {},
    controller: function() {},
    controllerAs: "$ctrl",
    restrict: 'EA',
    template: '<div class="glyphicon glyphicon-thumbs-up"></div>'
  }))
  .directive('thumbsDown', () => ({
    scope: {},
    controller: function() {},
    controllerAs: "$ctrl",
    restrict: 'EA',
    template: '<div class="glyphicon glyphicon-thumbs-down"></div>'
  }))
})();
