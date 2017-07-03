/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.productDetail", {
                url: "/productDetail",
                views: {
                    "@": {
                        templateUrl: 'biz/productDetail/productDetail.html',
                        controller: productDetailController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            productDetailController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope', 'uiList'];
            function productDetailController($scope, $http, $state, $element, $rootScope, uiList) {

                $scope.comments = new Array(2)
            }
        }]);


})();