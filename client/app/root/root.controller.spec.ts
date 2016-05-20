'use strict';

describe('Component: RootComponent', function () {

  // load the controller's module
  beforeEach(module('resistanceApp'));

  var RootComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    RootComponent = $componentController('RootComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
