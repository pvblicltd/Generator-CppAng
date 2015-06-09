describe('<%= ctrlname %>', function () {

  beforeEach(module('<%= appname %>'));

  var scope, ctrl;

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    modalInstance = {
      close: jasmine.createSpy('modalInstance.close'),
      dismiss: jasmine.createSpy('modalInstance.dismiss'),
      result: {
        then: jasmine.createSpy('modalInstance.result.then')
      }
    };
    ctrl = $controller('<%= ctrlname %>', {
      $scope: scope,
      $modalInstance: modalInstance
    });
  }));

  it('should ...', inject(function () { expect(1).toEqual(1); }));

});
