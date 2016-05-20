'use strict';
(function(){

class RootComponent {

  constructor(private $rootScope, private $stateParams, private Player, private Game, private GameData) {
    this.urlGameID = this.$stateParams.gameID
    $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error) {
        console.log('statechangeerror')
        console.log(error)
    })
    console.log('root constructor', this.urlGameID)
  }

  $onInit() {
    this.Player.load()
    .then(player => {
      if (!player.gameID) {
        console.log('rejoining:', this.urlGameID, this.$stateParams.gameID)
        this.Game.join(this.urlGameID)
      }
    })
  }
}

angular.module('resistanceApp')
  .component('root', {
    templateUrl: 'app/root/root.html',
    controller: RootComponent
  });

})();
