/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.introduceUser", {
                url: "/introduceUser",
                views: {
                    "@": {
                        templateUrl: 'biz/introduceUser/introduceUser.html',
                        controller: introduceUserController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    introduceUserController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function introduceUserController($scope, $http, $state, $element, $rootScope) {
        $scope.comments = new Array(2)
    }


})();