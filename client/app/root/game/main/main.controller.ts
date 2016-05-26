'use strict';
(function(){

// class RoleComponent {

//   constructor(private $uibModalInstance) {
//   }

//   ok() {
//     this.$uibModalInstance.close()
//   }
// }

  class MainComponent {

    // constructor(private GameData, public Game, private $uibModal) {
  constructor(private GameData, public Game) {
  }

  newGame(): void {
    this.Game.replay()
  }

  leaveGame(): void {
    this.Game.leave()
  }

  // openRole(): void {

  //   var modalInstance = this.$uibModal.open({
  //         animation: true,
  //         templateUrl: 'app/root/game/main/role.html',
  //         controller: RoleComponent,
  //         size: 'lg'
  //           // resolve: {
  //             // items: function () {
  //             //   return $scope.items;
  //             // }
  //           // }
  //       });

  //       // modalInstance.result.then(function (selectedItem) {
  //       //   $scope.selected = selectedItem;
  //       // }, function () {
  //       //   $log.info('Modal dismissed at: ' + new Date());
  //       // });


  // }
}

angular.module('resistanceApp')
  .component('main', {
    templateUrl: 'app/root/game/main/main.html',
    controller: MainComponent
  });

})();
