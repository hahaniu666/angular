(function () {
    angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 二级产品分类下查询商品信息
         */
        $stateProvider.state("main.category", {
            url: "/category?keyWord&categoryName&type&s&brandId",
            resolve: {
                // 当前的用户信息
                curUser: ['userService', function (userService) {
                    var curUser = userService.getCurUser(true, false);
                    return curUser;
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/category/index.root.html',
                    controllerAs: 'vm',
                    controller: categoryController
                }
            }
        });
    }]);
    categoryController.$inject = ['$http', '$state', '$rootScope', '$interval', '$filter',
        '$httpParamSerializer', 'appConfig', 'imgService', '$mdDialog', '$stateParams', 'alertService', "curUser"];
    function categoryController($http, $state, $rootScope, $interval, $filter,
                                $httpParamSerializer, appConfig, imgService, $mdDialog, $stateParams, alertService, curUser) {
        var vm = this;
        //品牌信息
        vm.brandId = $stateParams.brandId;
        vm.type = $stateParams.type;
        //如果没传type，则是通过搜索过来的
        if (!vm.type) {
            vm.type = 'all';
        }
        vm.commodity = {overAll: "综合", all: true, upDn: 1};
        if ($state.params.keyWord) {
            vm.commodity.title = $state.params.keyWord;
            // 防止搜索输入值后，被实时刷新值
            vm.commodity.search = vm.commodity.title;
            vm.commodity.all = false;
        } else {
            vm.commodity.title = "全部商品";
        }
        vm.gotoTop = function () {
            window.scrollTo(0, 0);//滚动到顶部
        };
        vm.gotoTop();
        vm.user = curUser.data;

        //保存用户组织信息，在查询租赁商品时有用
        vm.orgType = null;
        if (vm.user.code === 'SUCCESS') {
            vm.orgType = vm.user.userInfo.org;
        }

        // 回退页面
        vm.fallbackPage = function () {
            $state.go("main.index", null, {reload: true});
        };

        // 获取购物车数量有多少个SKU

        // 用户获取分类的产品

        vm.sort = "";
        vm.prop = "";
        vm.keyWord = $state.params.keyWord;

        // 进行获取所有的分类的值
        vm.getCategory = function () {
            $http.get(appConfig.apiPath + "/item/category?children=1&type=" + vm.type)
                .success(function (data) {
                    vm.categoryList = data.categoryList;
                    // 将分类的值进行重新组装需要展示的值
                    for (var i = 0; i < vm.categoryList.length; i++) {
                        // 每个只节点有个全部，但是需要指定搜索的名字，
                        if (!vm.categoryList[i].children) {
                            vm.categoryList[i].children = [];
                        }
                        // 需要将数组添加到第一个
                        vm.categoryList[i].children.splice(0, 0, {
                            id: vm.categoryList[i].id,
                            name: vm.categoryList[i].name,
                            parent: true
                        });
                    }
                });
        };

        vm.searchInit = function () {
            // 对参数进行默认值处理
            vm.sort = "";
            vm.prop = "";
            if ($state.params.type && $state.params.type === 'rent') {
                if (vm.orgType === 'HOTEL' || vm.orgType === 'PLATFORM') {
                    vm.prop = "itemStatus:NORMAL;categorySysType:RENT_QUILT;";
                } else {
                    vm.fallbackPage();
                }
            } else if ($state.params.type && $state.params.type === 'stuRent') {
                if (vm.orgType === 'SCHOOL' || vm.orgType === 'PLATFORM') {
                    vm.prop = "itemStatus:NORMAL;categorySysType:STUDENT_RENT;";
                } else {
                    vm.fallbackPage();
                }
            } else if ($state.params.type && $state.params.type === 'service') {
                vm.prop = "itemStatus:NORMAL;categorySysType:SERVICE;";
            } else if ($state.params.type && $state.params.type === 'order') {
                if (vm.brandId) {
                    vm.prop = "itemStatus:NORMAL;categorySysType:QUILT;brandId:" + vm.brandId + ";";
                } else {
                    vm.prop = "itemStatus:NORMAL;categorySysType:QUILT;";
                }

            } else {
                //搜索，列出所有分类
                if (vm.user.code === "SUCCESS" && vm.user.userInfo.org) {
                    vm.type = 'ALL';        //大写表示列出全部分类，即包括租赁
                    if (vm.orgType === 'SCHOOL') {
                        vm.prop = "itemStatus:NORMAL;categorySysType:QUILT,SERVICE,STUDENT_RENT;";
                    } else if (vm.orgType === 'HOTEL') {
                        vm.prop = "itemStatus:NORMAL;categorySysType:QUILT,SERVICE,RENT_QUILT;";
                    } else if (vm.orgType === 'PLATFORM') {
                        vm.prop = "itemStatus:NORMAL;categorySysType:QUILT,SERVICE,RENT_QUILT,STUDENT_RENT;";
                    } else if (vm.orgType === 'EXPRESS') {
                        vm.prop = "itemStatus:NORMAL;categorySysType:QUILT;";
                        vm.type = 'all';
                    } else {
                        vm.fallbackPage();
                    }
                    if (vm.brandId) {
                        vm.prop += "brandId:" + vm.brandId + ";";
                    }
                } else {
                    vm.prop = "itemStatus:NORMAL;categorySysType:QUILT;";
                    vm.type = 'all';        //小写表示列出除租赁外的全部分类
                }
            }
            if (!vm.keyWord) {
                vm.keyWord = "";
            }
            vm.getCategory();
        };
        // 分类的到了后面可能会进行会进行更改,所以不放init中
        if (!$state.params.categoryName) {
            vm.categoryName = "";
        } else {
            vm.prop = vm.prop + "itemCategoryNames:" + $state.params.categoryName + ';';
        }

        vm.searchInit();

        vm.pageSize = appConfig.pageSize;
        vm.maxSize = appConfig.maxSize;
        vm.imgUrl = appConfig.imgUrl;
        vm.simpleImg = imgService.simpleImg;
        vm.loadMorePage = {curPage: 0, page: 1};
        //默认不显示
        vm.searchItemEs = function (curPage, boo) {
            $http({
                method: "POST",
                url: appConfig.apiPath + '/item/search',
                data: $httpParamSerializer({
                    sort: vm.sort,
                    prop: vm.prop,
                    keyWord: vm.keyWord,
                    curPage: curPage,
                    pageSize: vm.pageSize
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (resp) {
                var data = resp.data;
                if (!vm.items || !vm.items.items || boo) {
                    vm.items = data;
                } else {
                    vm.items.items = vm.items.items.concat(data.items);
                }
                var page = parseInt(vm.items.totalCount / vm.items.pageSize);
                if (vm.items.totalCount % vm.items.pageSize > 0) {
                    page++;
                }
                vm.loadMorePage.page = page;
                if (page <= vm.items.curPage) {
                    vm.items.pageEnd = true;
                } else {
                    vm.items.curPage = vm.items.curPage + 1;
                }
                vm.reddit.after = "t3_" + vm.items.items[vm.items.items.length - 1].id;
                vm.reddit.busy = false;
            });
        };

        vm.search = function () {
            // 防止搜索输入值后，被实时刷新值
            $state.go("main.category", {keyWord: vm.commodity.search}, null);
        };

        // 进行获取所有的分类的值
        $http.get(appConfig.apiPath + "/item/queryProp")
            .success(function (data) {
                vm.filterList = data;
            });
        //弹出筛选框
        vm.showScreen = function (ev, status) {
            // 商品的搜索模块，进行加载各种搜索条件
            // 进行搜索选择，最上面的选择面板搜索
            $mdDialog.show({
                templateUrl: 'views/main/category/screen/index.root.html',
                parent: angular.element(document.body).find('#qh-wap'),
                /*targetEvent: ev,*/
                /*clickOutsideToClose: true,*/
                fullscreen: true,
                controllerAs: "vms",
                disableParentScroll: true,
                controller: [function () {
                    // 进行选择的框
                    var vms = this;
                    if (!vm.searchs) {
                        // 使用父类的 防止，保存多次刷新
                        vm.searchs = {
                            category: {view: false, category: vm.categoryList},
                            filter: {view: false, season: vm.filterList, minPrice: 0, maxPrice: 0},
                            all: {view: true, all: true, min: false, max: false}
                        };
                    }

                    // 所有的数据选择框,使用父类的进行保存
                    vms.searchs = vm.searchs;
                    // 首页进行点击复位
                    vms.viewInit = function () {
                        // 前端界面点击效果的进行初始化
                        vms.searchs.category.view = false;
                        vms.searchs.filter.view = false;
                        vms.searchs.all.view = false;
                    };
                    // 分类搜索进行复位
                    vms.categoryInit = function () {
                        for (var i = 0; i < vms.searchs.category.category.length; i++) {
                            for (var y = 0; y < vms.searchs.category.category[i].children.length; y++) {
                                vms.searchs.category.category[i].children[y].view = false;
                            }
                        }
                    };
                    // 筛选搜索进行复位
                    vms.filterSeasonInit = function () {
                        for (var y = 0; y < vms.searchs.filter.season.recList.length; y++) {
                            vms.searchs.filter.season.recList[y].view = false;
                        }
                    };
                    //
                    vms.viewInit();
                    if (ev === 1) {
                        vms.searchs.all.view = true;
                    } else if (ev === 2) {
                        vms.searchs.category.view = true;
                    } else {
                        vms.searchs.filter.view = true;
                    }
                    // 进行搜索选择，最上面的选择面板搜索

                    vms.search = function (status) {
                        vms.viewInit();
                        if (status === 1) {
                            vms.searchs.all.view = true;
                        } else if (status === 2) {
                            vms.searchs.category.view = true;
                        } else {
                            vms.searchs.filter.view = true;
                        }
                    };
                    vms.search(status);
                    // 综合下的搜索
                    vms.allSearch = function (status) {
                        vms.searchs.all.all = false;
                        vms.searchs.all.min = false;
                        vms.searchs.all.max = false;
                        if (status === 1) {
                            vms.searchs.all.all = true;
                            vm.sort = "";
                            vms.successCloseOpen();
                            vm.commodity.overAll = "综合";
                            vm.commodity.upDn = 1;
                        } else if (status === 2) {
                            vm.sort = "minSkuPrice-";
                            vms.searchs.all.min = true;
                            vms.successCloseOpen();
                            vm.commodity.overAll = "价格";
                            vm.commodity.upDn = 2;
                        } else {
                            vm.sort = "minSkuPrice+";
                            vms.searchs.all.max = true;
                            vms.successCloseOpen();
                            vm.commodity.overAll = "价格";
                            vm.commodity.upDn = 3;
                        }
                        vms.checkSubmit();

                    };
                    // 综合下的搜索
                    vms.categorySearch = function (child) {
                        vms.categoryInit();
                        child.view = true;
                        // 分类的进行筛选

                        vms.checkSubmit();
                    };
                    vms.cancel = function () {
                        // 清楚搜索的单选框
                        vms.categoryInit();
                        vms.filterSeasonInit();
                        vms.searchs.all.all = true;
                        vms.searchs.all.min = false;
                        vms.searchs.all.max = false;
                    };
                    vms.filterSeason = function (season) {
                        vms.filterSeasonInit();
                        season.view = true;
                    };
                    vms.checkSubmit = function () {
                        // 搜索重置初始化
                        vm.searchInit();
                        if (vms.searchs.all.min) {
                            vm.sort = "minSkuPrice+";
                        } else if (vms.searchs.all.max) {
                            vm.sort = "minSkuPrice-";
                        }
                        // 分类的进行筛选
                        for (var i = 0; i < vms.searchs.category.category.length; i++) {
                            for (var y = 0; y < vms.searchs.category.category[i].children.length; y++) {
                                if (vms.searchs.category.category[i].children[y].view) {
                                    vm.prop = vm.prop + "itemCategoryNames:" + vms.searchs.category.category[i].children[y].name + ';';
                                }
                            }
                        }
                        for (var z = 0; z < vms.searchs.filter.season.recList.length; z++) {
                            if (vms.searchs.filter.season.recList[z].view) {
                                vm.prop = vm.prop + vms.searchs.filter.season.name + ":" + vms.searchs.filter.season.recList[z].name + ';';
                            }
                        }
                        // 对价格进行输入错误的回正
                        if (isNaN(vms.searchs.filter.minPrice)) {
                            vms.searchs.filter.minPrice = 0;
                        }
                        if (isNaN(vms.searchs.filter.maxPrice)) {
                            vms.searchs.filter.maxPrice = 0;
                        }
                        // 保证价格输入的是int类型
                        vms.searchs.filter.minPrice = parseInt(vms.searchs.filter.minPrice);
                        vms.searchs.filter.maxPrice = parseInt(vms.searchs.filter.maxPrice);
                        if (vms.searchs.filter.minPrice < 0 || vms.searchs.filter.minPrice > 999999) {
                            alertService.msgAlert("exclamation-circle", "筛选价格不能小于0并且大于6位数");
                            return;
                        }
                        if (vms.searchs.filter.maxPrice < 0 || vms.searchs.filter.maxPrice > 999999) {
                            alertService.msgAlert("exclamation-circle", "筛选价格不能小于0并且大于6位数");
                            return;
                        }

                        // 筛选输入的价格
                        if (vms.searchs.filter.minPrice > 0 && vms.searchs.filter.maxPrice > 0) {
                            if (vms.searchs.filter.minPrice > vms.searchs.filter.maxPrice) {
                                alertService.msgAlert("exclamation-circle", "价格筛选最低价格超过最高价格");
                                return;
                            }
                            vm.prop = vm.prop + "minSkuPrice:" + (vms.searchs.filter.minPrice * 100) + '~' + (vms.searchs.filter.maxPrice * 100) + ";";
                        } else if (vms.searchs.filter.minPrice > 0 && vms.searchs.filter.maxPrice === 0) {
                            vm.prop = vm.prop + "minSkuPrice:" + (vms.searchs.filter.minPrice * 100) + "~;";
                        } else if (vms.searchs.filter.maxPrice > 0 && vms.searchs.filter.minPrice === 0) {
                            vm.prop = vm.prop + "minSkuPrice:~" + (vms.searchs.filter.maxPrice * 100) + ";";
                        }

                        $mdDialog.hide(true);
                    };
                    vms.closeOpen = function () {
                        $mdDialog.hide(false);
                    };
                    vms.successCloseOpen = function () {
                        $mdDialog.hide(true);
                    };
                }]
            })
                .then(function (selectedItem) {
                    if (selectedItem) {
                        vm.searchItemEs(1, true);
                    }
                }, function () {
                });
        };
        $rootScope.intervalStop = null;
        // 计算离今天还有多少时间
        vm.startTime = function () {
            $rootScope.intervalStop = $interval(function () {
                var date = new Date().getTime();
                for (var i = 0; i < vm.items.items.length; i++) {
                    if (vm.items.items[i].activityTime) {
                        var oldDate = new Date($filter("date")(vm.items.items[i].activityTime, "yyyy/MM/dd HH:mm:ss")).getTime();
                        // 倒计时到零时，停止倒计时
                        var rest = oldDate - date;

                        if (rest <= 0) {
                            continue;
                        }
                        // 天
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
                        vm.items.items[i].formatTime = days + "天" + hours + "时" + minutes + "分" + seconds + "秒";
                    }
                }
            }, 1000);
        };

        // 查询商品的详细信息
        vm.queryItem = function (item) {
            $state.go("main.item", {
                itemId: item.itemId,
                skuId: item.skuId,
                //categoryId: vm.categoryId,
                itemName: vm.keyWord
            }, {reload: true});
        };

        // 分页
        vm.pageChanged = function () {
            vm.searchItemEs(vm.items.curPage);
        };

        var Reddit = function () {
            this.items = [];
            this.busy = false;
            this.after = '';
        };

        Reddit.prototype.nextPage = function () {
            if (vm.loadMorePage.curPage >= vm.loadMorePage.page) {
                return;
            }
            if (this.busy) return;
            this.busy = true;
            vm.loadMorePage.curPage = vm.loadMorePage.curPage + 1;
            vm.searchItemEs(vm.loadMorePage.curPage);
        };
        vm.reddit = new Reddit();  
    }
})();