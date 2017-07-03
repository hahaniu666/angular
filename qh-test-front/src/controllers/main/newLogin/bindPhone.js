(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            /**
             * 登录
             */
            $stateProvider.state("main.newLogin.bindPhone", {

                url: '/bindPhone?noWx&s',
                views: {
                    "@": {
                        templateUrl: 'views/main/newLogin/bindPhone/index.root.html',
                        controller: loginController
                    }
                }
            });
        }]);
    loginController.$inject = ['$scope', '$rootScope', '$http', '$interval', '$state', "alertService", 'wxService', 'appConfig', '$httpParamSerializer'];
    function loginController($scope, $rootScope, $http, $interval, $state, alertService, wxService, appConfig, $httpParamSerializer) {
        var vm = this;
        $scope.title = '绑定手机号';
        $scope.confirm = '确认';
        if ($state.params.noWx === 'true') {
            $scope.title = '手机号登录';
            $scope.confirm = '登录';
        }
        $scope.user = {};
        $scope.fsyzm = "发送验证码";
        $scope.state = 1;
        $scope.srcState = $state.params.backUrl;
        $scope.isLogin = false;


        $scope.sendCode = function () {
            //发送验证码
            $http.get(appConfig.apiPath + "/user/sendCode?codeType=USER_REG&account=" + $scope.user.phone + "&regType=PHONE")
                .success(function () {
                    alertService.msgAlert("success", "已发送");
                    if ($rootScope.intervalStop) {
                        $interval.cancel($rootScope.intervalStop);//解除计时器
                    }
                    var i = 60;
                    $rootScope.intervalStop = $interval(function () {
                        i--;
                        $scope.fsyzm = i + 'S';
                        $scope.state = 2;
                        if (i <= 0) {
                            $scope.fsyzm = "重新发送";
                            $scope.state = 1;
                            $interval.cancel($rootScope.intervalStop);//解除计时器
                            $rootScope.intervalStop = null;
                        }
                    }, 1000);
                })
                .error(function () {
                });

        };
        vm.isPhoneNumTrue = false;
        //限制手机号输入，只能输入以1开头的数字，不做正则验证
        $scope.checkPhone = function () {
            var phone = $scope.user.phone + '';
            //如果未输入
            if (!phone || phone === '' || phone === 'null') {
                vm.isPhoneNumTrue = false;
                return -1;
            }
            //如果不是数字、不是以小数点结尾或者不是以1开头，抹去最后一位
            if (isNaN(phone) || phone.substr(0, 1) !== '1') {
                $scope.user.phone = phone.substr(0, phone.length - 1);
                vm.isPhoneNumTrue = false;
                return -1;
            }
            //如果长度超过11，抹去最后一位
            if (phone.length > 11) {
                $scope.user.phone = phone.substr(0, phone.length - 1);
                vm.isPhoneNumTrue = true;
                return -1;
            }
            if (phone.length !== 11) {
                vm.isPhoneNumTrue = false;
                return -1;
            }
            vm.isPhoneNumTrue = true;
            return 0;
        };

        //点击发送验证码，执行此函数
        $scope.openDialogCode = function (ev) {
            $scope.checkPhone();
            if (!vm.isPhoneNumTrue) {
                alertService.msgAlert("cancle", "请输入正确的手机号码");
                return;
            }
            if ($scope.waitShow) {
                return;
            }
            $scope.sendCode(ev);       //打开弹窗
        };

        vm.isCodeNumTrue = false;
        //限制验证码输入
        $scope.checkCode = function () {
            var code = $scope.user.code + '';
            //如果未输入
            if (!code || code === '' || code === 'null') {
                vm.isCodeNumTrue = false;
                return -1;
            }
            //如果不是数字，抹去最后一位
            if (isNaN(code)) {
                $scope.user.code = code.substr(0, code.length - 1);
                vm.isCodeNumTrue = false;
                return -1;
            }
            //如果长度超过11，抹去最后一位
            if (code.length > 6) {
                $scope.user.code = code.substr(0, code.length - 1);
                vm.isCodeNumTrue = true;
                return -1;
            }
            if (code.length !== 6) {
                vm.isCodeNumTrue = false;
                return -1;
            }
            vm.isCodeNumTrue = true;
            return 0;
        };
        $scope.loginSuccess = function () {
            $scope.isLogin = true;
            if ($scope.isLogin && $state.params.backUrl) {
                // 登陆成功才能返回刚才的url
                var urldecode = decodeURIComponent($state.params.backUrl);
                location.href = urldecode;
            }
            else {
                history.go(-1);
            }
        };
        $scope.submit = function () {
            //提交数据
            $http({
                method: 'POST',
                url: appConfig.apiPath + '/user/loginPhone',
                data: $httpParamSerializer({
                    phone: $scope.user.phone,
                    code: $scope.user.code
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                if (resp.data.couponSize > 0) {
                    alertService.msgAlert(null, "注册红包领取成功，请到个人中心查看").then(function () {
                        $scope.loginSuccess();
                    });
                } else {
                    $scope.loginSuccess();
                }
            });
        };
        //租赁协议
        $scope.goRent = function () {
            $http({
                method: 'GET',
                url: appConfig.apiPath + "/common/rentAgreement?type=USER"
            }).then(function (resp) {
                var data = resp.data;
                var id = data.data.id;
                if (id) {
                    $state.go("main.cms.detail", {id: id, backUrl: window.location.href});
                }
            }, function () {
                alertService.msgAlert("exclamation-circle", "协议信息获取失败了！");
            });

        };
        // 回退页面
        $scope.fallbackPage = function () {
            if ($scope.isLogin && $state.params.backUrl) {
                // 登陆成功才能返回刚才的url
                var urldecode = decodeURIComponent($state.params.backUrl);
                location.href = urldecode;
            } else if ($state.params.s === "index" || history.length <= 2 || $scope.isLogin || $state.params.s === '') {
                $state.go("main.index", null, {reload: true});
                return;
            } else {
                history.back();
            }
        };
    }
})();