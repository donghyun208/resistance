'use strict';

describe('Directive: missionVote', function () {

  // load the directive's module and view
  beforeEach(module('resistanceApp'));
  beforeEach(module('app/directives/missionVote/missionVote.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<mission-vote></mission-vote>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the missionVote directive');
  }));
});
