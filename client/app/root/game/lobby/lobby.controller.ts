'use strict';
(function(){

class LobbyComponent {
  private $scope
  public newName: string = ""

  constructor($scope, public Game, public Player, public GameData) {
    this.$scope = $scope;
  }

  leaveGame() {
    this.Game.leave()
  }

  startGame() {
    this.Game.start()
  }

  changeName() {
    console.log(this.newName)
    this.Game.changeName(this.newName)
    this.newName = ""
  }
}

angular.module('resistanceApp')
  .component('lobby', {
    templateUrl: 'app/root/game/lobby/lobby.html',
    controller: LobbyComponent
  });

})();
