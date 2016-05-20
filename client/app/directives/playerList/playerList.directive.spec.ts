'use strict';

describe('Directive: playerList', function () {

  // load the directive's module and view
  beforeEach(module('resistanceApp'));
  beforeEach(module('app/directives/playerList/playerList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<player-list></player-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the playerList directive');
  }));
});
