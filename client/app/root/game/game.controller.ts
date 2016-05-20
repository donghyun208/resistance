'use strict';
(function(){

class GameComponent {
  constructor() {
  }
}

angular.module('resistanceApp')
  .component('game', {
    templateUrl: 'app/root/game/game.html',
    controller: GameComponent
  });

})();
