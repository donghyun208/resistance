'use strict';
(function(){

class HomeComponent {
  private Player
  private Game
  private observer : boolean = false
  private gameID : string

  constructor(Player, Game) {
    this.Player = Player;
    this.Game = Game;
    console.log('home constructor run')
    console.log(this.Game.model)
  }

  createGame(): void {
    this.Game.create(this.observer)
  }

  attemptJoinGame(): void {
    if (this.gameID.length === 5) {
      console.log('joining', this.gameID)
      this.Game.join(this.gameID, this.observer)
      // .then(
      //   game => {
      //     // gameExistAlert.show()
      //     console.log('joining', game)
      //   }
      // )
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
