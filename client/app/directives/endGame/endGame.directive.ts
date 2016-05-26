'use strict';
(function(){

class EndGameCtrl {
  private showEnd: boolean = false

  constructor(private $rootScope, private $timeout, private GameData, public Game) {
    this.$rootScope.$watch(
      () => {
        return this.Game.model.status
      },
      (nv, ov) => {
        if (nv > 4) {
          this.$timeout(() => {
            this.showEnd = true
          }, this.GameData.currRound.passfails.length * 1000 + 1000)

        }
    })
  }

  newGame(): void {
    this.Game.replay()
  }

  leaveGame(): void {
    this.Game.leave()
  }

}

angular.module('resistanceApp')
  .directive('endGame', () => ({
    scope: {},
    bindToController: {
    },
    controller: EndGameCtrl,
    controllerAs: "$ctrl",
    templateUrl: 'app/directives/endGame/endGame.html',
    restrict: 'EA'
  }))
})();
