(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.hotelCooper", {
                url: "/hotelCooper",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelCooper/index.root.html',
                        controller: hotelCooperController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    hotelCooperController.$inject = [ '$http', '$state', 'appConfig',  "imgService",  "urlbackService"];
    function hotelCooperController( $http, $state, appConfig, imgService,  urlbackService) {
        var vm = this;
        vm.appConfig = appConfig;
        vm.imgService = imgService;
        $http({
            method: "GET",
            url: appConfig.apiPath + '/common/hotelCooperate'
        }).then(function (resp) {
            vm.data = resp.data;
        });

        vm.clickUrl = function (url) {
            urlbackService.urlBack(url);
        };
        vm.fallbackPage = function () {
            $state.go("main.index", null, {reload: true});
        };
    }
})();