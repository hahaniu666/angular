(function () {

    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 主页
         */
        $stateProvider.state("main.index", {
            url: "/?tplId&clear&orgId&isLoginTrue&act",
            views: {
                "@": {
                    templateUrl: 'views/main/index.html',
                    controller: IndexController,
                    controllerAs: 'vm'
                }
            }
        });
    }]);

    // ----------------------------------------------------------------------------
    SidenavController.$inject = ['$scope'];
    function SidenavController($scope) {
        $scope.leftOpen = true;
        $scope.openLeftMenu = function () {
            $scope.leftOpen = !$scope.leftOpen;
        };
    }

    IndexController.$inject = ['$scope', '$state', '$cookies', '$templateCache', '$http', 'appConfig', "imgService", "$timeout", "urlbackService", '$rootScope', '$interval', '$filter', 'orderService', '$mdDialog', '$httpParamSerializer', 'wxService', '$location'];
    function IndexController($scope, $state, $cookies, $templateCache, $http, appConfig, imgService, $timeout, urlbackService, $rootScope, $interval, $filter, orderService, $mdDialog, $httpParamSerializer, wxService, $location) {
        var vm = this;

        // 定义swiper   注意：只能用$scope.xxx= {}
        $scope.appConfig = appConfig;
        $scope.imgService = imgService;
        $scope.slideImg = imgService.slideImg;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.indexBelowImg = imgService.indexBelowImg;
        $scope.curPage = 1;

        $scope.swiper1 = {};
        $scope.swiper2 = {};

        $interval.cancel($rootScope.intervalStop);
        $rootScope.intervalStop = null;
        $scope.getSwiper = function () {
            $timeout(function () {
                var swiper1 = new Swiper('.swiper-container1', {
                    wrapperClass: 'my-wrapper1',
                    slideClass: 'my-slide1',
                    slidesPerView: 4,
                    // centeredSlides: true,
                    paginationClickable: true,
                    spaceBetween: 0,
                    iOSEdgeSwipeDetection: true,
                    setWrapperSize: true,

                });

                var swiper2 = new Swiper('.swiper-container2', {
                    wrapperClass: 'my-wrapper2',
                    slideClass: 'my-slide2',
                    autoplay: 2000,
                    speed: 800,
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    direction: 'vertical',
                    paginationClickable: true,
                    // mousewheelControl: true,
                    // loop: true,
                    autoplayDisableOnInteraction: false,
                    preventClicks: false,
                });

                var swiper3 = $rootScope.swiper3 = new Swiper('.swiper-container3', {
                    wrapperClass: 'my-wrapper3',
                    slideClass: 'my-slide3',
                    slidesPerView: 2,
                    centeredSlides: true,
                    paginationClickable: true,
                    spaceBetween: 0,
                    iOSEdgeSwipeDetection: true,
                    setWrapperSize: true,
                    // loop: true,
                });

                $scope.getNews(swiper2);
            }, 50);

        };
        $scope.getSwiper();
        /*
         * 获取可变数据
         * */
        $scope.getData = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/jngy/list",
            }).then(function (resp) {
                    $scope.allData = resp.data;
                    $scope.jngyItemList = resp.data.jngyItemList;
                    $scope.jngyItems = resp.data.jngyItems;

                    $scope.jxjnData = [];
                    $scope.shjnData = [];
                    $scope.smjnData = [];
                    $scope.hotData = [];

                    $scope.carouselDate = [];

                    for (name in $scope.jngyItemList) {
                        if ($scope.jngyItemList[name].name == 'JXJN') {
                            $scope.jxjnData.push($scope.jngyItemList[name].data);
                            for (var i = 0; i < $scope.jxjnData[0].length; i++) {
                                $scope.jxjnData[0][0].itemTitle = '公主日记';
                                $scope.jxjnData[0][1].itemTitle = '婚庆用品';
                            }
                        }
                        if ($scope.jngyItemList[name].name == 'SHJN') {
                            $scope.shjnData.push($scope.jngyItemList[name].data);
                            for (var i = 0; i < $scope.shjnData[0].length; i++) {
                                $scope.shjnData[0][0].itemTitle = '花好月圆';
                                $scope.shjnData[0][1].itemTitle = '金玉良缘';
                            }

                        }
                        if ($scope.jngyItemList[name].name == 'SMJN') {
                            $scope.smjnData.push($scope.jngyItemList[name].data);
                            for (var i = 0; i < $scope.smjnData[0].length; i++) {
                                $scope.smjnData[0][0].itemTitle = '夏凉被芯';
                                $scope.smjnData[0][1].itemTitle = '子母被芯';
                            }
                        }
                        if ($scope.jngyItemList[name].name == 'HOT') {
                            $scope.hotData.push($scope.jngyItemList[name].data);
                            $scope.hotItemId = $scope.hotData[0][0].itemId;
                            $scope.hotSkuId = $scope.hotData[0][0].skuId;
                        }

                        if ($scope.jngyItemList[name].name == 'CAROUSEL') {
                            $scope.carouselDate.push($scope.jngyItemList[name].data);
                            $timeout(function () {
                                // $rootScope.swiper3.removeAllSlides();
                                $rootScope.swiper3.slideTo(1, 100, false);
                                $rootScope.swiper3.update();
                            }, 100);
                        }
                    }
                    $scope.purchaseDate = [];
                    $scope.goodsDate = [];

                    $scope.jxjn1Date = [];
                    $scope.smjn1Date = [];
                    $scope.shjn1Date = [];
                    for (name in $scope.jngyItems) {
                        if ($scope.jngyItems[name].name == 'PURCHASE') {
                            $scope.purchaseDate.push($scope.jngyItems[name].data);
                            $scope.purchaseImg = $scope.purchaseDate[0][0].itemImg;
                            $scope.purchaseId = $scope.purchaseDate[0][0].itemId;
                            $scope.purchaseSkuId = $scope.purchaseDate[0][0].skuId;
                        }
                        if ($scope.jngyItems[name].name == 'GOODS') {
                            $scope.goodsDate.push($scope.jngyItems[name].data);
                            $scope.goodsImg = $scope.goodsDate[0][0].itemImg;
                            $scope.goodsId = $scope.goodsDate[0][0].itemId;
                            $scope.goodsSkuId = $scope.goodsDate[0][0].skuId;
                        }

                        if ($scope.jngyItems[name].name == 'JXJN1') {
                            $scope.jxjn1Date.push($scope.jngyItems[name].data);
                            $scope.jxjn1Img = $scope.jxjn1Date[0][0].itemImg;
                            $scope.jxjn1Id = $scope.jxjn1Date[0][0].itemId;
                            $scope.jxjn1SkuId = $scope.jxjn1Date[0][0].skuId;
                        }
                        if ($scope.jngyItems[name].name == 'SMJN1') {
                            $scope.smjn1Date.push($scope.jngyItems[name].data);
                            $scope.smjn1Img = $scope.smjn1Date[0][0].itemImg;
                            $scope.smjn1Id = $scope.smjn1Date[0][0].itemId;
                            $scope.smjn1SkuId = $scope.smjn1Date[0][0].skuId;
                        }
                        if ($scope.jngyItems[name].name == 'SHJN1') {
                            $scope.shjn1Date.push($scope.jngyItems[name].data);
                            $scope.shjn1Img = $scope.shjn1Date[0][0].itemImg;
                            $scope.shjn1Id = $scope.shjn1Date[0][0].itemId;
                            $scope.shjn1SkuId = $scope.shjn1Date[0][0].skuId;
                        }

                    }


                }, function () {
                }
            );
        };
        $scope.getData();
        //获取快报信息
        $scope.getNews = function (swiper2) {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/wapIndex/list?type=TOP&brandId=56f8e97c0cf2a98fe2d4d6e0"
            }).then(function (resp) {
                var newsData = resp.data;
                $scope.news = newsData;
                $timeout(function () {
                    swiper2.update();
                }, 30);
            })
        };

        $scope.lodeModel = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/templateIndex/info?id=58ca3b372a308115b7cefb76',

            }).then(function (resp) {

                var json = resp.data.categoryJson;
                $scope.jsons = JSON.parse(json);
                //json格式转码
                var codes = $scope.jsons;
                $rootScope.codes = $scope.jsons;
                var codeString = "";
                for (var i = 0; i < codes.length; i++) {
                    codeString += "&code=" + codes[i].category;
                }
                $scope.getCategory(codeString, codes);

            }, function (err) {
            });
        };
        $scope.lodeModel();


        $scope.act = $state.params.act ? $state.params.act : '1';
        // $scope.act = '1';


        //快报点击按钮
        $scope.clickUrl = function (url) {
            urlbackService.urlBack(url);
        };

        //热门话题
        $scope.getHotDiscuss = function (s) {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/cmsPage/list?type=SUBJECT&brandId=56f8e97c0cf2a98fe2d4d6e0&status=NORMAL&isHot=true&pageSize=0&curPage=0"
            }).then(function (resp) {
                $scope.hotList = resp.data;
                $timeout(function () {
                    s.update()
                }, 100)
            });
        };

        //获取限时抢购今日特卖
        $scope.getLimit = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/activity/list?pageSize=10&brandName=JIANGNANGUYUN&curPage=" + $scope.curPage
            }).then(function (resp) {
                var limitData = resp.data;
                $scope.limitList = limitData;


                $scope.endTime = [];
                $rootScope.intervalStop = [];

                for (var i = 0; i < $scope.limitList.recList.length; i++) {
                    $scope.limitList.recList[0].name = '限时抢购';
                    $scope.limitList.recList[1].name = '限时特价';
                    $scope.endTime[i] = $scope.limitList.recList[i].endTime;
                    $scope.limitList.recList[i].activityCheck = {};
                    test(i);
                }

            });
        };
        function test(i) {
            $rootScope.intervalStop[i] = $interval(function () {
                var date = new Date().getTime();
                var oldDate = new Date($filter("date")($scope.endTime[i], "yyyy/MM/dd HH:mm:ss")).getTime();
                // 倒计时到零时，停止倒计时
                var rest = oldDate - date;
                if (rest <= 0) {
                    $scope.limitList.recList[i].activityCheck = null;
                    $interval.cancel($rootScope.intervalStop[i]);
                    $rootScope.intervalStop[i] = null;
                    return;
                }
                var leftsecond = parseInt(rest / 1000);
                var day1 = Math.floor(leftsecond / (60 * 60 * 24));
                var hour1 = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
                var minute1 = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour1 * 3600) / 60);
                var second1 = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour1 * 3600 - minute1 * 60);

                $scope.limitList.recList[i].activityCheck.day = day1;
                $scope.limitList.recList[i].activityCheck.hour = hour1;
                $scope.limitList.recList[i].activityCheck.minute = minute1;
                $scope.limitList.recList[i].activityCheck.second = second1;
                // $scope.limitList.recList[i].activityCheck.hour2 = day1 * 24 + hour1;
            }, 1000);
        }

        $scope.getLimit();

        /*
         * 床品养护
         * */
        $scope.getCategory = function (codeString) {
            //code,获取所有的大类
            $http({
                method: "GET",
                url: appConfig.apiPath + "/category/list?children=1" + codeString
            }).then(function (resp) {
                var dataCategory = resp.data;
                if (dataCategory.code === "SUCCESS") {
                    $scope.categoryList = dataCategory.recList;
                    $scope.code = $scope.categoryList[0].code;
                    $scope.childcode = $scope.categoryList[0].code;
                    $scope.changeType($scope.code, $scope.childcode);
                }
            }, function () {
                $scope.fallbackPage();
            });
        };
        //遍历标题设置为false状态
        $scope.initList = function () {
            for (var j = 0; j < $scope.categoryList.length; j++) {
                for (var i = 0; i < $scope.categoryList[j].children.length; i++) {
                    $scope.categoryList[j].children[i].check = false;
                }
                $scope.categoryList[j].check = false;
            }
        };
        //这个是给子类切换用的状态,用来ngIf
        $scope.initActive = function () {
            for (var j = 0; j < $scope.categoryList.length; j++) {
                for (var i = 0; i < $scope.categoryList[j].children.length; i++) {
                    $scope.categoryList[j].children[i].active = false;
                }
            }
        };
        $scope.changeType = function (info, c_info) {
            //code是用来查询大类的评价\详情,c_code是子类商品
            $scope.code = info;
            $scope.childcode = c_info;
            $scope.curPage = 1;
            $scope.comment = {};
            $scope.initActive();
            $scope.initList();
            //获取大类的详情
            for (var i = 0; i < $rootScope.codes.length; i++) {
                if ($rootScope.codes[i].category === 'info' || $rootScope.codes[i].category === info) {
                    $scope.cms = $rootScope.codes[i].cmsId;
                }
            }
            //判断商品是不是已经请求过了
            for (var k = 0; k < $scope.categoryList.length; k++) {
                $scope.categoryList[k].shows = false;
            }
            for (var j = 0; j < $scope.categoryList.length; j++) {
                if ($scope.categoryList[j].code === info) {
                    $scope.categoryList[j].shows = true;
                    $scope.categoryList[j].check = true;
                    if ($scope.categoryList[j].service_item) {
                        return;
                    }
                }
            }
            //获取商品
            $http({
                method: "POST",
                data: $httpParamSerializer({
                    prop: "itemCategoryCodes:" + $scope.childcode,
                    sort: "minSkuPrice+",
                    curPage: 1,
                    pageSize: 99,
                    detail: 1
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                url: appConfig.apiPath + "/item/search"
            }).then(function (resp) {
                var itemData = resp.data;
                $scope.initList();
                if (!itemData.items) {
                    return;
                }
                for (var j = 0; j < $scope.categoryList.length; j++) {
                    if ($scope.categoryList[j].code === c_info) {
                        //定义sku数组
                        if ($scope.categoryList[j].code === info) {
                            $scope.categoryList[j].shows = true;
                        }
                        $scope.categoryList[j].service_all = [];
                        $scope.categoryList[j].check = true;
                        $scope.categoryList[j].check = true;
                        $scope.categoryList[j].service_item = itemData.items;
                        $scope.categoryList[j].active = true;
                        for (var i = 0; i < $scope.categoryList[j].service_item.length; i++) {
                            for (var k = 0; k < $scope.categoryList[j].service_item[i].sku.length; k++) {
                                $scope._tempsku = $scope.categoryList[j].service_item[i].sku[k];
                                var tmp = $scope._tempsku.title.split(';');
                                $scope._tempsku.title = tmp[tmp.length - 1];
                                $scope.categoryList[j].service_all.push($scope._tempsku);
                                $scope._tempsku.num = 0;
                            }
                        }
                    }
                    // }
                }

            }, function () {
                $scope.fallbackPage();
            });
        };
        $scope.getItem = function (order) {
            $state.go("main.item", {itemId: order.itemId}, {reload: true});
        };


        /*
         * 拼团
         * */
        $scope.getGroupOrder = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/groupBuy/groupBuyList?pageSize=30&brandName=JIANGNANGUYUN"
            }).then(function (resp) {
                $scope.orderList = resp.data;
            });
        };
        $scope.getGroupOrder();


        /*
         * 聚划算等跳转
         * */
        $scope.goState = function (type) {
            $state.go('main.newPage', {type: type}, {reload: true})
        };


        $scope.btnClick = function (num) {
            $scope.act = num;
            if (num == '1') {
                $scope.getSwiper();
                $scope.getData();

            }
            // $state.go('main.index', {act: num}, {reload: true})
        };
    }
})();



