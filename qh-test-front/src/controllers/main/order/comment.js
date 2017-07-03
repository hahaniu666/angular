(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 评价订单
         */
        $stateProvider.state("main.order.comment", {
            url: '/comment?orderId&rentOrder&orgOrder&groupOrder',
            views: {
                "@": {
                    controller: 'orderCommentController',
                    templateUrl: 'views/main/order/comment/index.root.html'
                }
            }
        });
    }]);
    angular.module('qh-test-front')
        .controller('orderCommentController',
            ['$scope', '$http', '$state', '$log', "$element", "$timeout", 'appConfig', "alertService", 'imgService', 'wxService', 'FileUploader',
                function ($scope, $http, $state, $log, $element, $timeout, appConfig, alertService, imgService, wxService, FileUploader) {
                    $scope.gotoTop = function () {
                        window.scrollTo(0, 0);//滚动到顶部
                    };
                    $scope.gotoTop();
                    $scope.orderId = $state.params.orderId;
                    $scope.rentOrder = $state.params.rentOrder;
                    $scope.orgOrder = $state.params.orgOrder;
                    $scope.groupOrder = $state.params.groupOrder;
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
                    if (!$scope.orderId && !$scope.rentOrder && !$scope.orgOrder && !$scope.groupOrder) {
                        console.log($scope.groupOrder);


                        // $scope.fallbackPage();
                        return;
                    }
                    // 判断是哪个URl来的
                    $scope.url = {url: "/order", id: $scope.orderId};
                    if ($scope.rentOrder) {
                        $scope.url = {url: "/rentOrder", id: $scope.rentOrder};
                    } else if ($scope.orgOrder) {
                        $scope.url = {url: "/orgOrder", id: $scope.orgOrder};
                    } else if ($scope.groupOrder) {
                        $scope.url = {url: "/groupOrder", id: $scope.groupOrder};
                    }
                    var ua = window.navigator.userAgent.toLowerCase();
                    $scope.isWxClient = false;
                    if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                        $scope.isWxClient = true;
                        wxService.init();
                    }
                    //初始化物流i服务和服务态度分数 5分
                    $scope.imgUrl = appConfig.imgUrl;
                    $scope.anonymous = true; // 默认进行匿名
                    if ($scope.groupOrder) {
                        $http({
                            method: 'GET',
                            url: appConfig.apiPath + $scope.url.url + '/goComment?groupOrderId=' + $scope.url.id
                        }).then(function (resp) {
                            console.log(resp)
                            var data = resp.data;
                            $scope.order = data;
                            $scope.order.orderItems = [];
                            $scope.order.orderItems[0] = $scope.order.sku;
                            //给描述评分设初始值为5分满分
                            for (var i = 0; i < $scope.order.orderItems.length; i++) {
                                $scope.order.orderItems[i].score = 5;
                            }
                        }, function (resp) {
                            var data = resp.data;
                            if (data.code === "NOT_LOGINED") {
                                $state.go("main.newLogin", {backUrl: window.location.href});
                                return;
                            }
                            $timeout(function () {
                                $state.go("main.unionOrder", null, {reload: true});
                            }, 100);
                        });
                    } else {
                        $http({
                            method: 'GET',
                            url: appConfig.apiPath + $scope.url.url + '/goComment?orderId=' + $scope.url.id
                        }).then(function (resp) {
                            var data = resp.data;
                            $scope.order = data;
                            //给描述评分设初始值为5分满分
                            for (var i = 0; i < $scope.order.orderItems.length; i++) {
                                $scope.order.orderItems[i].score = 5;
                            }
                        }, function (resp) {
                            var data = resp.data;
                            if (data.code === "NOT_LOGINED") {
                                $state.go("main.newLogin", {backUrl: window.location.href});
                                return;
                            }
                            $timeout(function () {
                                $state.go("main.unionOrder", null, {reload: true});
                            }, 100);
                        });
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

                    // 选择中标签后进行提交
                    $scope.tagOrderItemInsert = function (tag) {
                        tag.click = !tag.click;
                    };
                    // 提交本次打分结果
                    $scope.submitComment = function () {
                        var param = {};
                        if ($scope.orgOrder) {
                            param.orgOrder = $scope.order.orderId;
                        } else if ($scope.groupOrder) {
                            param.groupOrderId = $scope.order.orderId;
                        } else {
                            param.orderId = $scope.order.orderId;
                        }

                        param.anonymous = $scope.anonymous;
                        // 对订单中的商品进行参数组合
                        var items = [];
                        var item = null;
                        var boo = false;
                        for (var i = 0; i < $scope.order.orderItems.length; i++) {
                            var orderItem = $scope.order.orderItems[i];
                            item = {};
                            // 给评论赋值初始化值，否则报错
                            if (orderItem.content) {
                                item.content = orderItem.content;
                            } else {
                                alertService.msgAlert("exclamation-circle", "请对商品进行评论");
                                boo = true;
                                return;
                            }
                            // 对图像进行初始化赋值

                            if (orderItem.imgs) {
                                var tempImg = [];
                                for (var y = 0; y < orderItem.imgs.length; y++) {
                                    tempImg.push(orderItem.imgs[y].id);
                                }
                                item.imgs = tempImg;
                            } else {
                                item.imgs = [];
                            }
                            item.skuId = orderItem.id;
                            items[i] = item;
                            item = null;
                        }
                        var tags = [];
                        for (var i = 0; i < $scope.order.tags.length; i++) {
                            if ($scope.order.tags[i].click) {
                                tags.push($scope.order.tags[i].tag);
                            }
                        }
                        // 对标签进行初始化赋值
                        param.tags = tags;
                        param.items = items;

                        //以下的先注释掉， 如果优化后有问题，在还原下
                        if ($scope.orgOrder) {
                            $http({
                                method: 'POST',
                                url: appConfig.apiPath + '/order/comment',
                                data: param
                            }).then(function () {
                                alertService.msgAlert("success", "评价成功!");
                                $timeout(function () {
                                    $scope.fallbackPage();
                                }, 3000);
                            }, function (resp) {
                                var data = resp.data;
                                if (data.code === "NOT_LOGINED") {
                                    $state.go("main.newLogin", {backUrl: window.location.href});
                                }
                            });
                        } else if ($scope.groupOrder) {
                            $http({
                                method: 'POST',
                                url: appConfig.apiPath + '/groupOrder/comment',
                                params: {
                                    groupOrderId: param.groupOrderId,
                                    anonymous: param.anonymous,
                                    tags: param.tags,
                                    content: param.items[0].content,
                                    imgs: param.items[0].imgs
                                }
                            }).then(function () {
                                alertService.msgAlert("success", "评价成功!");
                                $timeout(function () {
                                    $scope.fallbackPage();
                                }, 3000);
                            }, function (resp) {
                                var data = resp.data;
                                if (data.code === "NOT_LOGINED") {
                                    $state.go("main.newLogin", {backUrl: window.location.href});
                                }
                            });
                        } else {
                            $http({
                                method: 'POST',
                                url: appConfig.apiPath + $scope.url.url + '/comment',
                                data: param
                            }).then(function () {
                                alertService.msgAlert("success", "评价成功!");
                                $timeout(function () {
                                    $scope.fallbackPage();
                                }, 3000);
                            }, function (resp) {
                                var data = resp.data;
                                if (data.code === "NOT_LOGINED") {
                                    $state.go("main.newLogin", {backUrl: window.location.href});
                                }
                            });
                        }
                    };
                    $scope.uploadWx = function (orderItem) {
                        var ua = window.navigator.userAgent.toLowerCase();
                        if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                            wxService.wxUploadImg(1).then(function (data) {
                                var s = {};
                                s.id = data.id;
                                s.avatar = data.avatar;
                                if (!orderItem.imgs) {
                                    orderItem.imgs = [];
                                }
                                orderItem.imgs.push(s);
                            });
                        }
                    };
                    var uploader = $scope.uploader = new FileUploader({
                        url: appConfig.apiPath + '/common/uploadImgS',
                        autoUpload: true
                    });
                    uploader.filters.push({
                        name: 'customFilter',
                        fn: function (item /*{File|FileLikeObject}*/, options) {
                            return true;
                        }
                    });
                    uploader.onSuccessItem = function (fileItem, response) {
                        $scope.addImgPort(response);
                    };
                    $scope.orderIndex = 0;
                    // 上传图片
                    $scope.uploadImg = function (orderItem, index) {
                        $scope.orderIndex = index;
                        var ua = window.navigator.userAgent.toLowerCase();
                        if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                            wxService.wxUploadImg(1).then(function (data) {
                                $scope.addImgPort(data);
                            });
                        } else {
                            if (index < 5) {
                                var s = $element.find("#uploaderFile");
                                s.click();
                            } else {
                                alertService.msgAlert("exclamation-circle", "最多上传5张");
                            }
                        }
                    };
                    // 将图片添加到前端中去
                    $scope.addImgPort = function (response) {
                        var s = {};
                        s.id = response.id;
                        s.avatar = response.avatar;
                        if (!$scope.order.orderItems[$scope.orderIndex].imgs) {
                            $scope.order.orderItems[$scope.orderIndex].imgs = [];
                        }
                        if ($scope.order.orderItems[$scope.orderIndex].imgs.length > 4) {
                            alertService.msgAlert("exclamation-circle", "最多上传5张");
                            return;
                        }
                        $scope.order.orderItems[$scope.orderIndex].imgs.push(s);
                        // 刷新数据有延迟，进行手动刷新数据
                    };
                    // 删除图片
                    $scope.removeOneImg = function (id, orderItem) {
                        for (var i = 0; i < orderItem.imgs.length; i++) {
                            if (orderItem.imgs[i].id === id) {
                                orderItem.imgs.splice(i, 1);
                                //从当前的这个i起 删除一个(也就是删除本身)
                                return;
                            }
                        }
                    };
                }]);
})();