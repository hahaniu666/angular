(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 个人信息/绑定手机号
         */
        $stateProvider.state("main.user.bindPhone", {
            url: "/bindPhone",
            views: {
                "@": {
                    templateUrl: 'views/main/user/bindPhone/index.root.html',
                    controllerAs: 'vm',
                    controller: bindPhoneController
                }
            }
        });
    }]);
    bindPhoneController.$inject = ['$http', 'curUser', '$httpParamSerializer', '$state', "$interval", 'appConfig', "alertService"];
    function bindPhoneController($http, curUser, $httpParamSerializer, $state, $interval, appConfig, alertService) {
        var vm = this;
        vm.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        vm.gotoTop();
        vm.curUser = curUser.data;

        vm.user = {
            phone: "",
            password: "",
            code: "",
            oldphone: ""
        };
        if (vm.curUser.userInfo.phone) {
            vm.user.oldphone = vm.curUser.userInfo.phone;
            // 如果有值则显示修改
            vm.userphoneTitle = "更换手机号";
            vm.status = "您已绑定手机";
            vm.myphone = vm.user.oldphone.substr(3,4);
            vm.user.hidephone = vm.user.oldphone.replace(vm.myphone,"****");
        } else {
            vm.user.oldphone = "请绑定手机号";
            // 如果是新增 直接进行新增页面
            vm.userphoneTitle = "绑定手机号";
            vm.status = "";
        }
        //输入新的手机号判断是否已经被注册过,是的话提示已被注册,并且发送验证码为不可点击
        vm.PHONE_REGEXP = /^[\d]{11}$/i;

        vm.fsyzm = "发送验证码";
        vm.waitShow = false;

        // 发送完成 进行倒计时
        var intervalStop = undefined;
        vm.btnState = true;     //控制按钮是否可点击
        vm.intervalAccountTile = function () {
            vm.user.register = true;
            vm.waitShow = true;
            alertService.msgAlert("success", "已发送");
            var i = 60;
            vm.btnState = false;
            intervalStop = $interval(function () {
                i--;
                vm.fsyzm = i + 'S';
                if (i <= 0) {
                    vm.waitShow = false;
                    vm.fsyzm = "重新获取";
                    $interval.cancel(intervalStop);//解除计时器
                    intervalStop = undefined;
                    vm.btnState = true;
                }
            }, 1000);
        };
        vm.openDialogCode = function () {
            if (!vm.btnState) {
                return;
            }
            if (!vm.user.phone) {
                alertService.msgAlert("exclamation-circle", "请输入手机号码");
                return;
            }
            //当手机号没填或者格式错误
            if (!vm.PHONE_REGEXP.test(vm.user.phone)) {
                alertService.msgAlert("exclamation-circle", "请正确输入手机号码");
                return;
            }
            var accountopen = "phone=" + vm.user.phone;
            vm.fsyzm = "";
            // 先行判断手机号码是否可以注册
            $http({
                method: 'GET',
                url: appConfig.apiPath + "/user/ifAccountExists?" + accountopen
            }).then(function () {
                vm.fsyzm = "发送验证码";
                // 发送验证码


                $http({
                    method: 'GET',
                    url: appConfig.apiPath + "/user/sendCode?codeType=USER_REG&" + url
                }).then(function () {
                    vm.intervalAccountTile();
                }, function () {
                    vm.fsyzm = "重新获取";
                });
            }, function () {
                vm.waitShow = false;
                vm.fsyzm = "发送验证码";
            });
        };
        // 修改手机号码
        vm.phonePush = function () {
            //当没填写账户密码的时候
            if (!vm.user.password) {
                alertService.msgAlert("exclamation-circle", "请输入当前账户密码");
                return;
            }
            //当手机号没填或者格式错误
            if (!vm.PHONE_REGEXP.test(vm.user.phone)) {
                alertService.msgAlert("exclamation-circle", "请正确输入手机号码");
                return;
            }
            //当没填写验证码的时候
            if (!vm.user.code) {
                alertService.msgAlert("exclamation-circle", "请输入验证码");
                return;
            }

            //都正确 然后提交
            $http({
                method: "POST",
                url: appConfig.apiPath + '/user/updateUserInfo', notShowError: true,
                data: $httpParamSerializer({
                    phone: vm.user.phone,
                    code: vm.user.code,
                    password: vm.user.password
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                var data = resp.data;
                vm.curUser.userInfo.phone = data.userInfo.phone;
                alertService.msgAlert("success", "绑定成功");
                vm.fallbackPage();
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                    return;
                }
            });
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