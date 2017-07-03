(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            /**
             * 意见反馈
             */
            $stateProvider.state("main.more.feedBack", {
                url: '/feedBack?id&phone',
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(false, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/more/feedBack/index.root.html',
                        controller: feedBackController

                    }
                }
            });
        }]);
    feedBackController.$inject = ['$scope', '$log', 'curUser', '$http', '$state', '$httpParamSerializer', 'appConfig', 'alertService', "imgService", "wxService", "FileUploader", "$timeout"];
    function feedBackController($scope, $log, curUser, $http, $state, $httpParamSerializer, appConfig, alertService, imgService, wxService, FileUploader, $timeout) {

        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        var vm = this;

        $scope.simpleImg = imgService.simpleImg;
        $scope.imgUrl = appConfig.imgUrl;
        var ua = window.navigator.userAgent.toLowerCase();
        $scope.isWxClient = false;
        if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
            $scope.isWxClient = true;
            wxService.init();
        }


        $scope.phoneNum = curUser.data.userInfo.phone;
        vm.isPhoneNumTrue = true;

        //说明 里面 剩余字数实时变化
        //初始化
        $scope.numWords = 400;
        $scope.checkText = function () {
            if ($scope.memo.length > 400) {
                $scope.memo = $scope.memo.substr(0, 400);
            }
            //剩余字数
            $scope.numWords = 400 - $scope.memo.length;
        };

        /**
         * 限制手机号输入，只能输入以1开头的数字，不做正则验证
         */
        $scope.checkPhone = function () {
            var phone = $scope.phoneNum;
            //如果未输入
            if (!phone) {
                vm.isPhoneNumTrue = false;
                return -1;
            }
            //如果不是数字、不是以小数点结尾或者不是以1开头，抹去最后一位
            console.log();
            if (isNaN(phone) || phone.substr(0, 1) !== '1') {
                $scope.phoneNum = phone.substr(0, phone.length - 1);
                vm.isPhoneNumTrue = false;
                return -1;
            }
            //如果长度超过11，抹去最后一位
            if (phone.length > 11) {
                $scope.phoneNum = phone.substr(0, phone.length - 1);
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

        // 初始化图片
        $scope.imgs = [];
        $scope.uploadWx = function () {
            wxService.wxUploadImg().then(function (data) {
                var s = {};
                s.id = data.id;
                s.avatar = data.avatar;
                $scope.imgs.push(s);
            });
        };
        // 代替图片上传的点击,隐藏自己的控件
        $scope.uploaderFiles = function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                wxService.wxUploadImg(1).then(function (data) {
                    $scope.imgs.push(data);
                });
            } else {
                if ($scope.imgs.length < 3) {
                    angular.element("#uploaderFile").click();
                } else {
                    alertService.msgAlert("exclamation-circle", "最多上传3张");
                }
            }
        };
        var uploader = $scope.uploader = new FileUploader({
            url: appConfig.apiPath + '/common/uploadImgS',
            autoUpload: true
        });
        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function () {
                return this.queue.length < 30;
            }
        });
        uploader.onSuccessItem = function (fileItem, response) {
            var s = {};
            s.id = response.id;
            s.avatar = response.avatar;
            $scope.imgs.push(s);
        };

        // 删除图片
        $scope.removeOneImg = function (id) {
            for (var i = 0; i < $scope.imgs.length; i++) {
                if ($scope.imgs[i].id === id) {
                    //从当前的这个i起 删除一个(也就是删除本身)
                    $scope.imgs.splice(i, 1);
                    return;
                }
            }
        };

        // 提交本次评论
        $scope.submit = function () {
            var imgId = [];
            for (var i = 0; i < $scope.imgs.length; i++) {
                imgId.push($scope.imgs[i]);
            }

            if (!vm.isPhoneNumTrue) {
                return;
            }

            if (!$scope.memo) {
                alertService.msgAlert("exclamation-circle", "请编写反馈内容");
                return;
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + '/complain/submit',
                data: $httpParamSerializer({
                    msg: $scope.memo,
                    phone: $scope.phoneNum,
                    imgs: imgId
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                var data = resp.data;
                if (data.code === 'SUCCESS') {
                    alertService.msgAlert("success", "反馈成功");
                    $timeout(function () {
                        $scope.fallbackPage();
                    }, 1000);
                }
            }, function (resp) {
                var data = resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }
                $log.log("服务器开小差去了");
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