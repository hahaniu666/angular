(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.vip.authority", {
                url: "/authority?tab",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }],
                    vipMsg: ['userService', function (userService) {
                        return userService.getVipMsg();
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/vip/authority/index.root.html',
                        controller: vipDetailController,
                        controllerAs: "vm"
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    vipDetailController.$inject = ['$scope', '$http', '$state', 'appConfig', 'curUser',  'imgService',  'vipMsg'];
    function vipDetailController($scope, $http, $state, appConfig, curUser,  imgService, vipMsg) {
        var vm = this;
        $scope.tab = $state.params.tab;
        // 回退页面
        $scope.fallbackPage = function () {
            $state.go("main.newVip", null, {reload: true});
        };
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.isLogin = false;

        //判断进度条的问题
        vm.one = false;
        vm.two = false;
        vm.three = false;
        vm.four = false;
        vm.one1 = false;
        vm.two1 = false;
        vm.three1 = false;
        vm.four1 = false;


        $scope.hasImg = true;
        $scope.tabs = function (num) {
            $scope.tab = num;
            vm.changMsg(num);
        };
        //获取头像信息
        $scope.user = curUser.data;


        vm.data = vipMsg.data;
        for (var i = 0; i < vm.data.agents.length; i++) {
            if (vm.data.agent === vm.data.agents[i].id) {
                vm.order = vm.data.agents[i].order;
                vm.needIntegral = vm.data.agents[i].integral;
                if (vm.order === vm.data.agents.length) {
                    vm.nextIntegral = vm.data.agents[i].integral;
                } else {
                    vm.nextIntegral = vm.data.agents[i + 1].integral;
                }
                $scope.tab = vm.order;
                if ($state.params.tab) {
                    $scope.tabs($state.params.tab);
                }
            }
        }
        $scope.userAvt = imgService.imgUrl($scope.user.userInfo.avatar);

        vm.changMsg = function (tab) {

            //会员福利获取
            vipMsg.sd = vipMsg.data.agents[tab - 1].weifare;
            //会员权益
            vipMsg.power = vipMsg.data.agents[tab - 1].power;
            angular.element("#vipUpdate").html(vipMsg.sd);
            angular.element("#vipLations").html(vipMsg.power);
        };


        //获取钱币信息
        vm.getMsg = function () {
            $http({
                method: 'GET',
                url: appConfig.apiPath + '/integral/index'
            }).then(function (resp) {
                vm.msgData = resp.data.result;
                vm.aaa();
            });
        };
        vm.getMsg();
        $scope.tabs(vm.order);
        vm.aaa = function () {
            if (vm.msgData.totalIntegral < vm.data.agents[1].integral) {
                if (vm.msgData.totalIntegral / vm.nextIntegral < 0.25) {
                    vm.one = true;
                    return;
                } else if (vm.msgData.totalIntegral / vm.nextIntegral < 0.5) {
                    vm.two = true;
                    return;
                } else if (vm.msgData.totalIntegral / vm.nextIntegral < 0.75) {
                    vm.three = true;
                    return;
                } else {
                    vm.four = true;
                    return;
                }
            } else {
                if ((vm.msgData.totalIntegral - vm.data.agents[1].integral) / (vm.nextIntegral - vm.data.agents[1].integral) < 0.25) {
                    vm.one1 = true;
                    return;
                } else if ((vm.msgData.totalIntegral - vm.data.agents[1].integral) / (vm.nextIntegral - vm.data.agents[1].integral) < 0.5) {
                    vm.two1 = true;
                    return;
                } else if ((vm.msgData.totalIntegral - vm.data.agents[1].integral) / (vm.nextIntegral - vm.data.agents[1].integral) < 0.75) {
                    vm.three1 = true;
                    return;
                } else {
                    vm.four1 = true;
                    return;
                }
            }


        };
    }
})();