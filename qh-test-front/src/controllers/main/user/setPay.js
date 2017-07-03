(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.user.setPay", {
            url: '/setPay?status',
            views: {
                "@": {
                    templateUrl: 'views/main/user/setPay/index.root.html',
                    controller: setPayController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    setPayController.$inject = ['$scope', '$state', 'curUser', '$timeout', 'userService', 'alertService', 'appConfig', '$http',
        '$httpParamSerializer', '$rootScope', '$interval'];
    function setPayController($scope, $state, curUser, $timeout, userService, alertService, appConfig, $http,
                              $httpParamSerializer, $rootScope, $interval) {
        var vm = this;
        //aaa=0页面显示支付密码，aaa=1,页面显示重置支付密码 aaa = 2，页面显示设置置支付密码
        vm.aaa = 0;
        //判断是否设置支付密码
        if (userService.curUser.data.userInfo.pass === false) {
            vm.aaa = 2;  //页面显示设置置支付密码
        }
        vm.userInfo = curUser.data.userInfo;
        vm.focusModel = [];
        // status 1,第一次设置密码,0 需要修改密码,2 第二次修改密码,则进行修改密码
        // change 是不是更改密码, phone:不记得原来的支付密码,重新设置新的

        vm.payMsgStatus = {status: 1, msg: "设置支付密码", change: false, isPhone: false};


        // 用于展示手机号码
        if (vm.userInfo.phone) {
            vm.payMsgStatus.phone = vm.userInfo.phone.replace(/(\d{3})(\d{4})(\d{4})/g, "$1****$3");
        }
        vm.oldChangePass = function () {
            vm.aaa = true;
            vm.payMsgStatus = {status: 0, msg: "输入原支付密码", change: true};
        };
        // 选择忘记密码,
        vm.oldChangePhonePass = function () {
            vm.aaa = true;
            vm.payMsgStatus.status = 2;
            vm.payMsgStatus.msg = "忘记密码";
            vm.payMsgStatus.isPhone = true;
        };
        var arg = $state.params.status;
        if (arg === 0 || arg === '0') {
            //aaa = 1页面显示重置支付密码
            vm.aaa = 1;
            vm.oldChangePhonePass();
        }

        // 初始化密码框
        vm.initFocus = function (index, boo) {
            if (boo) {
                // 如果为true,则刷新密码
                vm.focusModel = [];
            }
            for (var i = vm.focusModel.length; i < 6; i++) {
                vm.focusModel.push({pass: "", focus: false});
            }
        };
        // 先进行初始化按钮框
        vm.initFocus(0);
        // 保存输入的密码
        vm.textChange = function (index) {
            var boo = false;
            for (var i = 0; i < vm.focusModel.length; i++) {
                if (!vm.focusModel[i].focus) {
                    vm.focusModel[i].focus = true;
                    vm.focusModel[i].pass = index;
                    if ((i + 1) === vm.focusModel.length) {
                        // 最后一次进行保存密码
                        boo = true;
                    }
                    break;
                }
            }
            if (boo) {
                // 密码全部设置完成
                vm.savePayPass();
            }
        };
        // 进行删除密码
        vm.deletePassword = function () {
            for (var i = (vm.focusModel.length - 1); i > -1; i--) {
                if (vm.focusModel[i].focus) {
                    vm.focusModel[i].focus = false;
                    vm.focusModel[i].pass = "";
                    break;
                }
            }
        };
        // 旧密码 新密码 重新输入 忘记密码的是否输入手机验证码,isphone是否忘记原来密码
        vm.payPass = {oldPass: "", newPass: "", newPassTwo: "", code: "", isPhone: false};
        // 输入新的支付密码
        vm.changePhonePass = function () {
            if (!vm.payPass.code || vm.payPass.code === "") {
                alertService.msgAlert("exclamation-circle", "输入短信验证码");
                return;
            }
            $http({
                method: "GET",
                url: appConfig.apiPath + "/user/isPhoneCode?phone=" + vm.userInfo.phone + "&code=" + vm.payPass.code
            }).then(function (resp) {
                if (resp.data && resp.data.code === "SUCCESS") {
                    vm.payPass.isPhone = true;
                    vm.payMsgStatus = {status: 1, msg: "设置新的支付密码", change: true, isPhone: false};
                }
            }, function () {
            });
        };
        vm.savePayPass = function () {
            // 已经输入了6位,进行保存密码
            var payPass = '';
            for (var i = 0; i < 6; i++) {
                if (!vm.focusModel[i].pass || vm.focusModel[i].pass.length > 1) {
                    alertService.msgAlert("ks-cancle", "密码输入错误");
                }
                payPass = payPass + vm.focusModel[i].pass;
            }
            if (vm.payMsgStatus.status === 0) {
                // 修改旧的支付密码
                $http({
                    method: "POST",
                    url: appConfig.apiPath + "/user/isPayPass",
                    data: $httpParamSerializer({
                        pass: payPass
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(function (resp) {
                    if (resp.data && resp.data.code === "SUCCESS") {
                        vm.payPass.oldPass = payPass;
                        vm.payMsgStatus.status = 1;
                        vm.payMsgStatus.msg = "请输入新密码";
                        vm.initFocus(1, true);
                    }
                }, function () {
                    vm.initFocus(1, true);
                });

            } else if (vm.payMsgStatus.status === 1) {
                vm.payPass.newPass = payPass;
                vm.payMsgStatus.status = 2;
                vm.payMsgStatus.msg = "请再次确认支付密码";
                vm.initFocus(1, true);
            } else if (vm.payMsgStatus.status === 2) {
                vm.payPass.newPassTwo = payPass;
                // 最后一次输入,进行保存新的支付密码
                // $timeout(function () {
                vm.submitPayPass();
                // }, 2000);
            }
        };
        // 输入新的支付密码
        vm.submitPayPass = function () {
            if (vm.payPass.isPhone) {
                // 设置新的支付密码
                $http({
                    method: "POST",
                    url: appConfig.apiPath + "/user/findPayPass",
                    data: $httpParamSerializer({
                        regType: 'PHONE',
                        password1: vm.payPass.newPass,
                        password2: vm.payPass.newPassTwo,
                        phone: vm.userInfo.phone,
                        code: vm.payPass.code
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(function () {
                    if (vm.userInfo.pass === true) {
                        alertService.msgAlert("exclamation-circle", "支付密码重置成功");
                    } else {
                        alertService.msgAlert("exclamation-circle", "支付密码设置成功");
                    }

                    $timeout(function () {
                        $scope.fallbackPage();
                    }, 2000);
                }, function () {
                });
            } else {
                // 修改旧的支付密码
                $http({
                    method: "POST",
                    url: appConfig.apiPath + "/user/payPassword",
                    data: $httpParamSerializer({
                        newPass: vm.payPass.newPass,
                        newMore: vm.payPass.newPassTwo,
                        oldPass: vm.payPass.oldPass
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(function () {
                    if (vm.userInfo.pass === true) {
                        alertService.msgAlert("exclamation-circle", "支付密码重置成功");
                    } else {
                        alertService.msgAlert("exclamation-circle", "支付密码设置成功");
                    }
                    $timeout(function () {
                        $scope.fallbackPage();
                    }, 2000);
                }, function () {

                });
            }
        };

        vm.fsyzm = "发送验证码";
        //点击发送验证码，执行此函数
        vm.openDialogCode = function () {
            if (vm.waitShow) {
                return;
            }
            vm.fsyzm = 60 + 'S';
            //先判断手机号是否注册，未注册不可找回密码
            vm.intervalAccountTile();
        };


        // 发送完成 进行倒计时
        vm.intervalAccountTile = function () {
            var url = "account=" + vm.userInfo.phone + "&regType=PHONE";
            $http.get(appConfig.apiPath + "/user/sendCode?codeType=USER_REG&" + url)
                .success(function () {
                    vm.waitShow = true;
                    alertService.msgAlert("success", "已发送");
                    if ($rootScope.intervalStop) {
                        $interval.cancel($rootScope.intervalStop);//解除计时器
                    }
                    var i = 60;
                    $rootScope.intervalStop = $interval(function () {
                        i--;
                        vm.fsyzm = i + 'S';
                        if (i <= 0) {
                            vm.waitShow = false;
                            vm.fsyzm = "重新获取";
                            $interval.cancel($rootScope.intervalStop);//解除计时器
                            $rootScope.intervalStop = null;
                        }
                    }, 1000);
                })
                .error(function () {
                    vm.fsyzm = "重新获取";
                });

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
