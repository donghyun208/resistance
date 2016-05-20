'use strict';
(function(){

class LobbyComponent {
  private $scope
  private socket
  public Player
  public Game

  constructor($scope, Player, Game, socket) {
    this.socket = socket;
    this.Player = Player;
    this.Game = Game;
    this.$scope = $scope;
  }

  leaveGame() {
    this.Game.leave()
  }

  startGame() {
    this.Game.start()
  }
}

angular.module('resistanceApp')
  .component('lobby', {
    templateUrl: 'app/root/game/lobby/lobby.html',
    controller: LobbyComponent
  });

})();
