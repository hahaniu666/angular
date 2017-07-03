(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单详情
         */
        $stateProvider.state("main.order.refundDetail", {
            url: '/refundDetail?id',
            views: {
                "@": {
                    templateUrl: 'views/main/order/refundDetail/index.root.html',
                    controller:refundDetailController
                }
            }
        });
    }]);
    refundDetailController.$inject=['$scope', '$http', '$state', '$httpParamSerializer', 'appConfig', 'imgService', 'alertService', '$mdDialog'];
    function refundDetailController($scope, $http, $state, $httpParamSerializer, appConfig, imgService, alertService, $mdDialog) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.maxSize = appConfig.maxSize;  //页面展示页数
        $scope.pageSize = appConfig.pageSize;  //页面展示条数
        $scope.imgUrl = appConfig.imgUrl;  // 图片地址的URL
        $scope.simpleImg = imgService.simpleImg;
        $scope.itemImg = imgService.itemImg;
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        if (!$state.params.id) {
            $scope.fallbackPage();
        }
        // 评论的预览图片
        $scope.imgPreviewReply = function (reply, img) {
            var imgs = [];
            for (var n = 0; n < reply.length; n++) {
                imgs.push($scope.imgUrl + reply[n].key +
                    "?imageView2/1/w/" + $scope.itemImg.w + "/h/" + $scope.itemImg.h);
            }
            var imgUrl = $scope.imgUrl + img +
                "?imageView2/1/w/" + $scope.itemImg.w + "/h/" + $scope.itemImg.h;
            wx.previewImage({
                current: imgUrl, // 当前显示图片的http链接
                urls: imgs // 需要预览的图片http链接列表
            });
        };
        // 查询最新详情
        $scope.queryDetail = function () {
            $http({
                method:'GET',
                url:appConfig.apiPath + '/unionOrder/refundDetail?id=' + $state.params.id
            }).then(function (resp) {
                var data=resp.data;
                $scope.refund = data;
            },function (resp) {
                var data=resp.data;
                if (data.code === "NOT_LOGINED") {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                }

            });
        };
        $scope.queryDetail();
        /**
         * 取消本次退货
         */
        $scope.cancelRefund = function () {
            /*alertService.confirm(null, "确定取消本次申请")*/
            alertService.confirm(null, "", "确定取消本次申请?", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/unionOrder/cancelRefund',
                        data: $httpParamSerializer({id: $scope.refund.id}),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).success(function () {
                        alertService.msgAlert("success", "取消成功");
                        $scope.queryDetail();
                    }).error(function (data) {
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                }
            });
        };
        //填写物流打开模态窗口
        $scope.logistics = function () {
            $mdDialog.show({
                    templateUrl: 'views/main/order/refundDetail/logistics/index.root.html',
                    parent: angular.element(document.body).find('#qh-wap'),
                    targetEvent: null,
                    clickOutsideToClose: true,
                    fullscreen: false,
                    controller: [function () {
                        var vm = this;
                        vm.imgs = [];
                        vm.refund = $scope.refund;
                        var ua = window.navigator.userAgent.toLowerCase();
                        vm.isWxClient = false;
                        if (ua.match(/MicroMessenger/i)) {
                            vm.isWxClient = true;
                        }
                        // 删除图片
                        vm.removeImg = function (id) {
                            for (var i = 0; i < $scope.imgs.length; i++) {
                                if ($scope.imgs[i].id === id) {
                                    $scope.imgs.splice(i, 1);
                                    //从当前的这个i起 删除一个(也就是删除本身)
                                    return;
                                }
                            }
                        };
                        // 获取所有物流商的名称和缩写

                        $http({
                            method:'GET',
                            url:appConfig.apiPath + '/serviceOrder/getLogistics'
                        }).then(function (resp) {
                            var data = resp.data;
                            vm.logistics = data;
                        },function () {

                        });
                        //发货
                        vm.submitLogistics = function () {
                            var imgId = [];
                            for (var i = 0; i < vm.imgs.length; i++) {
                                imgId.push(vm.imgs[i].id);
                            }
                            $http({
                                method: "POST",
                                url: appConfig.apiPath + '/order/refundExpressNo',
                                data: $httpParamSerializer({
                                    status: vm.logisticsCheck,
                                    expressNo: vm.textLogistics,
                                    imgs: imgId,
                                    id: vm.refund.id
                                }),
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                                }
                            }).success(function () {
                                $mdDialog.hide(true);
                            });
                        };
                        // 上传的预览图片
                        vm.cancel = function () {
                            $mdDialog.cancel();
                        };
                    }],
                    controllerAs: "vm"
                })
                .then(function (answer) {
                    if (answer) {
                        alertService.msgAlert("success", "填写成功");
                        $scope.queryDetail();
                    }
                }, function () {
                });
        };

        // 重新申请
        $scope.repeatRefund = function () {
            if ($scope.refund.typeName === 'GOOGS_AND_MONEY') {
                $state.go("main.order.refund", {
                    no: $scope.refund.no,
                    orderId: $scope.refund.orderId
                }, {reload: true});
            } else {
                $state.go("main.rentOrder.refund", {
                    id: $scope.refund.orderId
                }, {reload: true});
            }
        };

    }
})();