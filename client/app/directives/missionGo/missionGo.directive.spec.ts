'use strict';

describe('Directive: missionGo', function () {

  // load the directive's module and view
  beforeEach(module('resistanceApp'));
  beforeEach(module('app/directives/missionGo/missionGo.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<mission-go></mission-go>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the missionGo directive');
  }));
});
