/**
 * Module : xxx
 */
(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.welfareSmall", {
                url: "/welfareSmall",
                views: {
                    "@": {
                        templateUrl: 'views/main/welfareSmall/index.root.html',
                        controller: welfareSmallController
                    }
                }
            });
        }]);
    // ----------------------------------------------------------------------------
    welfareSmallController.$inject = [];
    function welfareSmallController() {

    }
})();