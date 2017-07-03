(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 收到优惠券
         */
        $stateProvider.state("main.leasingAsset", {
            url: '/leasingAsset?recListId&selectIndex&TOF&toptrueOrFalse&s&r&a',
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, true);
                }]
            },

            views: {
                "@": {
                    templateUrl: 'views/main/leasingAsset/index.root.html',
                    controller: leasingAssetController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);
    leasingAssetController.$inject = ['$scope', '$http', '$state', 'appConfig', "imgService", '$filter', 'alertService', '$httpParamSerializer', 'curUser'];
    function leasingAssetController($scope, $http, $state, appConfig, imgService, $filter, alertService, $httpParamSerializer, curUser) {

        //回退页面
        var vm = this;
        $scope.user = curUser.data;
        //租赁是学生还是酒店
        $scope.assets = curUser.data.userInfo.org;
        vm.fallbackPage = function () {
            if ($state.params.a === 'cooper') {
                $state.go("main.hotelManage", null, {reload: true});
            } else {
                $state.go("main.center", null, {reload: true});
            }
        };
        //我的租赁js开始
        $scope.imgSSS = appConfig.imgUrl;
        $scope.vm = imgService;
        $scope.toptrueOrFalse = $state.params.toptrueOrFalse;
        //租赁中商品
        $scope.selectedTop = false;
        $scope.zulinzichan = 1;
        $scope.renwu = 1;

        $scope.zichan = function (index) {
            if (index === 1) {
                $scope.zulinzichan = 1;
            } else if (index === 2) {
                $scope.zulinzichan = 2;
            } else if (index === 3) {
                $scope.zulinzichan = 3;
            } else if (index === 4) {
                $scope.renwu = 4;
            } else if (index === 5) {

                $scope.renwu = 5;
            } else if (index === 6) {
                $scope.renwu = 6;
            } else {
                alertService.msgAlert("ks-cancle",'参数有错误!!!');
            }
        };
        $scope.zichan(1);
        $scope.vs = {
            tabLv1: "my",
            my: {    // 我的租赁
                tabLv2: "inUse",
                tabLv3: "delete",
                inUse: { // 使用中
                    data: {},     // 调用后台API获取的数据
                    selected: {     // 选中的状态，key: skuId, value: boolean 型——是否选中
                        // "00001" : true
                    },
                    lengthd: 0
                },
                back: { // 退租中
                    data: {},     // 调用后台API获取的数据
                    selected: {     // 选中的状态，key: skuId, value: boolean 型——是否选中

                    },
                    lengthd: 0
                },
                delete: { // 退租中
                    data: {},     // 调用后台API获取的数据
                    selected: {     // 选中的状态，key: skuId, value: boolean 型——是否选中

                    },
                    lengthd: 0
                }
            },
            jobs: { //租赁任务
                tabLv2: "inUse",
                inUse: { // 使用中
                    data: {},     // 调用后台API获取的数据
                    selected: {     // 选中的状态，key: skuId, value: boolean 型——是否选中

                    }
                },
                back: { // 退租中
                    data: {},     // 调用后台API获取的数据
                    selected: {     // 选中的状态，key: skuId, value: boolean 型——是否选中

                    }
                }
            }
        };

        $scope.checkin = function () {
            $state.go("main.leasingAsset.checkin", null, {reload: true});
        };


        $scope.skus = [0, 0];        //使用中和退租中 选中的下标
        $scope.skuSelected = [];    //历史 多选对象
        $scope.setChecked = function (sku, index) {
            //vs.my.tabLv2
            if ($scope.vs.my.tabLv2 === 'inUse') {
                $scope.skus[0] = index;
            } else if ($scope.vs.my.tabLv2 === 'back') {
                $scope.skus[1] = index;
            } else if ($scope.vs.my.tabLv2 === 'delete') {

                var idx = $scope.skuSelected.indexOf(sku);
                if (idx > -1) {
                    $scope.skuSelected.splice(idx, 1);
                }
                else {
                    $scope.skuSelected.push(sku);
                }

            }

        };


        /////////////////////全选的相关操作////////////////////////
        $scope.selected = [];
        /**
         $scope.toggle = function (item) {
            var idx = $scope.skuSelected.indexOf(item);
            if (idx > -1) {
                $scope.skuSelected.splice(idx, 1);
            }
            else {
                $scope.skuSelected.push(item);
            }
        };*/
        $scope.exists = function (item) {
            return $scope.skuSelected.indexOf(item) > -1;
        };
        $scope.isIndeterminate = function () {
            return ($scope.skuSelected.length !== 0 && $scope.skuSelected.length !== $scope.vs.my.delete.data.recList.length);
        };
        $scope.isChecked = function () {
            if (!$scope.vs.my.delete.data || !$scope.vs.my.delete.data) {
                return;
            }
            return $scope.skuSelected.length === $scope.vs.my.delete.data.recList.length;
        };
        $scope.toggleAll = function () {
            if ($scope.skuSelected.length === $scope.vs.my.delete.data.recList.length) {
                $scope.skuSelected = [];
            } else if ($scope.skuSelected.length === 0 || $scope.skuSelected.length > 0) {
                $scope.skuSelected = [];
                for (var i = 0; i < $scope.vs.my.delete.data.recList.length; i++) {
                    $scope.skuSelected.push($scope.vs.my.delete.data.recList[i]);
                }
                /**
                 $scope.selected = angular.copy(vm.data.recList);    //深复制,引用不一样，致使indexOf不能达到理想效果
                 $scope.selected = vm.data.recList;    //浅拷贝，全选之后取消选择，会删除vm.data.recList中数据
                 */
            }

        };
        /////////////////////全选操作结束///////////////////////////////


        // 为计算下一页使用统一的计算方法
        $scope.pageSizeAdds = function (datas) {
            var page = parseInt(datas.totalCount / datas.pageSize);
            if (datas.totalCount % datas.pageSize > 0) {
                page++;
            }
            if (page <= datas.curPage) {
                datas.pageEnd = true;
            } else {
                datas.curPage = datas.curPage + 1;
            }

        };
        // 查询我的资产
        $scope.rentItemList = function (status, curPage, boo) {
            // boo=true 将数据进行重新清0

            if (!status || status === "") {
                // 给予默认查询显示中
                status = "IN_USE";
            }
            // url: appConfig.apiPath + "/rentItem/list?status=" + status + "&pageSize=" + appConfig.pageSize + "&curPage=" + curPage
            // 查找我的资产列表。不同状态返回不同数据
            $http({
                method: 'GET',
                url: appConfig.apiPath + "/rentItem/list?status=" + status + "&pageSize=" + appConfig.pageSize + "&curPage=" + curPage
            }).then(function (resp) {

                if (status === "IN_USE") {
                    if (boo || !$scope.vs.my.inUse.data.recList) {
                        // 需要初始化
                        $scope.vs.my.inUse.data = resp.data;
                    } else {
                        $scope.vs.my.inUse.data.recList = $scope.vs.my.inUse.data.recList.concat(resp.data.recList);
                    }
                    $scope.pageSizeAdds($scope.vs.my.inUse.data);

                    if (!$scope.vs.my.inUse.data.recList[0]) {
                        return false;
                    }
                } else if (status === "BAKC_LEASE") {
                    if (boo || !$scope.vs.my.back.data.recList) {
                        // 需要初始化
                        $scope.vs.my.back.data = resp.data;
                    } else {
                        $scope.vs.my.back.data.recList = $scope.vs.my.back.data.recList.concat(resp.data.recList);
                    }
                    $scope.pageSizeAdds($scope.vs.my.back.data);
                    //取值 赋值
                    if (!$scope.vs.my.back.data.recList[0]) {
                        return false;
                    }
                } else if (status === "END") {
                    if (boo || !$scope.vs.my.delete.data.recList) {
                        // 需要初始化
                        $scope.vs.my.delete.data = resp.data;
                    } else {
                        $scope.vs.my.delete.data.recList = $scope.vs.my.delete.data.recList.concat(resp.data.recList);
                    }
                    $scope.pageSizeAdds($scope.vs.my.delete.data);
                    if (!$scope.vs.my.delete.data.recList[0]) {
                        return false;
                    }
                }

            }, function () {

            });
        };
        //退租中
        $scope.aaa = function () {
            if (!$scope.vs.my.back.data.curPage) {
                $scope.vs.my.back.data.curPage = 1;
            }
            if ($scope.vs.my.back.data.pageEnd) {
                return;
            }
            // 查询退租中的资产
            //切换页面
            //获取该页面的值
            $scope.rentItemList("BAKC_LEASE", $scope.vs.my.back.data.curPage, false);

        };
        //历史
        $scope.eee = function () {

            if (!$scope.vs.my.delete.data.curPage) {
                $scope.vs.my.delete.data.curPage = 1;
            }
            if ($scope.vs.my.delete.data.pageEnd) {
                return;
            }
            // 查询历史的资产
            //切换页面
            //获取该页面的值
            $scope.rentItemList("END", $scope.vs.my.delete.data.curPage, false);
        };
        //进行中
        $scope.fff = function () {
            if (!$scope.vs.my.inUse.data.curPage) {
                $scope.vs.my.inUse.data.curPage = 1;
            }
            if ($scope.vs.my.inUse.data.pageEnd) {
                return;
            }
            // 查询使用中的资产
            //切换页面
            //获取该页面的值
            $scope.rentItemList("", $scope.vs.my.inUse.data.curPage, false);
        };
        $scope.aaa();
        $scope.eee();
        $scope.fff();


        //遍历标签页
        $scope.isSelectAll = function () {
            var curTab1 = $scope.vs[$scope.vs.tabLv1];
            var curTab2 = curTab1[curTab1.tabLv2];
            var arr = curTab2.data.recList;   //sku的数组
            if (!arr) {
                return false;
            }
            for (var i = 0; i < arr.length; i++) {
                var curSku = arr[i];

                if (!curTab2.selected[curSku.id]) { //对应标签所对应的数组所对应的值
                    return false;
                }
            }

            var len = 0;
            for (var temp in curTab2.selected) {
                if (curTab2.selected[temp]) {
                    len++;
                }
            }
            curTab2.lengthd = len;
            return true;
        };
        /*$scope.toggleAll = function () {
         var curTab1 = $scope.vs[$scope.vs.tabLv1];
         var curTab2 = curTab1[curTab1.tabLv2];

         /!*var newValue = !$scope.isSelectAll();
         var arr = $scope.data[$scope.sku];
         for (var i = 0; i < arr.length; i++) {
         arr[i].selected = newValue;
         }*!/
         var newValue = !$scope.isSelectAll();
         var arr = curTab2.data.recList;   //sku的数组
         for (var i = 0; i < arr.length; i++) {
         var curSku = arr[i];
         curTab2.selected[curSku.id] = newValue;
         }
         };*/

        //申请退租
        $scope.tuizu = function () {
            var tmp = $scope.vs.my.inUse.data.recList[$scope.skus[0]];

            $state.go("main.leasingAsset.RequestOf", {
                id: tmp.id,
                overDate: tmp.endDate,
                totalPrice: tmp.totalPrice
            }, {reload: true});
        };
        //取消退租
        $scope.refundId = {};
        $scope.quxiaotuizu = function () {
            var tmp = $scope.vs.my.back.data.recList[$scope.skus[1]];

            alertService.confirm(null, "", "您确定要取消退租?", "点错了", "确定").then(function (data) {
                if (data) {
                    $scope.refundId = tmp.refundId,
                        $scope.queding();
                }
            });

        };
        //取消退租调用API
        $scope.queding = function () {

            $http({
                method: 'POST',
                url: appConfig.apiPath + "/unionOrder/cancelRefund",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: $httpParamSerializer({
                    id: $scope.refundId
                })

            }).then(function () {
                $state.go("main.leasingAsset", {
                    TOF: true
                }, {reload: true});


            }, function () {
                alertService.msgAlert("ks-cancle",'失败');
            });
        };
        var checkBoxParams = [];

        //删除历史调用API
        $scope.shanchu = function () {
            alertService.confirm(null, "", "您确定要删除?", "点错了", "确定").then(function (data) {
                if (data) {
                    checkBoxParams = [];
                    for (var i = 0; i < $scope.skuSelected.length; i++) {
                        $scope.refundId = $scope.skuSelected[i].id;
                        checkBoxParams.push($scope.refundId);

                    }
                    $scope.shachu();
                }
            });
        };
        $scope.shachu = function () {
            $http({
                method: 'POST',
                url: appConfig.apiPath + "/rentItem/deleteMany",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: $httpParamSerializer({
                    ids: checkBoxParams
                })
            }).then(function () {
                $state.go("main.leasingAsset", {
                    TOF: 'shanchu'
                }, {reload: true});
            }, function () {
                alertService.msgAlert("ks-cancle",'失败');
            });
        };


        //选项卡选项初始化
        $scope.trueOrFalse = false;
        if ($state.params.recListId) {
            $scope.trueOrFalse = true;
        }
        if ($state.params.TOF === 'shanchu') {
            $scope.trueOrFalse = 'shanchu';
        } else {

            if ($state.params.TOF) {
                $scope.trueOrFalse = true;
            }
        }

        //使用中租赁详情
        $scope.linkDetail = function (index) {
            var curTab1 = $scope.vs[$scope.vs.tabLv1];
            var curTab2 = curTab1[curTab1.tabLv2];
            var arr = curTab2.data.recList;   //sku的数组
            var id = arr[index].id;
            if (!id) {
                id = arr[index].sku.id;
            }
            $state.go("main.leasingAsset.leaseDetails", {
                id: id,
                s: $scope.vs.my.tabLv2,
                refundId: arr[index].refundId,
                lishi: $scope.zulinzichan
                /* overDate: arr[index].endDate,

                 itemId: arr[index].sku.itemId,
                 skuId: arr[index].sku.id*/
                //rentOrder:arr[index].sku.rentOrderId
            }, {reload: true});

        };
        //使用中租赁详情
        $scope.hotelDetail = function (index) {
            var curTab1 = $scope.vs[$scope.vs.tabLv1];
            var curTab2 = curTab1[curTab1.tabLv2];
            var arr = curTab2.data.recList;   //sku的数组
            var id = arr[index].id;
            if (!id) {
                id = arr[index].sku.id;
            }
            $state.go("main.leasingAsset.hotelDetails", {
                id: id,
                s: $scope.vs.my.tabLv2,
                refundId: arr[index].refundId,
                lishi: $scope.zulinzichan
                /* overDate: arr[index].endDate,

                 itemId: arr[index].sku.itemId,
                 skuId: arr[index].sku.id*/
                //rentOrder:arr[index].sku.rentOrderId
            }, {reload: true});

        };


        // ==========================我的租赁js结束
        // 获取我的租赁任务
        $scope.transportList = function (status, curPage, boo) {
            //切换页面
            //获取该页面的值
            $http({
                method: 'GET',
                url: appConfig.apiPath + "/rentItem/transport?type=" + status + "&pageSize=" + appConfig.pageSize + "&curPage=" + curPage
            }).then(function (resp) {
                if (boo || !$scope.transportAPIdata.recList) {
                    // 需要初始化
                    $scope.transportAPIdata = resp.data;
                } else {
                    $scope.transportAPIdata.recList = $scope.transportAPIdata.recList.concat(resp.data.recList);
                }
                $scope.pageSizeAdds($scope.transportAPIdata);
                //取值 赋值
            }, function () {
            });
        };
        //全部
        $scope.ddd = function (boo, index, title) {
            if ((index && index === $scope.renwu) || (title && $scope.renwu > 4)) {
                return;
            }
            if ($scope.renwu === 1) {
                $scope.renwu = 4;
            }
            if (!$scope.transportAPIdata.curPage) {
                $scope.transportAPIdata.curPage = 1;
            }
            if (!boo && $scope.transportAPIdata.pageEnd) {
                return;
            }
            $scope.transportList("ALL", $scope.transportAPIdata.curPage, boo);
            //切换页面
            //获取该页面的值
        };
        //进行中
        $scope.bbb = function (boo, index) {
            if (index && index === $scope.renwu) {
                return;
            }
            if (!$scope.transportAPIdata.curPage) {
                $scope.transportAPIdata.curPage = 1;
            }
            if (!boo && $scope.transportAPIdata.pageEnd) {
                return;
            }
            //切换页面
            //获取该页面的值
            $scope.transportList("ONGOING", $scope.transportAPIdata.curPage, boo);
        };
        //待评价
        $scope.ccc = function (boo, index) {
            if (index && index === $scope.renwu) {
                return;
            }
            if (!$scope.transportAPIdata.curPage) {
                $scope.transportAPIdata.curPage = 1;
            }
            if (!boo && $scope.transportAPIdata.pageEnd) {
                return;
            }
            //切换页面
            //获取该页面的值
            $scope.transportList("UNCOMMENTED", $scope.transportAPIdata.curPage, boo);
        };
        $scope.transportAPIdata = {};
        $scope.initTransport = function () {
            if (!$scope.transportAPIdata) {
                $scope.transportAPIdata = {};
                $scope.ddd(true);
            }
        };
        //评价
        $scope.qupinglun = function ($index) {
            $state.go("main.leasingAsset.estimate", {
                plID: $scope.transportAPIdata.recList[$index].id
            }, {reload: true});
        };
        $scope.goDetails = function ($index) {
            $state.go("main.leaseTask.servGetDetails", {
                servGetDetailsId: $scope.transportAPIdata.recList[$index].id,
                r: $scope.renwu
            }, {reload: true});
        };

        /**
         * 删除任务
         * @param index
         */
        $scope.delete = function (index) {
            alertService.confirm(null, "", "确定删除", "点错了", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: 'GET',
                        url: appConfig.apiPath + "/rentItem/deleteTransport",
                        params: {
                            id: $scope.transportAPIdata.recList[index].id
                        }
                    }).then(function () {
                        $scope.transportAPIdata.recList.splice(index, 1);
                    }, function () {

                    });
                }
            });
        };


        function selectAll() {
            $scope.skuSelected = [];
            for (var i = 0; i < $scope.vs.my.delete.data.recList.length; i++) {
                $scope.skuSelected.push(i);
            }
        }

        //租赁任务js结束
        vm.goList = function () {
            $state.go("main.leasingAsset.record", null, {reload: true});
        };
    }


})();
