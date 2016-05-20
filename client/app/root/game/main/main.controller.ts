'use strict';
(function(){

class MainComponent {

  constructor(private GameData, public Game) {
  }

  newGame(): void {
    this.Game.replay()
  }

  leaveGame(): void {
    this.Game.leave()
  }
}

angular.module('resistanceApp')
  .component('main', {
    templateUrl: 'app/root/game/main/main.html',
    controller: MainComponent
  });

})();
