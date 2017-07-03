/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.welfare", {
                url: "/welfare",
                views: {
                    "@": {
                        templateUrl: 'biz/welfare/welfare.html',
                        controller: WelfareController
                    }
                }
            });


        }]);

    // ----------------------------------------------------------------------------
    WelfareController.$inject = ['$scope', '$http', '$state', '$element', '$rootScope'];
    function WelfareController($scope, $http, $state, $element, $rootScope) {

          /*  var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 30,
            });*/
    }


})();