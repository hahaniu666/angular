(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 订单付款
         */
        $stateProvider.state("main.previewTemplate", {
            url: '/previewTemplate?id',
            views: {
                "@": {
                    templateUrl: 'views/main/previewTemplate/index.root.html',
                    controller: previewTemplateController
                }
            }
        });
    }]);
    previewTemplateController.$inject = ['$scope', '$state', '$cookies', '$templateCache', '$http', 'appConfig', "imgService", "$timeout", "urlbackService", '$rootScope', '$interval', '$filter'];
    function previewTemplateController($scope, $state, $cookies, $templateCache, $http, appConfig, imgService, $timeout, urlbackService, $rootScope, $interval, $filter) {
        var vm = this;

        $scope.show = false;
        $scope.appConfig = appConfig;
        $scope.imgService = imgService;
        $scope.slideImg = imgService.slideImg;
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.indexBelowImg = imgService.indexBelowImg;
        $scope.curPage = 1;
        /*定义三个ks-swiper*/
        $scope.swiper = {}; // 通过 <ks-swiper-slide> 设定
        $scope.swiper2 = {}; // 通过 <ks-swiper-slide> 设定

        $scope.moreSwiper = {};
        /*下载模板代码*/
        $scope.lodeModel = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/templateIndex/info?id=' + $state.params.id,

            }).then(function (resp) {
                var tplUrl = "/___/store/xxxx/index/tpl";
                $scope.tplUrl = tplUrl;
                $templateCache.put(tplUrl, resp.data.aceHtml);

                /*由于加载swiper有延迟，所以加timeout解决*/
                $scope.getHotDiscuss();
                $scope.getList();
                $timeout(function () {
                    $scope.lodeSwiper();
                    $scope.show = true;
                    $scope.swiper.update();
                    $scope.swiper2.update();
                }, 200);
            }, function (err) {
            });
        };
        $scope.lodeModel();


        /*swiper定义的选项卡*/
        $scope.lodeSwiper = function () {
            $scope.show = true;
            var swiper = new Swiper('.aaa', {
                wrapperClass: 'my-wrapper',
                slideClass: 'my-slide',
                pagination: '.my-swiper-pagination',
                slidesPerView: 'auto',
                paginationClickable: true,
                spaceBetween: 25,
                roundLengths: true,
                freeModeSticky: true,
                freeMode: true,
                /*    breakpoints: {
                 //当宽度小于等于320
                 320: {
                 slidesPerView: 3,
                 spaceBetweenSlides: 10
                 }
                 }*/
            });

            var Swiper1 = new Swiper('#swiper-container1', {
                wrapperClass: 'my-wrapper1',
                slideClass: 'my-slide1',
                autoplay: 2000,
                speed: 800,
                slidesPerView: 2,
                slidesPerGroup: 2,
                direction: 'vertical',
                paginationClickable: true,
                mousewheelControl: true,
                loop: true,
                autoplayDisableOnInteraction: false,
                preventClicks: false,
            });
        };
        //热门话题
        $scope.getHotDiscuss = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/cmsPage/list?type=SUBJECT&brandId=56f8e97c0cf2a98fe2d4d6e0&status=NORMAL&isHot=true&pageSize=0&curPage=0"
            }).then(function (resp) {
                $scope.hotList = resp.data;
                $timeout(function () {
                    $scope.swiper2.update()
                }, 100)
            });
        };


        $timeout(function () {
            $scope.lodeSwiper();
            $scope.show = true;
            //$scope.swiper.update();
            //$scope.swiper2.update(); // FIXME
        }, 200);
        /*选项卡增加底线*/
        $scope.active = $cookies.indexActive ? $cookies.indexActive : 1;
        $cookies.indexActive = $scope.active;
        $scope.clickThis = function (num) {
            $scope.lodeModel();
            $scope.active = num;
            $cookies.indexActive = $scope.active;
            if (num == '1') {
                $timeout(function () {
                    $scope.getHotDiscuss();
                    $scope.getNews();
                    $scope.swiper2.update();
                }, 200);
            }

        };

        // 点击搜索跳转到搜索页面去
        $scope.searchItem = function () {
            $state.go("main.search");
        };


        $scope.clickUrl = function (url) {
            urlbackService.urlBack(url);
        };

        //获取专题列表
        $scope.getList = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/cmsPage/list?type=TOPIC&brandId=56f8e97c0cf2a98fe2d4d6e0&status=NORMAL&pageSize=10&curPage=" + $scope.curPage
            }).then(function (resp) {
                var data = resp.data;
                $scope.list = data;

            })
        };
        $scope.getList();


        //获取快报信息
        $scope.getNews = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/wapIndex/list?type=TOP&brandId=56f8e97c0cf2a98fe2d4d6e0"
            }).then(function (resp) {
                var newsData = resp.data;
                $scope.news = newsData;
                $timeout(function () {
                    $scope.lodeSwiper();
                }, 200);
            })
        };
        $scope.getNews();


        //获取限时抢购今日特卖
        $scope.getLimit = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/activity/list?pageSize=10&curPage=" + $scope.curPage
            }).then(function (resp) {
                var limitData = resp.data;
                $scope.limitList = limitData;
                $scope.endTime = [];
                $rootScope.intervalStop = [];
                for (var i = 0; i < $scope.limitList.recList.length; i++) {
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

            }, 1000);
        }

        $scope.getLimit();
        $scope.getHotDiscuss();


        $scope.getGroupOrder = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/groupBuy/groupBuyList?pageSize=30"
            }).then(function (resp) {
                $scope.orderList = resp.data;
                console.log('$scope.orderList====>>>', $scope.orderList);
            });
        };
        $scope.getGroupOrder();

    }
})();