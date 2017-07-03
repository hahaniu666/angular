(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
        /**
         * 友情链接
         */
        $stateProvider.state("main.search", {
            url: "/search",
            views: {
                "@": {
                    templateUrl: 'views/main/search/index.root.html',
                    controller: searchController,
                    controllerAs: "vm"
                }
            }
        });
    }]);

    // ----------------------------------------------------------------------------
    searchController.$inject = ['$http', '$state', 'imgService', 'appConfig'];
    function searchController($http, $state, imgService, appConfig) {
        var storage = window.localStorage;
        var vm = this;
        vm.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        vm.gotoTop();
        vm.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };

        vm.imgService = imgService;
        vm.appConfig = appConfig;
        vm.states = [];
        $http.get(appConfig.apiPath + '/item/hotSearch')
            .success(function (data) {
                // 将格式转换为搜索使用的
                for (var i = 0; i < data.recList.length; i++) {
                    vm.states.push({value: data.recList[i], display: data.recList[i]});
                }
            });

        // 搜索的历史
        vm.locateStates = storage.getItem("locates");
        if (!vm.locateStates) {
            vm.locateStates = [];
        } else {
            vm.locateStates = vm.locateStates.split(",");
        }
        // 完成搜索历史,查询和添加
        vm.locateSearch = function (locate) {
            if (locate) {
                // 是否有相同的cookie
                var boo = false;
                for (var i = 0; i < vm.locateStates.length; i++) {
                    if (vm.locateStates[i] === locate) {
                        boo = true;
                        break;
                    }
                }
                // 没有相同的cookie，进行添加
                if (!boo) {
                    vm.locateStates.unshift(locate);
                    if (vm.locateStates.length > 5) {
                        vm.locateStates.splice(5, vm.locateStates.length - 5);
                    }
                    storage.setItem("locates", vm.locateStates.join());
                    // Pass a key name and its value to add or update that key.
                }
            }
        };
        vm.locateSearch(null);
        // 清空历史框
        vm.removeCookie = function (locate) {
            for (var i = 0; i < vm.locateStates.length; i++) {
                if (vm.locateStates[i] === locate) {
                    vm.locateStates.splice(i, 1);
                    break;
                }
            }
            storage.setItem("locates", vm.locateStates.join());
            // Pass a key name and its value to add or update that key.
        };
        //清空全部搜索历史
        vm.removeCookieAll = function () {
            vm.locateStates = [];
            storage.setItem("locates", vm.locateStates.join());
            // Pass a key name and its value to add or update that key.
        };
        // 进行搜索，搜索时候将搜索的值放入cookie
        vm.search = function (text, boo) {
            //console.log(vm.searchText)
            if (boo) {
                vm.locateSearch(text);
            }
            $state.go("main.category", {keyWord: text});
        };
        // 清除搜索的值
        vm.searchTextCancel = function () {
            vm.searchText = "";
        };

    }
})();