(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.store.machine", {
                url: "/machine?id",
                views: {
                    "@": {
                        templateUrl: 'views/main/store/machine/index.root.html',
                        controller: machineController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    machineController.$inject = ['$scope', '$state', 'appConfig', 'imgService', '$mdDialog', '$http'];
    function machineController($scope, $state, appConfig, imgService, $mdDialog, $http) {
        var vm = this;
        vm.appConfig = appConfig;
        vm.imgService = imgService;
        vm.id = $state.params.id;
        //回退
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        vm.mac = {instructionItems: []};
        vm.list = {};
        vm.getInfo = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/clean/status?orderId=" + vm.id
            }).then(function (resp) {
                vm.mac = resp.data.data;
                vm.list = resp.data.modeList;
                vm.check();
            });
        };
        vm.getInfo();
        //选中的服务
        vm.check = function () {
            /*总时间*/
            vm.allTime = 0;
            /*总的加湿时间*/
            vm.allHumidityMinute = 0;
            /*总的烘干*/
            vm.allMinute = 0;
            /*总的臭氧时间*/
            vm.allO3Minute = 0;
            for (var i = 0; i < vm.list.length; i++) {
                for (var j = 0; j < vm.mac.order.instructionItems.length; j++) {
                    if (vm.list[i].id === vm.mac.order.instructionItems[j].id) {
                        vm.list[i].sel = true;
                        /*计算加湿时间*/
                        vm.allHumidityMinute += parseInt(vm.mac.order.instructionItems[j].humidityMinute);
                        /*计算烘干时间*/
                        vm.allMinute += parseInt(vm.mac.order.instructionItems[j].minute);
                        /*计算臭氧时间*/
                        vm.allO3Minute += parseInt(vm.mac.order.instructionItems[j].o3Minute);
                        /*计算总时间*/
                        vm.allTime = vm.allHumidityMinute + vm.allMinute + vm.allO3Minute;
                    }
                }
            }
        };
    }
})();