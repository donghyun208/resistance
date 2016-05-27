'use strict';
(function(){

class RootComponent {

  private debug : boolean = false

  constructor(private $rootScope, private $state, private Player, private Game, private GameData) {
    this.urlGameID = this.$state.params.gameID
    console.log('root constructor run', this.urlGameID)
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error) {
      console.log('statechangeerror')
      console.log(error)
    })
  }

  $onInit() {
    this.Player.load()
    .then(player => {
      if (!player.gameID)
        this.Game.join(this.urlGameID)
    })
  }
}

angular.module('resistanceApp')
  .component('root', {
    templateUrl: 'app/root/root.html',
    controller: RootComponent
  });

})();
