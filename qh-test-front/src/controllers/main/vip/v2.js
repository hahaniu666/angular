(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.v2", {
                url: "/v2",
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/v2/index.root.html',
                        controller: v2Controller,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    v2Controller.$inject = ['$scope',  '$state'];
    function v2Controller($scope,  $state) {
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();