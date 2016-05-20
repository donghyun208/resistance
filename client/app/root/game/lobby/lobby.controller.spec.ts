'use strict';

describe('Component: LobbyComponent', function () {

  // load the controller's module
  beforeEach(module('resistanceApp'));

  var LobbyComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    LobbyComponent = $componentController('LobbyComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
