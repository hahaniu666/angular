(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单初次申请退货
         */
        $stateProvider.state("main.rentOrder.refund", {
            url: '/refund?id&rentOrder',
            views: {
                "@": {
                    templateUrl: 'views/main/rentOrder/refund/index.root.html',
                    controller: refundController
                }
            }
        });
    }]);
    refundController.$inject = ['$scope', '$http', '$state', '$httpParamSerializer', 'appConfig', 'alertService', "imgService", "wxService", "FileUploader", "$filter"];
    function refundController($scope, $http, $state, $httpParamSerializer, appConfig, alertService, imgService, wxService, FileUploader, $filter) {
        $scope.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.simpleImg = imgService.simpleImg;
        $scope.itemImg = imgService.itemImg;
        $scope.imgUrl = appConfig.imgUrl;
        var ua = window.navigator.userAgent.toLowerCase();
        $scope.isWxClient = false;
        if (ua.match(/MicroMessenger/i)) {
            $scope.isWxClient = true;
            wxService.init();
        }
        // 评论的预览图片
        $scope.imgPreviewReply = function (reply, img) {
            var imgs = [];
            for (var n = 0; n < reply.length; n++) {
                imgs.push($scope.imgUrl + reply[n].avatar +
                    "?imageView2/1/w/" + $scope.itemImg.w + "/h/" + $scope.itemImg.h);
            }
            var imgUrl = $scope.imgUrl + img +
                "?imageView2/1/w/" + $scope.itemImg.w + "/h/" + $scope.itemImg.h;
            wx.previewImage({
                current: imgUrl, // 当前显示图片的http链接
                urls: imgs // 需要预览的图片http链接列表
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
        // 当前是否选择了订单
        if (!$state.params.id) {
            // 参数未传完整,直接跳回我的订单处
            $scope.fallbackPage();
            return;
        }
        // 初始化退租日期,加上3天的日期
        var dates = new Date();
        $scope.endDate = new Date(dates.getFullYear(), dates.getMonth(), dates.getDate() + 3);

        $scope.changeDate = function () {

            var beginDate = $scope.refund.beginDate.getTime() - $scope.endDate.getTime();
            if (beginDate > 0) {
                $scope.endDate = $scope.refund.beginDate;
            }
            var time = $scope.refund.endDate.getTime() - $scope.endDate.getTime();
            if (time < 0) {
                $scope.refund.refundPrice = 0;
                return;
            }
            var date = parseInt(time / (24 * 3600 * 1000));
            $scope.refund.refundPrice = date * $scope.refund.price;
            if ($scope.refund.refundPrice > $scope.refund.payment) {
                $scope.refund.refundPrice = $scope.refund.payment;
            }
        };

        $http({
            method: 'GET',
            url: appConfig.apiPath + "/rentOrder/refundItemDetail?id=" + $state.params.id
        }).then(function (resp) {
            var data = resp.data;
            $scope.refund = data;
            $scope.refund.endDate = new Date($filter("date")($scope.refund.endDate, "yyyy-MM-dd"));
            $scope.refund.beginDate = new Date($filter("date")($scope.refund.beginDate, "yyyy-MM-dd"));
            $scope.changeDate();
        }, function (resp) {
            var data = resp.data;
            if (data.code === "NOT_LOGINED") {
                $state.go("main.newLogin", {backUrl: window.location.href});
            }
        });

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
        // 默认退货退款
        $scope.type = "GOOGS_AND_MONEY";
        $scope.orderRefund = function () {
            if (!$scope.refund.reason || $scope.refund.reason === "") {
                alertService.msgAlert("exclamation-circle", "请填写退货原因");
                return;
            }
            if (!$scope.refund.endDate) {
                alertService.msgAlert("exclamation-circle", "请选择退租时间");
                return;
            }
            var imgsTemp = [];
            for (var i = 0; i < $scope.imgs.length; i++) {
                imgsTemp.push($scope.imgs[i].id);
            }
            // 将价格转为分传入
            $scope.maxBranchPrice = $scope.refund.price * 100;
            /*alertService.confirm(null, "确认提交并返回等待员工审核", "")*/
            alertService.confirm(null, "", "确认提交并返回等待员工审核", "取消", "确定").then(function (data) {
                if (data) {
                    var date = $filter("date")($scope.endDate, "yyyy-MM-dd");
                    // 申请退货,
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/rentOrder/refund',
                        data: $httpParamSerializer({
                            reason: $scope.refund.reason,
                            endDate: date,
                            rentItemId: $scope.refund.orderId,
                            rentOrderId: $state.params.rentOrder,
                            imgs: imgsTemp,
                            memo: $scope.memo
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).success(function () {
                        $scope.fallbackPage();
                        //console.log(data)
                    }).error(function (data) {
                        if (data.code === "NOT_LOGINED") {
                            $state.go("main.newLogin", {backUrl: window.location.href});
                        }
                    });
                }
            });
        };
        ////测试
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
            if ($scope.imgs.length <= 3) {
                angular.element("#uploaderFile").click();
            } else {
                alertService.msgAlert("exclamation-circle", "最多上传3张");
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
    }
})();