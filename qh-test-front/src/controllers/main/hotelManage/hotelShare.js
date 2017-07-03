(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.hotelManage.hotelShare", {
                url: "/hotelShare",
                views: {
                    "@": {
                        templateUrl: 'views/main/hotelManage/hotelShare/index.root.html',
                        controller: hotelShareController,
                        controllerAs: "vm"
                    }
                }
            })
            ;
        }]);


    // ----------------------------------------------------------------------------
    hotelShareController.$inject = [ '$http', '$state', 'appConfig', 'alertService', '$httpParamSerializer'];
    function hotelShareController( $http, $state, appConfig, alertService, $httpParamSerializer) {
        var vm = this;

        /*二维码地址*/
        vm.url = appConfig.storeUrl;

        /*控制弹窗背景*/
        vm.backshow = false;

        vm.data = {};
        /*获取店铺信息*/
        vm.getMsg = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/managerOrg/shop"
            }).then(function (resp) {
                    vm.data = resp.data;
                    vm.data.url = vm.url + vm.data.id + "/";
                }, function () {

                }
            );
        };
        vm.getMsg();

        /*编辑店铺名称*/
        vm.editTitle = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + '/managerOrg/shopEdit',
                data: $httpParamSerializer({
                    title: vm.data.changeTitle
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function () {
                $state.reload();
            });
        };

        /*上传编辑后的名称*/
        vm.updateTitle = function () {
            if (vm.data.title) {
                vm.editTitle();
            } else {
                vm.backOpen();
                alertService.msgAlert("cancle", "不能为空!");
            }
        };
        vm.backOpen = function (type) {
            vm.backshow = !vm.backshow;
            if (type === 'open') {
                vm.data.changeTitle = vm.data.title;
            }
        };
        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();