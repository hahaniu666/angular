(function () {
    angular.module('qh-test-front')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state("main.groupOrder.startGroup", {
                url: "/startGroup?unionGroupOrderId&id&payId&skuId&orgId;",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/groupOrder/startGroup/index.root.html',
                        controller: startGroupController,
                        controllerAs: "vm"
                    }
                },
                // onEnter: function () {
                //     alert(1)
                // },
                // onExit: function () {
                //     alert(2)
                // }
            });
        }]);

    // ----------------------------------------------------------------------------
    startGroupController.$inject = ['$scope', '$http', '$state', 'appConfig', '$cookies', '$rootScope', "imgService", '$interval', '$filter', 'wxService', 'userService', 'alertService'];
    function startGroupController($scope, $http, $state, appConfig, $cookies, $rootScope, imgService, $interval, $filter, wxService, userService, alertService) {

        console.log("======================controller");


        $state.go('main.groupOrder.startGroup', {reload: true});
        var vm = this;
        $cookies.orgId = '584662c0dc8d4c2a21c37234';
        vm.unionGroupOrderId = $state.params.unionGroupOrderId;
        vm.id = $state.params.id;
        vm.payId = $state.params.payId;
        $rootScope.intervalStop = [];
        vm.skuId = $state.params.skuId;
        vm.imgUrl = appConfig.imgUrl;
        vm.slideImg = imgService.slideImg;
        vm.simpleImg = imgService.simpleImg;
        vm.itemImg = imgService.itemImg;
        vm.orgId = $state.params.orgId;
        vm.isLeader = false;
        vm.orgId = $state.params.orgId;
        vm.getDetail = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/groupOrder/groupStatus",
                params: {
                    qhPayId: vm.payId
                }
            }).then(function (resp) {
                vm.groupImg = resp.data;
                vm.groupOrders = resp.data.currentGroupOrder;
                vm.groupOrders.activityCheck = {};
                vm.leaveNum = vm.groupOrders.groupNum - vm.groupOrders.curSize;
                vm.comments = new Array(vm.leaveNum);
                if (vm.groupOrders.userId == userService.curUser.data.userInfo.userId) {
                    vm.isLeader = true;
                }
                if (wxService.isInWx()) {
                    $scope.$on("$destory", function () {
                        wxService.shareRing(); // 恢复默认绑定
                        wxService.shareFriend();
                    });
                    var link = location.href.replace(/startGroup/, 'group');
                    var finalLing = link + '&unionGroupOrderId=' + vm.groupOrders.unionGroupOrderId;
                    var curConf = {
                        title: vm.groupOrders.sku.title, // 分享标题
                        desc: vm.groupOrders.sku.description,
                        link: finalLing,
                        imgUrl: 'https:' + appConfig.imgUrl + vm.groupOrders.img, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            alertService.msgAlert('exclamation-circle', "取消分享");
                        }
                    };
                    wxService.initShareOnStart(curConf);
                }


            });
        };
        vm.getDetail();

        // if (!vm.groupOrders.payTime) {
        //     alertService.msgAlert("exclamation-circle", "支付时间错误");
        //     return;
        // }
        $rootScope.intervalStop = $interval(function () {
            var now = new Date().getTime();
            var payTime = new Date($filter("date")(vm.groupOrders.payTime, "yyyy/MM/dd HH:mm:ss")).getTime();
            var overTime = payTime + 24 * 60 * 60 * 1000;
            // 倒计时到零时，停止倒计时
            var rest = overTime - now;
            if (rest <= 0) {
                vm.detail.activityCheck = null;
                $interval.cancel($rootScope.intervalStop);
                $rootScope.intervalStop = null;
                return;
            }
            var leftsecond = parseInt(rest / 1000);
            var day1 = Math.floor(leftsecond / (60 * 60 * 24));
            var hour1 = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
            var minute1 = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour1 * 3600) / 60);
            var second1 = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour1 * 3600 - minute1 * 60);
            vm.groupOrders.activityCheck.day = day1;
            vm.groupOrders.activityCheck.hour = hour1;
            vm.groupOrders.activityCheck.minute = minute1;
            vm.groupOrders.activityCheck.second = second1;
        }, 1000);
        // link = location.href;
        // console.log('link.indexOf("startGroup") ', link.indexOf("startGroup"));
        // if (link.indexOf("startGroup") >= 0) {
        //     link = location.href.replace(/startGroup/, 'group');
        //     alert(link);
        // }
        // console.log('vm.unionGroupOrderId ==', vm.unionGroupOrderId);
        // console.log('vm.id ==', vm.id);
        // console.log('vm.payId ==', vm.payId);
        // console.log('location.href', location.href);


        // var finalLing = 'www.baidu.com';
        //
        // console.log('userService.curUser.data.userInfouserId', userService.curUser.data.userInfo.userId);
        // vm.calTime = function (year, month, day) {
        //     if (vm.endDate < vm.startDate) {
        //         window.clearInterval(timer);
        //         return;
        //     }
        //     vm.startDate = new Date();
        //     vm.endDate = new Date(year, month - 1, day);
        //     vm.remainingTime = vm.endDate.getTime() - vm.startDate.getTime();
        //     vm.remainingSecond = parseInt(vm.remainingTime / 1000);
        //     vm.day = Math.floor(vm.remainingSecond / (60 * 60 * 24));
        //     vm.hour = Math.floor((vm.remainingSecond - vm.day * 24 * 60 * 60) / 3600);
        //     vm.minute = Math.floor((vm.remainingSecond - vm.day * 24 * 60 * 60 - vm.hour * 3600) / 60);
        //     vm.second = Math.floor(vm.remainingSecond - vm.day * 24 * 60 * 60 - vm.hour * 3600 - vm.minute * 60);
        //     $scope.$digest();
        //     console.log('vm.startDate===>>>', vm.startDate);
        //     console.log('vm.endDate===>>>', vm.endDate);
        // };
        //
        // var timer = window.setInterval(function () {
        //     vm.calTime(2017, 5, 27);
        // }, 1000);
        //
        // $scope.aaa = function () {
        //     window.clearInterval(timer);
        // };

        // console.log('userService', userService);
        // console.log('vm.unionGroupOrderId ==', vm.unionGroupOrderId);
        // console.log('vm.id ==', vm.id);
        // console.log('vm.payId ==', vm.payId);
        // console.log('location.href', location.href);
        // link = location.href.replace(/startGroup/, 'group');
        // console.log('link', link);
        // var finalLing = link + '&unionGroupOrderId=' + vm.groupOrders.unionGroupOrderId;
        // console.log('finalLing', finalLing);
        //
        // wxService.shareFriend('', finalLing);

        /**
         * 初始化微信
         */
        // vm.initWx = function () {
        //     $http.get(appConfig.apiPath + '/weiXin/jsSdkConf', {
        //         params: {
        //             url: location.href.split('#')[0]
        //         }
        //     }).then(function (resp) {
        //         resp.data.jsApiConf.debug = false;
        //         console.log("已经获取了微信JS SDK 的配置对象", resp.data.jsApiConf);
        //         wx.config(resp.data.jsApiConf);
        //         wx.isConfig = true;
        //         wx.error(function (res) {
        //             console.info("微信调用出错了 ", res);
        //         });
        //
        //
        //     });
        // };
        // vm.initWx();
        //
        //
        // $http.get(appConfig.apiPath + "/common/sysConf?key=wxShareTimeLineConfig")
        //     .then(function (resp) {
        //         console.log(resp);
        //     }, function (resp) {
        //         console.log(resp);
        //     });
        // /*
        //  * 取出backurl
        //  * */
        // var link;
        // setTimeout(function () {
        //     console.log('location.href', location.href);
        //     link = location.href.replace(/startGroup/, 'group');
        //     console.log('link', link);
        //     var finalLing = link + '&unionGroupOrderId=' + vm.groupOrders.unionGroupOrderId;
        //     console.log('finalLing', finalLing);
        //     wx.onMenuShareAppMessage({
        //         title: 'sfsfdsf', // 分享标题
        //         desc: 'sfdfgdfg', // 分享描述
        //         link: finalLing, // 分享链接
        //         imgUrl: '', // 分享图标
        //         type: '', // 分享类型,music、video或link，不填默认为link
        //         dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        //         success: function () {
        //             // 用户确认分享后执行的回调函数
        //             alert(111)
        //         },
        //         cancel: function () {
        //             // 用户取消分享后执行的回调函数
        //             alert(222)
        //         }
        //     });
        // }, 1000);


        // var imgUrl = 'http://topic.xcar.com.cn/201403/ad_q3/pic/banner.jpg';
        // var lineLink = 'http://topic.xcar.com.cn/201403/ad_q3/index.php';
        // var descContent = "http://topic.xcar.com.cn/201403/ad_q3/index.php";
        // var shareTitle = '【奥迪Q3开启尊享礼遇季】报名试驾，赢取精美礼品';
        // var appid = 'wxc9937e3a66af6dc8';


        //遮罩打开与关闭
        vm.mask = false;
        vm.maskShow = function () {
            vm.mask = true;
        };
        vm.maskHide = function () {
            vm.mask = false;
        };

        // 回退页面
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", {orgId: '584662c0dc8d4c2a21c37234'}, {reload: true});
            } else {
                history.go(-2);
            }
        };
    }
})();