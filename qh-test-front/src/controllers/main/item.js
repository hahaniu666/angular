(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state("main.item", {
            // sku和num参数有,则代表刚才是直接购买需要登陆的
            url: '/item?itemId&itemName&s&skuId&type&num&sku&fromId',        //type判断是否为学生租赁的商品详情显示
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, false);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/item/index.root.html',
                    controller: itemController
                }
            }
        });
    }]);
    itemController.$inject = ['$window', '$scope', '$http', '$state', '$rootScope', '$interval', '$filter', '$timeout', 'appConfig', 'imgService', "curUser", '$mdBottomSheet', "alertService", "wxService",'$location'];
    function itemController($window, $scope, $http, $state, $rootScope, $interval, $filter, $timeout, appConfig, imgService, curUser, $mdBottomSheet, alertService, wxService,$location) {
        ////返回顶部
        $scope.gotoTop = function () {
            $window.scrollTo(0, 0);//滚动到顶部
        };
        $scope.gotoTop();
        $scope.swiper = {};
        // 图片轮播图
        $scope.slideImg = imgService.slideImg;
        $scope.simpleImg = imgService.simpleImg;
        $scope.itemImg = imgService.itemImg;

        $scope.itemId = $state.params.itemId;
        $scope.type = $state.params.type;
        $scope.fromId = $state.params.fromId;

        if (!$scope.itemId || $scope.itemId === "") {
            $state.go("main.category", {type: "item"}, {reload: true});
        }
        $scope.userInfo = null;
        if (curUser.data && curUser.data.userInfo) {
            $scope.userInfo = curUser.data.userInfo;
        }
        // 预览图片 微信进行
        $scope.imgPreview = function () {
            var imgs = [];
            if ($scope.checkSku.imgs) {
                for (var n = 0; n < $scope.checkSku.imgs.length; n++) {
                    imgs.push($scope.imgUrl + $scope.checkSku.imgs[n].key +
                        "?imageView2/1/w/" + $scope.itemImg.w + "/h/" + $scope.itemImg.h);
                }
            }
            wx.previewImage({
                current: imgs[0], // 当前显示图片的http链接
                urls: imgs // 需要预览的图片http链接列表
            });
        };
        // 评论的预览图片
        $scope.imgPreviewReply = function (reply, img) {
            var imgs = [];
            for (var n = 0; n < reply.length; n++) {
                imgs.push($scope.imgUrl + reply[n] +
                    "?imageView2/1/w/" + $scope.itemImg.w + "/h/" + $scope.itemImg.h);
            }
            var imgUrl = $scope.imgUrl + img +
                "?imageView2/1/w/" + $scope.itemImg.w + "/h/" + $scope.itemImg.h;
            wx.previewImage({
                current: imgUrl, // 当前显示图片的http链接
                urls: imgs // 需要预览的图片http链接列表
            });
        };
        $scope.pageSize = appConfig.pageSize;
        $scope.maxSize = appConfig.maxSize;
        $scope.imgUrl = appConfig.imgUrl;

        // 获取购物车数量有多少个SKU
        $http
            .get(appConfig.apiPath + "/cart/cartNum")
            .success(function (data) {
                $scope.cartSize = data;
            });

        // 计算商品活动的倒计时时间 === 暂时不用
        $scope.startTime = function () {
            if (!$scope.checkSku) {
                return;
            }
            $rootScope.intervalStop = $interval(function () {
                var date = new Date().getTime();
                var oldDate = new Date($filter("date")($scope.checkSku.activity.deadTime, "yyyy/MM/dd HH:mm:ss")).getTime();
                // 倒计时到零时，停止倒计时
                var rest = oldDate - date;
                if (rest <= 0) {
                    $scope.checkSku.activity.activityTime = "....";
                    return;
                }
                var days = parseInt(rest / (24 * 3600 * 1000));
                //计算出小时数
                var leave1 = rest % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                var hours = Math.floor(leave1 / (3600 * 1000));
                //计算相差分钟数
                var leave2 = rest % (3600 * 1000);        //计算小时数后剩余的毫秒数
                var minutes = Math.floor(leave2 / (60 * 1000));

                //计算相差秒数
                var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
                var seconds = Math.round(leave3 / 1000);
                $scope.checkSku.activity.activityTime = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
            }, 1000);
        };
        // 按照什么样地方式去排序
        // chase 时候有追评
        $scope.commentStatus = {all: true, chase: false, img: false};
        // 获取该商品的评论
        $scope.queryComment = function (curPage, boo) {
            var s = "";
            if ($scope.commentStatus.img) {
                s = "IMG";
            }
            var comment = "";
            if ($scope.commentStatus.chase) {
                comment = "RECOMMENT";
            }
            $http
                .get(appConfig.apiPath + "/item/commentList?reComment=" + comment + "&img=" + s + "&itemId=" + $scope.itemId + "&curPage=" + curPage + "&pageSize=" + $scope.pageSize)
                .success(function (data) {
                    if (!$scope.comment || !boo) {
                        $scope.comment = data;
                    } else {
                        $scope.comment.commentList = $scope.comment.commentList.concat(data.commentList);
                    }
                    var page = parseInt($scope.comment.totalCount / $scope.comment.pageSize);
                    if ($scope.comment.totalCount % $scope.comment.pageSize > 0) {
                        page++;
                    }
                    if (page <= $scope.comment.curPage) {
                        $scope.comment.pageEnd = true;
                    } else {
                        $scope.comment.curPage++;
                    }
                });
        };
        $scope.queryComment(1); //初始化
        $scope.statusCommentAll = function () {
            $scope.commentStatus = {all: true, chase: false, img: false};
            $scope.queryComment(1); //初始化
        };
        // 选择查看的评论是否有图片
        $scope.statusComment = function () {
            $scope.commentStatus.img = !$scope.commentStatus.img;
            if (!$scope.commentStatus.img) {
                $scope.commentStatus.all = true;
            } else {
                $scope.commentStatus.all = false;
            }
            $scope.queryComment(1); //初始化
        };
        // 分页
        $scope.pageChanged = function () {
            $scope.queryComment($scope.comment.curPage, true);
        };
        // 回退页面
        $scope.fallbackPage = function () {
            if ($state.params.s === 'fx') {
                $state.go("main.index", null, {reload: true});
            } else {
                if (history.length === 1) {
                    $state.go("main.index", null, {reload: true});
                } else {
                    history.go(-1);
                }
            }

        };
        // 查看商品的参数
        $scope.propItemQuery = function () {
            $mdBottomSheet.show({
                templateUrl: 'views/main/item/propDialog/index.root.html',
                parent: '.ks-main',
                controllerAs: "vm",
                controller: [function () {
                    var vm = this;
                    vm.props = $scope.itemDetail.props;
                    vm.specs = $scope.itemDetail.specs;
                    vm.cancel = function () {
                        $mdBottomSheet.hide("xxx");
                    };
                }]
            }).then(function (clickedItem) {
            });
        };
        // company代表当前的单位是什么，skuNum是要购买几件，buy是购买的确定，还是查看参数的确定;30天起租
        $scope.skuProp = {status: "ITEM", company: "件", skuNum: 1, buy: 0, day: 30};

        /**
         * 选择不同的规格
         */
        $scope.checkSkuDialog = function (ev, status) {
            $scope.skuProp.buy = status;
            $mdBottomSheet.show({
                templateUrl: 'views/main/item/specDialog/index.root.html',
                parent: '.ks-main',
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false,
                controllerAs: "vm",
                controller: ['alertService', function (alertService) {
                    var vm = this;
                    vm.type = $scope.skuProp.status;
                    vm.appConfig = appConfig;
                    vm.imgService = imgService;
                    vm.skuProp = $scope.skuProp;
                    vm.specClick = [];

                    // 计算商品数量。进行加减
                    vm.skuNumCount = function (num) {
                        if (vm.skuProp.skuNum === 1 && num === 0) {
                            return;
                        }
                        if (num === 0) {
                            vm.skuProp.skuNum--;
                        } else {
                            vm.skuProp.skuNum++;
                        }
                    };
                    // 计算天数。进行加减 30天起
                    vm.skuDayCount = function (num) {
                        if (vm.skuProp.day === 30 && num === 0) {
                            return;
                        }
                        if (num === 0) {
                            vm.skuProp.day--;
                        } else {
                            vm.skuProp.day++;
                        }
                    };
                    vm.itemDetail = $scope.itemDetail;
                    vm.tempCheckSku = null;
                    vm.clearCheck = function () {
                        // 现将所有选中过的全部清除，在重新选中
                        // 清除当前选中状态  传过的ID要清除选中状态
                        for (var i = 0; i < vm.itemDetail.specs.length; i++) {
                            //把y改成了y2,防止重复定义变量
                            for (var k = 0; k < vm.itemDetail.specs[i].specValues.length; k++) {
                                vm.itemDetail.specs[i].specValues[k].stock = false;
                                vm.itemDetail.specs[i].specValues[k].check = false;
                            }
                        }
                    };
                    // 初始化选中已经选过的图标
                    vm.init_Spec = function () {
                        for (var c = 0; c < $scope.checkSku.specs.length; c++) {
                            for (var i = 0; i < vm.itemDetail.specs.length; i++) {
                                //把y改成了y2,防止重复定义变量
                                for (var k = 0; k < vm.itemDetail.specs[i].specValues.length; k++) {
                                    if (vm.itemDetail.specs[i].specValues[k].id === $scope.checkSku.specs[c].propId) {
                                        vm.itemDetail.specs[i].specValues[k].check = true;
                                        var oneSpec = {};
                                        oneSpec.id = vm.itemDetail.specs[i].specId;
                                        oneSpec.valueId = vm.itemDetail.specs[i].specValues[k].id;
                                        vm.specClick.push(oneSpec);
                                    }
                                }
                            }
                        }
                        vm.tempCheckSku = $scope.checkSku;
                    };
                    // 先清除 然后初始化
                    vm.clearCheck();
                    vm.init_Spec();

                    // 清除当前选取的spec值value的点中
                    vm.clearSpecs = function (specId) {
                        for (var i = 0; i < vm.itemDetail.specs.length; i++) {
                            if (vm.itemDetail.specs[i].specId === specId) {
                                //把y改成了y2,防止重复定义变量
                                for (var k = 0; k < vm.itemDetail.specs[i].specValues.length; k++) {
                                    vm.itemDetail.specs[i].specValues[k].check = false;
                                }
                            }
                        }
                    };
                    // 得到本次选中的规格SKU
                    vm.clickedSpec = function (spec, specValue) {
                        if (specValue.stock) {
                            // 点击上一个规格的时候,这个value的库存没有,直接返回
                            return;
                        }
                        vm.tempCheckSku = null;
                        // 本次点击的事件ID
                        var oneSpec = {};
                        oneSpec.id = spec.specId;
                        oneSpec.valueId = specValue.id;
                        // 记录本次点击的是以点击过的,还是未点击的spec.未点击的spec直接添加
                        var boo = true;
                        for (var i = 0; i < vm.specClick.length; i++) {
                            if (vm.specClick[i].id === spec.specId) {
                                boo = false;
                                vm.specClick.splice(i, 1);
                                // 点击不同value,同一个spec,删除原有的spec的value.添加新的value
                                vm.clearSpecs(spec.specId);
                                specValue.check = true;
                                vm.specClick.push(oneSpec);
                                break;
                                //}
                            }
                        }
                        // 未点击过得.直接添加
                        if (boo) {
                            // 本次点击显示红色边框
                            specValue.check = true;
                            vm.specClick.push(oneSpec);
                        }
                        // 点击完所有的规格.直接添加
                        if (vm.specClick.length === vm.itemDetail.specs.length) {
                            // 进行计算价格的操作
                            // 循环tempsku进行比对
                            for (var i = 0; i < vm.itemDetail.sku.length; i++) {
                                var num = 0;
                                for (var y = 0; y < vm.itemDetail.sku[i].specs.length; y++) {
                                    // 循环SKU的规格
                                    for (var s = 0; s < vm.specClick.length; s++) {
                                        // 如果sku中的规格有当前最后一次点击的规格,并且库存大于0,则加入tempsku中
                                        if (vm.specClick[s].valueId === vm.itemDetail.sku[i].specs[y].propId) {
                                            // 有一次不符合跳出循环,进行下一次
                                            num++;
                                        }
                                    }
                                }
                                if (num < vm.specClick.length) {
                                    // 有一次不符合跳出循环,进行下一次
                                    continue;
                                }
                                // 本次商品规格和选择的规格相同，则不用在查找,将商品添加上选择中去
                                vm.tempCheckSku = vm.itemDetail.sku[i];
                                break;
                            }
                        }
                    };
                    vm.cancel = function () {
                        $mdBottomSheet.hide(false);
                    };
                    vm.checkSubmit = function (status) {
                        // status===0;是进行加入购物车，status===1是进行购买还是确定
                        if (vm.tempCheckSku) {

                            $mdBottomSheet.hide({status: status, sku: vm.tempCheckSku});
                        } else {

                            if (vm.specClick.length < vm.itemDetail.specs.length) {
                                alertService.msgAlert("exclamation-circle", "请选择相应规格");
                            } else {
                                alertService.msgAlert("exclamation-circle", "当前商品缺货");
                            }
                        }
                    };
                }]
            }).then(function (data) {
                if (data) {
                    $scope.checkSku = data.sku;
                    console.log(data);
                    if (data.status === 1) {
                        if ($scope.skuProp.buy === 0) {
                            $scope.checkSubmitSku();
                            $scope.getCoin($scope.checkSku.sku);
                            $timeout(function () {
                                $scope.swiper.update();
                            });
                        } else {
                            $scope.itemPayBuy(1);
                        }
                    } else {
                        $timeout(function () {
                            $scope.swiper.update();
                        });
                        // 为0是加入购物车
                        $scope.checkSubmitSku();
                        $scope.itemPayBuy(0);
                        $scope.getCoin($scope.checkSku.sku);
                    }
                }
            })
        };
        $scope.getCoin = function (sku) {
            console.log(sku);

            $http({
                method: "GET",
                url: appConfig.apiPath + "/integral/calIntegral",
                params: {skuId: sku}
            }).then(function (resp) {
                console.log(resp);
                $scope.integral = resp.data.integral;
                $scope.shareIntegral = resp.data.shareIntegral;
            }, function () {
            });
        };
        // $scope.getCoin($state.params.skuId);

        // 微信中查看大图
        $scope.ccc = function (img) {
            img = img + "?imageView2/1/w/" + $scope.itemImg.w + "/h/" + $scope.itemImg.h;
            wx.previewImage({
                current: img, // 当前显示图片的http链接
                urls: [img] // 需要预览的图片http链接列表
            });
        };
        $scope.checkSku = {};
        // 缓存该商品的详情
        $scope.getSkuDetail = function () {
            // 获取该商品的详情
            $http.get(appConfig.apiPath + "/item/skuText?skuId=" + $scope.checkSku.sku)
                .success(function (data) {
                    var detail = data.detail.replace(/src\s*=\s*\"(https:\S+)\"/g, "src=\"$1?imageView2/2/w/" + $scope.itemImg.w + "\" style=\"width:" + $scope.itemImg.w + "px\"");
                    detail = detail.replace(/_src\s*=\s*\"(https:\S+)\"/g, "");
                    detail = detail.replace(/src\s*=\s*\"(http:\S+)\"/g, "src=\"$1?imageView2/2/w/" + $scope.itemImg.w + "\" style=\"width:" + $scope.itemImg.w + "px\"");
                    detail = detail.replace(/_src\s*=\s*\"(http:\S+)\"/g, "");
                    $rootScope.itemCache.put($scope.checkSku.sku, {
                        date: $scope.checkSku.date,
                        detail: detail
                    });
                    $scope.checkSku.detail = detail;
                });
        };

        // 规格选择完成进行计算
        $scope.checkSubmitSku = function () {
            if (!$scope.checkSku) {
                alertService.msgAlert("exclamation-circle", "商品选择错误");
                return;
            }
            $scope.startTime();
            if ($rootScope.itemCache.get($scope.checkSku.sku) === undefined) {
                $scope.getSkuDetail();
            } else {
                var tempDetail = $rootScope.itemCache.get($scope.checkSku.sku);
                if (tempDetail.date !== $scope.checkSku.date) {
                    $scope.getSkuDetail();
                } else {
                    $scope.checkSku.detail = tempDetail.detail;
                }
            }
        };
        // 获取该商品的属性
        /**
         * 当前商品的单位
         * @type {string}
         */
        $scope.queryItemDetail = function () {
            $http.get(appConfig.apiPath + "/item/detail?itemId=" + $scope.itemId + "&userId=" + $scope.fromId)
                .success(function (data) {
                    if (data.sku.length <= 0) {
                        alertService.msgAlert("exclamation-circle", "商品已下架");
                        return;
                    }
                    $scope.itemDetail = data;
                    console.log('$scope.itemDetail', $scope.itemDetail);
                    if (wxService.isInWx()) {
                        // $scope.$on("$destroy", function () {
                        //     wxService.shareRing(); // 恢复默认绑定
                        //     wxService.shareFriend();
                        // });
                        var finalLing = window.location.href;
                        console.log(finalLing);
                        var curConf = {
                            title: $scope.itemDetail.title, // 分享标题
                            desc: $scope.itemDetail.des,
                            link: finalLing,
                            imgUrl: 'https:' + appConfig.imgUrl + $scope.itemDetail.img, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                $scope.getIntegral()
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                alertService.msgAlert('exclamation-circle', "取消分享");
                            }
                        };
                        wxService.initShareOnStart(curConf);
                    }
                    // 默认选取第一个,有skuId则选取对应的SKU
                    $scope.checkSku = null;
                    if ($state.params.skuId) {
                        for (var i = 0; i < $scope.itemDetail.sku.length; i++) {
                            if ($scope.itemDetail.sku[i].sku === $state.params.skuId) {
                                $scope.checkSku = $scope.itemDetail.sku[i];
                                $timeout(function () {
                                    $scope.swiper.update();
                                });
                                break;
                            }
                        }
                    }
                    //去除商品标题的分号
                    for (var i = 0; i < $scope.itemDetail.sku.length; i++) {
                        $scope.itemDetail.sku[i].title = $scope.itemDetail.sku[i].title.replace(/;/g, ' ');
                    }
                    // 如果sku没有找到对应的，则默认第一个
                    if (!$scope.checkSku) {
                        $scope.checkSku = $scope.itemDetail.sku[0];
                        $timeout(function () {
                            $scope.swiper.update();
                        });
                    }
                    if ($scope.itemDetail.type === "RENT_QUILT") {
                        $scope.skuProp.company = "天";

                        $scope.skuProp.status = "RENT_QUILT";
                    }
                    if ($scope.itemDetail.type === "STUDENT_RENT") {
                        $scope.skuProp.company = "天";

                        $scope.skuProp.status = "RENT";
                    }
                    $scope.checkSubmitSku();
                    $scope.removeSpecs();
                });
        };

        $scope.getIntegral = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + "/integral/shareIntegral",
                data: {
                    itemId: $scope.itemDetail.itemId
                }
            }).then(function (resp) {
            });
        };

        // 清除没有的sku
        $scope.removeSpecs = function () {
            for (var i = 0; i < $scope.itemDetail.specs.length; i++) {
                var boo = false;
                for (var y = 0; y < $scope.itemDetail.sku.length; y++) {
                    for (var t = 0; t < $scope.itemDetail.sku[y].specs.length; t++) {
                        if ($scope.itemDetail.specs[i].specId === $scope.itemDetail.sku[y].specs[t].id) {
                            // 有使用,不用在遍历
                            boo = true;
                            break;
                        }
                    }
                    if (boo) {
                        break;
                    }
                }
                if (!boo) {
                    $scope.itemDetail.specs.splice(i, 1);
                    continue;
                }
                boo = false;
                for (var y = 0; y < $scope.itemDetail.specs[i].specValues.length; y++) {
                    for (var d = 0; d < $scope.itemDetail.sku.length; d++) {
                        for (var t = 0; t < $scope.itemDetail.sku[d].specs.length; t++) {
                            if ($scope.itemDetail.specs[i].specValues[y].id === $scope.itemDetail.sku[d].specs[t].propId) {
                                boo = true;
                                break;
                            }
                        }
                        if (boo) {
                            break;
                        }
                    }
                    if (!boo) {
                        $scope.itemDetail.specs[i].specValues.splice(y, 1);
                        y--;
                    }
                    boo = false;
                }
            }
        };

        //联系客服
        $scope.contactService = function () {
            console.log("联系客服:" + curUser.data.code);

            if (curUser.data.code == 'SUCCESS') {
                ysf.config({
                    uid: curUser.data.userInfo.userId,
                    name: curUser.data.userInfo.name,
                    email: curUser.data.userInfo.email,
                    mobile: curUser.data.userInfo.phone,
                    // staffid: '123', // 客服id
                    // groupid: '123' // 客服组id
                });
            }

            var itemDesc = "";
            for (var i in $scope.checkSku.specs) {
                itemDesc += $scope.checkSku.specs[i].value + "  ";
            }

            ysf.product({
                show: 1,                       // 1为打开， 其他参数为隐藏（包括非零元素）
                title: $scope.checkSku.title,
                desc: itemDesc,
                picture: appConfig.imgUrl + $scope.checkSku.imgs[0],
                note: '￥' + ($scope.checkSku.acPrice / 100.0),
                url: appConfig.rootPath + "#/item?itemId=" + $state.params.itemId + "&skuId=" + $scope.checkSku.sku
            });
            //ysf.open();
            location.href = ysf.url();
        };

        //猜你喜欢 查询商品的详细信息
        $scope.queryItem = function (itemId) {
            $state.go("main.item", {itemId: itemId}, {reload: true});
        };

        $scope.notLogin = function () {
            $state.go("main.newLogin", {backUrl: window.location.href});
        };
        // 对已经计算好的进行购买
        $scope.itemPayBuy = function (status) {
            if (!$scope.checkSku.sku) {
                return;
            }
            // 判断商品是否已经下架，但是下架的商品返回的库存都是0.二次校验防止出错
            if ($scope.checkSku.delete) {
                alertService.msgAlert("exclamation-circle", "商品已下架");
                return;
            }
            if (status === 0) {
                if (!$scope.skuProp.day) {
                    $scope.skuProp.day = 1;
                }
                var skuData = [{
                    skuId: $scope.checkSku.sku,
                    num: $scope.skuProp.skuNum,
                    day: $scope.skuProp.day,
                    userId: $scope.fromId,
                }];
                if ($scope.checkSku.storage == 0 || $scope.checkSku.storage === '0') {
                    alertService.msgAlert("success", "库存不足");
                    return;
                }

                // 加入购物车中
                $http
                    .post(appConfig.apiPath + '/cart/add', {data: skuData, type: "cart"})
                    .success(function () {
                        // 获取购物车数量有多少个SKU
                        $http
                            .get(appConfig.apiPath + "/cart/cartNum")
                            .success(function (data) {
                                alertService.msgAlert("success", "加入购物车成功");
                                $scope.cartSize = data;
                            });
                    }).error(function (data) {
                    if (data.code === "NOT_LOGINED") {
                        $scope.notLogin();
                    }
                });
            } else {
                // 先进行判断库存是否充足
                if ($scope.checkSku.storage < $scope.skuProp.skuNum) {
                    alertService.msgAlert("cancle", "库存不足");
                    return;
                }
                if (!$scope.userInfo) {
                    var url = window.location.href + "&num=" + $scope.skuProp.skuNum + "&sku=" + $scope.checkSku.sku;
                    $state.go("main.newLogin", {backUrl: url});
                    return;
                }
                // 不是租赁的时候才进行判断库存是否充值
                // 获取该商品的属性
                $http.get(appConfig.apiPath + "/qhOrder/check?sku=" + $scope.checkSku.sku + "&num=" + $scope.skuProp.skuNum + "&day=" + $scope.skuProp.day + "&userId=" + $scope.fromId)
                    .then(function (resp) {
                        if (resp.data.code === "NOT_ORG") {
                            alertService.msgAlert("exclamation-circle", "请提交学生资质");
                            $timeout(function () {
                                $state.go("main.leaseApplication.leaseFirst", {
                                    id: resp.data.orderId
                                }, {reload: true});
                            }, 500);
                        }
                        else {
                            // 直接进行购买
                            $state.go("main.order.checkOrder", {
                                id: resp.data.orderId
                            }, {reload: true});
                        }

                    }, function (resp) {
                        // 微信浏览器内直接进行微信登陆
                        if (resp.data.code === "NOT_LOGINED") {
                            $scope.notLogin();
                        }
                    });
            }
        };
        // 如果有这2个参数直接购买
        if ($state.params.sku && $state.params.num && alertService.pages.item == 0) {
            alertService.pages.item = alertService.pages.item + 1;
            $scope.checkSku = {sku: $state.params.sku, delete: false};
            $scope.skuProp = {skuNum: $state.params.num};
            $scope.itemPayBuy(1);
        } else {
            // 获取商品的详情
            $scope.queryItemDetail();
        }
        $scope.localUrl = $location.absUrl().replace(/item/, 'imgWrap');
        $scope.localImgUrl = encodeURIComponent($scope.localUrl);

        // $scope.dialogImgUrl = 'http://192.168.0.13:10190/qh/html/api/img?w=300&h=440&timeout=1000&url=' + $scope.localImgUrl;
        $scope.dialogImgUrl = appConfig.screenshotImgApi + 'w=300&h=440&scale=2&timeout=1000&url=' + $scope.localImgUrl;

        $scope.dialogShow = false;
        $scope.backdrop = false;
        $scope.shareDialog1 = function () {
            $scope.dialogShow = !$scope.dialogShow;
            $scope.backdrop = !$scope.backdrop;
        };

        $scope.imgShareShow = false;
        $scope.shareFiend = function () {
            $scope.imgShareShow = !$scope.imgShareShow;
            if ($scope.imgShareShow == true) {
                $scope.dialogShow = false;
            }
        };

        $scope.imgWrapShow = false;
        $scope.imgShow = function () {
            $scope.imgWrapShow = !$scope.imgWrapShow;
            if ($scope.imgWrapShow == true) {
                // $scope.dialogShow = false;
                $scope.dialogShow = false;
                $scope.backdrop = true;
            }
            // if ($scope.imgWrapShow == false) {
            //     $scope.dialogShow = true;
            //     console.log($scope.dialogShow);
            // }
        };

        $scope.closeDialog = function () {
            $scope.imgShareShow = false;
            $scope.imgWrapShow = false;
            $scope.dialogShow = false;
            $scope.backdrop = false;
        };

        $scope.shareDialog = function () {
            $mdBottomSheet.show({
                templateUrl: 'views/main/item/shareDialog/index.root.html',
                parent: '.ks-selsectProduct',
                controllerAs: "vm",
                controller: ['wxService', function (wxService) {
                    var vm = this;


                    if (wxService.isInWx()) {
                        // $scope.$on("$destroy", function () {
                        //     wxService.shareRing(); // 恢复默认绑定
                        //     wxService.shareFriend();
                        // });
                        var link = location.href.replace(/startGroup/, 'group');
                        var finalLing = window.location.href;
                        console.log(finalLing);
                        var curConf = {
                            title: 'qweqwe', // 分享标题
                            desc: 'ewqeqwe',
                            link: finalLing,
                            imgUrl: 'http://topic.xcar.com.cn/201403/ad_q3/pic/banner.jpg', // 分享图标
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

                    vm.cancel = function () {
                        $mdBottomSheet.hide();
                    };
                }]
            }).then(function (clickedItem) {
            });
        };
    }
})();