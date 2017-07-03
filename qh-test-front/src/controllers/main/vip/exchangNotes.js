(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.exchangNotes", {
                url: "/exchangNotes",
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/exchangNotes/index.root.html',
                        controller: exchangNotesController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    exchangNotesController.$inject = ['$scope', '$state'];
    function exchangNotesController($scope, $state) {
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