'use strict';

(function(){

class MissionVoteCtrl {
  constructor (private Game, private GameData) {
  }

  proposeMission(): void {
    let proposed: number[] = Array.from(this.GameData.selected)
    this.Game.proposeMission(proposed)
  }

  acceptMission(): void {
    this.Game.acceptMission()
  }

  rejectMission(): void {
    this.Game.rejectMission()
  }

  passMission(): void {
    this.Game.passMission()
  }

  failMission(): void {
    this.Game.failMission()
  }
}

angular.module('resistanceApp')
  .directive('missionVote', () => ({
    scope: {},
    bindToController: {},
    restrict: 'EA',
    controller: MissionVoteCtrl,
    controllerAs: "$ctrl",
    templateUrl: 'app/directives/missionVote/missionVote.html'
  }));

})();
