'use strict';
(function(){

class HomeComponent {
  private Player
  private Game
  private socket
  private gameID : string

  constructor(Player, Game, socket) {
    this.Player = Player;
    this.Game = Game;
    this.socket = socket;
    console.log('home constructor run')
  }

  createGame(): void {
    this.Game.create()
  }

  attemptJoinGame(): void {
    if (this.gameID.length === 8) {
      console.log('joining', this.gameID)
      this.Game.join(this.gameID)
      .then(
        game => {
          // gameExistAlert.show()
          console.log('joining', game)
        }
      )
    }
    else {
      // gameExistAlert.hide()
    }

  }
}

angular.module('resistanceApp')
  .component('home', {
    templateUrl: 'app/root/home/home.html',
    controller: HomeComponent
  });

})();
