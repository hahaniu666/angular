(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 防伪溯源,进行验证记录
         */
        $stateProvider.state("main.service.security.validate", {
            url: "/validate",
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, false);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/service/security/validate/index.root.html',

                    controllerAs:"vm",
                    controller:validateController

                }
            }
        });
    }]);
    validateController.$inject=[ '$scope', '$http', '$httpParamSerializer', '$state', 'appConfig', 'alertService', 'userService', 'curUser','$mdDialog'];
    function validateController( $scope, $http, $httpParamSerializer, $state, appConfig, alertService, userService, curUser,$mdDialog) {
            var vm = this;
            vm.isLogined = false;

            if (curUser.data.code === 'NOT_LOGINED') {
                vm.isLogined = false;
            } else {
                vm.isLogined = true;
            }
            $scope.gotoTop = function () {
                window.scrollTo(0, 0);//滚动到顶部
            };
            $scope.gotoTop();
            // 登陆后不需要输入手机验证码,未登陆则需要
            $scope.isLogined = !userService.isLogined();
            $scope.tokenImg = appConfig.tokenImg; // 设置图片验证码的url
            // 页面需要用到的数据进行绑定
            $scope.security = {code: null, picCode: null, msgCode: null, phone: null};
            // 进行查询
            $scope.queryValidate = function () {
                // 进行请求查询条形码和验证码是否正确
                if (!$scope.security.code || $scope.security.code === "") {
                    alertService.msgAlert("exclamation-circle", "请填写防伪验证码");
                    return;
                }
                $mdDialog.show({
                    templateUrl: 'views/main/service/security/validate/chaxunDialog/index.root.html',
                    parent: angular.element(document.body).find('#qh-wap'),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    fullscreen: false,
                    controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
                        var vm = this;
                        vm.msg = '未找到该验证码,请联系商家';
                        vm.title = '错误';
                        vm.rightButton = "我知道了";
                        vm.checkSubmit = function () {
                            $mdDialog.hide(true);
                        };
                        vm.cancel = function () {
                            $mdDialog.cancel();
                        };
                    }],
                    controllerAs: "vm"
                }).then(function () {

                }, function () {
                    alert('失败');
                });

                /*
                // 进行请求查询条形码和验证码是否正确
                if (!$scope.security.code || $scope.security.code === "") {
                    alertService.msgAlert("exclamation-circle", "请填写防伪验证码");
                    return;
                }
                //邵邵说这个暂时先不调用
               $http({
                    method: "POST",
                    url: appConfig.apiPath + '/service/itemVerify',
                    data: $httpParamSerializer($scope.security),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).success(function (data) {
                    if(data.code == 'SUCCESS'){
                        $state.go("main.service.security.product", {
                            id: data.id,
                            code: $scope.security.code
                        }, {reload: true});
                    }else{
                        alert(data.msg);
                    }


                }).error(function () {
                    alert(22);
                   /!* var s = new Date().getTime();
                    $scope.tokenImg = appConfig.tokenImg + "?s=" + s; // 设置图片验证码的url*!/
                });*/
            };
            // 回退页面
            $scope.fallbackPage = function () {

                if (history.length === 1) {
                    $state.go("main.index", null, {reload: true});
                } else {
                    history.back();
                }
            };
        }
})();