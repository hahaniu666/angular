(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 注册
         */
        $stateProvider.state("main.register", {
            url: '/register?s&inviterId&backUrl&forget',
            views: {
                "@": {
                    templateUrl: 'views/main/register/index.root.html',
                    controller: RegisterController
                }
            }
        });
    }]);
    // ----------------------------------------------------------------------------
    RegisterController.$inject = ['$interval', '$scope', '$http',  '$state', '$httpParamSerializer', 'appConfig', "alertService",  '$mdDialog'];
    function RegisterController($interval, $scope, $http,  $state, $httpParamSerializer, appConfig, alertService,  $mdDialog) {


        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        var vm = this;

        //图片
        var date = new Date().getTime();
        vm.tokenImg = appConfig.tokenImg + "?s=" + date;

        vm.isPhoneNumTrue = false;
        // 用户注册信息
        $scope.user = {
            phone: '',
            code: '',
            password: '',
            register: true,
            type: 'password',
            icon: 'eye-o'
        };

        $scope.forgetReigster = {forget: false, title: "注册", value: "注册"}
        if ($state.params.forget === 'true') {
            $scope.forgetReigster = {forget: true, title: "找回密码", value: "确定"}
            $scope.user.register = false;
        }
        //操作步骤
        $scope.step = 1;
        // 回退页面
        $scope.fallbackPage = function () {
            if ($scope.step === 2 && !$scope.isLogin) {
                $scope.step = 1;
                $scope.refresh();
                $scope.user.phone = '';
                $scope.user.imgCode = '';
                return;
            }
            if ($scope.isLogin && $state.params.backUrl) {
                // 登陆成功才能返回刚才的url
                var urldecode = decodeURIComponent($state.params.backUrl);
                location.href = urldecode;
            } else if ($scope.isLogin) {
                $state.go("main.center", null, {reload: true});
                return;
            } else if ($state.params.s === "index") {
                $state.go("main.index", null, {reload: true});
                return;
            } else if (history.length <= 2) {
                $state.go("main.index", null, {reload: true});
                return;
            } else {
                history.back();
            }
        };
        //首次加载
        // 进行注册/或找回密码
        $scope.register = function () {
            if ($scope.user.password.length < 6) {
                alertService.msgAlert("cancle", "密码太短");
                return;
            }
            if ($scope.user.code.length != 6) {
                alertService.msgAlert("exclamation-circle", "请输入6位验证码");
                return;
            }
            $scope.user.inviterId = $state.params.inviterId;
            $http({
                method: "POST",
                url: appConfig.apiPath + '/user/registerPhone',
                data: $httpParamSerializer($scope.user),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data, status, headers, config) {
                // 判断 state的params 中 srcState 有没有，没有则返回到主页
                // 需要注意： $state.go(srcState,{},{reload:true})

                if ($state.params.forget) {
                    alertService.msgAlert("success", "找回成功,请登录");
                    //跳转到登录页
                    $state.go("main.newLogin");
                } else {
                    alertService.msgAlert("success", "注册成功");
                    //注册成功默认登录到首页/我的
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/j_spring_security_check',
                        data: $httpParamSerializer({
                            j_username: $scope.user.phone,
                            j_password: $scope.user.password
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).success(function (data, status, headers, config) {
                        // 判断 state的params 中 srcState 有没有，没有则返回到主页
                        // 需要注意： $state.go(srcState,{},{reload:true})

                        $scope.isLogin = true;
                        $scope.fallbackPage();
                    });
                }


            });
        };
        // 清除数据
        $scope.clearText = function (num) {
            if (num === 1) {
                $scope.user.phone = "";
            } else if (num === 2) {
                $scope.user.code = "";
            } else {
                $scope.user.password = "";
            }
        }
        //闭眼睛
        $scope.changeEyes = function (type) {
            if (type === "password") {
                $scope.user.type = "text";
                $scope.user.icon = "eye";
            } else {
                $scope.user.type = "password";
                $scope.user.icon = "eye-o";
            }
        }


        $scope.waitShow = false;

        /**
         * 打开验证码弹窗，弹窗的变量都用vm.xxxx，非弹窗的都用$scope.xxxx
         * @param ev
         */
        $scope.openPhoneCode = function (ev) {
            // 进行发送验证码
            $mdDialog.show({
                    templateUrl: 'views/main/register/dialog/index.root.html',
                    parent: angular.element(document.body).find('#qh-wap'),
                    //targetEvent: ev,
                    clickOutsideToClose: true,
                    //fullscreen: false,
                    controllerAs: "vm",
                    controller: ['alertService', function (alertService) {
                        var vm = this;
                        vm.cancel = function () {
                            $mdDialog.hide(false);
                        };
                        vm.answer = function () {
                            var answer = vm.imgCode;
                            $mdDialog.hide(answer);
                        };

                        //
                        vm.tokenImg = appConfig.tokenImg;
                        // 刷新验证码
                        vm.refresh = function () {
                            var date = new Date().getTime();
                            vm.tokenImg = appConfig.tokenImg + "?s=" + date;
                        };
                        vm.refresh();
                    }]
                })
                .then(function (answer) {
                    if (answer) {
                        $scope.user.imgCode = answer;
                        $scope.getSmsCode();
                    }
                });
        }

        //限制手机号输入，只能输入以1开头的数字，不做正则验证
        $scope.checkPhone = function () {
            var phone = $scope.user.phone;
            //如果未输入
            if (!phone) {
                vm.isPhoneNumTrue = false;
                return -1;
            }
            //如果不是数字、不是以小数点结尾或者不是以1开头，抹去最后一位
            if (isNaN(phone) || phone.substr(-1) == '.' || phone.substr(0, 1) != 1) {
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
            if (phone.length != 11) {
                vm.isPhoneNumTrue = false;
                return -1;
            }
            vm.isPhoneNumTrue = true;
            return 0;
        }


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
            $scope.openPhoneCode(ev);       //打开弹窗
        };


        // 发送完成 进行倒计时
        var intervalStop = undefined;
        $scope.intervalAccountTile = function () {
            $scope.step = 2;
            $scope.waitShow = true;
            alertService.msgAlert("success", "已发送");
            if (intervalStop) {
                $interval.cancel(intervalStop);//解除计时器
            }
            var i = 60;
            intervalStop = $interval(function () {
                i--;
                $scope.fsyzm = i + 'S';
                if (i <= 0) {

                    $scope.waitShow = false;
                    $scope.fsyzm = "重新获取";
                    $interval.cancel(intervalStop);//解除计时器

                    intervalStop = undefined;
                }
            }, 1000);

        }

        // 校验图形验证码并获取短信验证码
        $scope.getSmsCode = function () {
            $scope.checkPhone();
            if (!vm.isPhoneNumTrue) {
                alertService.msgAlert("cancle", "请输入正确的手机号码");
                return;
            }
            if ($scope.forgetReigster.forget) {
                //忘记密码，直接发送验证码
                $scope.sentSms();
            } else {
                //注册，先校验帐号是否存在
                var accountopen = "phone=" + $scope.user.phone;
                $http.get(appConfig.apiPath + "/user/ifAccountExists?" + accountopen)
                    .success(function (data, status, headers, config) {
                        $scope.sentSms();
                    })
                    .error(function (data, status, headers, config) {
                        $scope.waitShow = false;
                        $scope.fsyzm = "重新发送";
                        if (data.msg === "该手机号已经存在") {
                            $scope.phoneEmailerror = true;
                            $scope.PEGXALL = false;
                        }
                        else if (data.msg === "该邮箱已经存在") {
                            $scope.phoneEmailerror = true;
                            $scope.PEGXALL = false;
                        }
                    });
            }
        };

        /**真正的发短信操作**/
        $scope.sentSms = function () {
            var url = "account=" + $scope.user.phone + "&regType=PHONE&picCode=" + $scope.user.imgCode;
            var codeType = "USER_REG";
            var param = "sendVerifyCodeNew";
            if ($scope.forgetReigster.forget) {
                codeType = "PASSWORD_RETRIEVE";
            }
            $http.get(appConfig.apiPath + "/user/" + param + "?codeType=" + codeType + "&" + url)
                .success(function (data, status, headers, config) {
                    $scope.intervalAccountTile();
                })
                .error(function (data, status, headers, config) {
                    $scope.refresh();
                    $scope.user.imgCode = '';
                });
        }

        //刷新图形验证码
        $scope.refresh = function () {
            var date = new Date().getTime();
            $scope.tokenImg = appConfig.tokenImg + "?s=" + date;
        };
        $scope.refresh();

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
    }

})();
