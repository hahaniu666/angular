(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 个人信息/新用户无电子邮箱时绑定电子邮箱
         */
        $stateProvider.state("main.user.bindEmail", {
            url: "/bindEmail",
            views: {
                "@": {
                    templateUrl: 'views/main/user/bindEmail/index.root.html',
                    controllerAs: "vm",
                    controller: bindEmailController
                }
            }
        });
    }]);
    bindEmailController.$inject = ['$interval', '$http', '$state', '$httpParamSerializer', 'appConfig', 'curUser', "alertService"];
    function bindEmailController($interval, $http, $state, $httpParamSerializer, appConfig, curUser, alertService) {
        var vm = this;
        vm.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        vm.gotoTop();
        vm.curUser = curUser.data;

        vm.user = {
            email: "",
            password: "",
            code: "",
            oldemail: ""
        };
        if (vm.curUser.userInfo.email) {
            vm.user.oldemail = vm.curUser.userInfo.email;
            // 如果有值则显示修改
            vm.titleNames = "更换邮箱";
            vm.status = "您已绑定邮箱";
            vm.isLength=1;
            vm.a = vm.curUser.userInfo.email.indexOf("@")-1;
            if(vm.a>3) {
                vm.isLength = parseInt(vm.a / 2);
            }
            vm.myemail = vm.curUser.userInfo.email.substr(vm.isLength,2);
            vm.curUser.hideemail = vm.curUser.userInfo.email.replace(vm.myemail,"****");
        } else {
            vm.user.oldemail = "请绑定邮箱";
            // 如果是新增 直接进行新增页面
            vm.titleNames = "绑定邮箱";
            vm.status = "";
        }
        //输入新的手机号判断是否已经被注册过,是的话提示已被注册,并且发送验证码为不可点击
        vm.EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
        vm.fsyzm = "发送验证码";

        vm.waitShow = false;
        //////////////  打开发送验证码的界面
        // 发送完成 进行倒计时
        var intervalStop = undefined;
        vm.btnState = true;
        vm.intervalAccountTile = function () {
            vm.user.register = true;
            vm.waitShow = true;
            alertService.msgAlert("success", "已发送");
            ////
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
            if (!vm.user.email) {
                alertService.msgAlert("exclamation-circle", "请输入邮箱号码");
                return;
            }
            //当邮箱没填或者格式错误
            if (!vm.EMAIL_REGEXP.test(vm.user.email)) {
                alertService.msgAlert("exclamation-circle", "请正确输入邮箱地址");
                return;
            }
            var accountopen = "email=" + vm.user.email;
            vm.fsyzm = "";
            // 先行判断邮箱是否可以注册

            $http({
                method: 'GET',
                url: appConfig.apiPath + "/user/ifAccountExists?" + accountopen
            }).then(function () {
                vm.fsyzm = "发送验证码";
                var url = "?codeType=USER_REG&account=" + vm.user.email + "&regType=EMAIL";
                $http({
                    method: 'GET',
                    url: appConfig.apiPath + "/user/sendCode" + url
                }).then(function () {
                    vm.intervalAccountTile();
                }, function () {
                    vm.fsyzm = "重新获取";
                });
            }, function (resp) {
                var data = resp.data;
                vm.waitShow = false;
                vm.fsyzm = "发送验证码";
                if (data.msg === ("该手机号已经存在" || "该邮箱已经存在")) {
                    vm.PEGXALL = false;
                }
            });
        };
        // 修改手机号码
        vm.phonePush = function () {
            //当没填写账户密码的时候
            if (!vm.user.password) {
                alertService.msgAlert("exclamation-circle", "请输入当前账户密码");
                return;
            }
            //当邮箱没填或者格式错误
            if (!vm.EMAIL_REGEXP.test(vm.user.email)) {
                alertService.msgAlert("exclamation-circle", "请正确输入邮箱地址");
                return;
            }
            if (!vm.user.code) {
                alertService.msgAlert("exclamation-circle", "请输入验证码");
                return;
            }
            //都正确 然后提交
            $http({
                method: "POST",
                url: appConfig.apiPath + '/user/updateUserInfo', notShowError: true,
                data: $httpParamSerializer({
                    email: vm.user.email,
                    code: vm.user.code,
                    password: vm.user.password
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                var data = resp.data;
                vm.curUser.userInfo.email = data.userInfo.email;
                alertService.msgAlert("success", "绑定成功");
                vm.fallbackPage();
            },function (resp) {
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