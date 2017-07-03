(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 学生租赁&酒店租赁
         */
        $stateProvider.state("main.studentLease", {
            url: '/studentLease?category&child&leaseType',
            views: {
                "@": {
                    templateUrl: 'views/main/studentLease/index.root.html',
                    controllerAs: 'vm',
                    controller: studentLeaseController
                }
            }
        });
    }]);
    studentLeaseController.$inject = ['$scope', '$http', '$state', '$httpParamSerializer', 'appConfig', "alertService", "$timeout", "urlbackService", "imgService"];
    function studentLeaseController($scope, $http, $state, $httpParamSerializer, appConfig, alertService, $timeout, urlbackService, imgService) {
        var vm = this;
        /**
         * 首页用做url跳转的链接
         * @param url
         */
        vm.clickUrl = function (url) {
            urlbackService.urlBack(url);
        };
        $scope.appConfig = appConfig;
        $scope.data = '';
        $scope.swipers = {};
        $scope.swiperss = {};
        $scope.imgService = imgService;

        $scope.curPage = 1;                         //保存当前页
        $scope.pageSize = 20;                       
        $scope.isEnd = false;                       //是否是最后一页

        ////记录各分类的状态,暂不使用


        if ($state.params.leaseType === 'student') {
            $state.params.leaseType = 'STUDENT';
            $state.params.ren = 'STUDENT_RENT';
            $scope.titleName = '学生租赁';
        } else if ($state.params.leaseType === 'hotel') {
            $state.params.leaseType = 'HOTEL';
            $state.params.ren = 'RENT_QUILT';
            $scope.titleName = '酒店租赁';
        } else {
            history.back();
        }
        // 回退页面
        $scope.fallbackPage = function () {
            $state.go("main.index", null, {reload: true});
        };
        //首页轮播图片
        $http({
            method: 'GET',
            url: appConfig.apiPath + "/common/imgCarousel?type=" + $state.params.leaseType + "_RENT_CAROUSEL"
        }).then(function (resp) {
            $scope.data = resp.data;
            $timeout(function () {
                $scope.swipers.update();
            }, 1);
        }, function () {
            alertService.msgAlert('ks-cancle','失败');
        });

        //广告头条
        $scope.bannerMsg = '';
        $http({
            method: 'GET',
            url: appConfig.apiPath + "/common/imgCarousel?type=" + $state.params.leaseType + "_RENT_TOP"
        }).then(function (resp) {
            $scope.bannerMsg = resp.data;
        }, function () {
            alertService.msgAlert('ks-cancle','失败');
        });

        //精选套餐轮播图片
        $scope.taocan = '';
        $http({
            method: 'POST',
            url: appConfig.apiPath + "/item/search",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: $httpParamSerializer({
                curPage: 1,
                pageSize: 10,
                prop: 'itemStatus:NORMAL;categorySysType:' + $state.params.ren + ';itemCategoryCodes:' + $state.params.child
            })
        }).then(function (resp) {
            $scope.taocan = resp.data;
            $timeout(function () {
                $scope.swiperss.update();
            }, 1);
        }, function () {
            alertService.msgAlert('ks-cancle','失败');
        });

        //热门分类标题
        $scope.fenleiTitle = '';
        $http({
            method: 'GET',
            url: appConfig.apiPath + "/category/list?pageSize=10&curPage=1&children=1&sysType=" + $state.params.ren + "&code=" + $state.params.category
            /*1472102247024*/
        }).then(function (resp) {
            $scope.list = resp.data.recList[0];     //获取的子分类信息
            //根据list的顺序得出此处要传第一个code
            $scope.shopList(0);
        }, function () {
            alertService.msgAlert('ks-cancle','失败1');
        });

        //初始化商品标题选中样式
        $scope.initShow = function () {
            for (var i = 0; i < $scope.list.children.length; i++) {
                $scope.list.children[i].shows = false;
            }
        };

        //切换商品分类列表
        $scope.shopList = function (index) {
            //如果点击的是当前分类
            if ($scope.list.children[index].shows === true) {
                return;
            }

            $scope.initShow();
            $scope.list.children[index].shows = true;
            $scope.childrencode = $scope.list.children[index].code;
            $scope.curPage = 1;             //切换分类，回到第一页
            $scope.isEnd = false;
            vm.pageChanged();
        };

        vm.pageChanged = function () {

            $http({
                method: 'POST',
                url: appConfig.apiPath + "/item/search",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                data: $httpParamSerializer({
                    curPage: $scope.curPage,
                    pageSize: $scope.pageSize,
                    prop: 'itemStatus:NORMAL;categorySysType:' + $state.params.ren + ';itemCategoryCodes:' + $scope.childrencode
                })
            }).then(function (resp) {
                //区分是不是第一页，第一页直接赋值，非第一页追加
                if ($scope.curPage > 1) {
                    $scope.shangpin.items = $scope.shangpin.items.concat(resp.data.items);
                } else {
                    $scope.shangpin = resp.data;
                }
                var num = 0;        //临时保存页数
                //计算总页数
                if (resp.data.totalCount % resp.data.pageSize === 0) {
                    num = resp.data.totalCount / resp.data.pageSize;
                } else {
                    num = resp.data.totalCount / resp.data.pageSize + 1;
                }
                if ($scope.curPage === Math.floor(num)) {
                    //最后一页，隐藏点击加载更多
                    $scope.isEnd = true;
                    return;
                }
                $scope.curPage++;
            }, function () {
                alertService.msgAlert('ks-cancle','失败');
            });
        };
        //商品详情链接
        $scope.goItems = function (item) {
            $state.go("main.item", {
                itemId: item.itemId,
                skuId: item.skuId,
                type: "Student"
            }, null);
        };
    }
})();