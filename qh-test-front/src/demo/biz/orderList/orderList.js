/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.orderList", {
                url: "/orderList",
                views: {
                    "@": {
                        templateUrl: 'biz/orderList/orderList.html',
                        controller: OrderListController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            OrderListController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope', 'uiList'];
            function OrderListController($scope, $http, $state, $element, $rootScope, uiList) {
                $scope.currentNavItem = 'page1';
                $scope.comments = new Array(6);

                $scope.aaa = function () {
                    var newLen = $scope.comments.length;
                    if (newLen >= 1) {
                        newLen--;
                    }
                    $scope.comments = new Array(newLen);
                };
                
                function genData() {
                    var arr = [
                        /*全部,
                         待付款,
                         待发货,
                         待收货,
                         待评价*/
                    ];
                    for (var i = 0; i < 5; i++) {
                        arr.push({title: i})
                    }
                    return arr;
                }

                $scope.reload = function () {
                    $scope.tabs = genData();
                };

                $scope.reload();

            }
        }]);


})();