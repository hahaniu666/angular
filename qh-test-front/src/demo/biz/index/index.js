/**
 * Module : 示例主页
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.index", {
                url: "/index",
                views: {
                    "@": {
                        templateUrl: 'biz/index/index.html',
                        controller: IndexController
                    }
                }
            });

            // ----------------------------------------------------------------------------
            IndexController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope', '$log', '$window'];
            function IndexController($scope, $http, $state, $element, $rootScope, $log, $window) {
                $scope.icons = new Array(4);
                $scope.showFooter = true;
                $scope.$window = $window;

                $scope.getHeight = function () {
                    $scope.mainHeight = angular.element('.ks-main').height();
                    $scope.ksHeaderHeight = angular.element('.ks-header').height();
                    $scope.ksHeaderHeight = angular.element('.ks-header').height();
                    $scope.mdContentHeight = angular.element('md-content').height();
                    $scope.ksFooterMenuHeight = angular.element('[ks-footer-menu]').height();
                    
                };
            }
        }]);
})();