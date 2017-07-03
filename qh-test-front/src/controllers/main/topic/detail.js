(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state("main.topic.topicdetail", {
            url: "/topicdetail?id",
            views: {
                "@": {
                    templateUrl: 'views/main/topic/detail/index.root.html',
                    controllerAs: "vm",
                    controller: topicDetailController
                }
            }
        });
    }]);
    topicDetailController.$inject = ['$http', '$state', 'appConfig', "alertService", 'imgService', '$httpParamSerializer'];
    function topicDetailController($http, $state, appConfig, alertService, imgService, $httpParamSerializer) {
        var vm = this;
        vm.imgUrl = appConfig.imgUrl;
        vm.simpleImg = imgService.simpleImg;
        vm.slideImg = imgService.slideImg;
        vm.imgService = imgService;
        vm.myComment = {};
        vm.id = $state.params.id;
        vm.curPage = 1;
        vm.pageSize = 10;
        //话题详情
        vm.getInfo = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/cmsPage/info?id=" + vm.id
            }).then(function (resp) {
                var data = resp.data;
                vm.info = data.info;
            })
        };
        vm.getInfo();
        //评论信息
        vm.getComment = function (page) {
            $http({
                method: "GET",
                url: appConfig.apiPath + "/cmsPage/listComment?id=" + vm.id + "&pageSize=10&curPage=" + vm.curPage
            }).then(function (resp) {
                var data = resp.data;
                if (data.code === "SUCCESS") {
                    if (vm.curPage > 1) {
                        for (var i = 0; i < data.recList.length; i++) {
                            vm.cmList.recList.push(data.recList[i]);
                        }
                        vm.curPage = page;
                    } else {
                        vm.cmList = data;
                    }
                    vm.curPage = data.curPage + 1;
                    vm.totalCount = data.totalCount;
                    /**
                     * 判断是否是最后一页
                     */
                    if (data.totalCount % vm.pageSize !== 0) {
                        if (Math.floor(data.totalCount / vm.pageSize) + 1 === data.curPage) {
                            vm.pageEnd = true;
                        }
                    } else {
                        if (Math.floor(data.totalCount / vm.pageSize) === data.curPage) {
                            vm.pageEnd = true;
                        }
                    }
                    //如果只有一页
                    if (data.totalCount <= vm.pageSize) {
                        vm.pageEnd = true;
                        vm.curPage = 1;
                    }
                }
            })
        };
        vm.getComment();
        //写评论
        vm.creatCm = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + "/cmsPage/comment",
                data: {
                    id: vm.id,
                    content: vm.myComment.xt
                }
            }).then(function (resp) {
                var data = resp.data;
                if (data.code === 'SUCCESS') {
                    $state.reload();
                }
            }, function (resp) {
                var data = resp.data;
                if (data.code === 'NOT_LOGINED') {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                    return;
                }
            })
        };
        //点赞
        vm.vote = function () {
            $http({
                method: "POST",
                url: appConfig.apiPath + "/cmsPage/vote",
                data: {id: vm.id}
            }).then(function (resp) {
                var data = resp.data;
                if (data.code === 'SUCCESS') {
                    vm.getInfo();
                }
            }, function (resp) {
                var data = resp.data;
                if (data.code === 'NOT_LOGINED') {
                    $state.go("main.newLogin", {backUrl: window.location.href});
                    return;
                }
            })


        };
        // 回退页面
        vm.fallbackPage = function () {
            if (vm.id) {
                $state.go("main.topic", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();