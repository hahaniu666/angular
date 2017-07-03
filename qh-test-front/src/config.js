(function () {
    angular.module('qh-test-front')

        .config(['$urlMatcherFactoryProvider', function ($urlMatcherFactoryProvider) {
            $urlMatcherFactoryProvider.strictMode(false);
        }])

        .config(['$urlRouterProvider', function ($urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
        }])

        // .config(['$mdThemingProvider', function ($mdThemingProvider) {
        //     $mdThemingProvider
        //         .theme('default')
        //         .primaryPalette('grey', {
        //             'default': '800'
        //         });
        // }])

        // 配置: $httpProvider
        // 使用 $http 相关方法是，可以额外传递以下选项
        // boolean skipGlobalErrorHandler ： 是否跳过全局异常处理
        // boolean notShowError : 如果进行了全局异常处理，则是否弹出错误消息提示
        // boolean showLoginError:当code为NOT_LOGINED时候，如果进行了全局异常处理，showLoginError为false的时候那么就是不弹出错误提示。(默认是false)
        .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

            $provide.factory('myHttpInterceptor', ['$log', '$q', 'errorService', function ($log, $q, errorService) {
                return {
                    // optional method
                    'response': function (response) {
                        // 配置禁止全局异常处理
                        if (response.config.skipGlobalErrorHandler) {
                            return response;
                        }

                        // 非JSON数据
                        var contentType = response.headers('Content-Type');
                        if (!contentType || contentType.indexOf('application/json') !== 0) {
                            return response;
                        }

                        // JSON 响应结果是成功的结果
                        var respData = response.data;
                        if (respData && respData.code && respData.code === 'SUCCESS'
                            || respData && respData.code && respData.raw === true) {
                            return response;
                        }

                        // 默认错误结果
                        var resultJson = {
                            msg: "服务器异常，请稍后重试",
                            raw: false,  // 始终为false
                            code: 'ERROR',
                            rawMsg: null
                        };

                        if (typeof respData.code === 'string' && respData.code) {
                            resultJson.code = respData.code;

                            if (respData.code !== 'SUCCESS') {
                                if (respData.raw) {
                                    if (respData.msg) {
                                        resultJson.rawMsg = respData.msg;
                                    }
                                } else {
                                    if (respData.msg) {
                                        resultJson.msg = respData.msg;
                                    }
                                }
                            }
                        }
                        if (resultJson.code === 'NOT_LOGINED') {
                            if (!response.config.notShowError && response.config.showLoginError) {
                                errorService.errors(resultJson.msg);
                            }
                        } else {
                            if (!response.config.notShowError) {
                                errorService.errors(resultJson.msg);
                            } else if (resultJson.code === "ERROR") {
                                errorService.errors(resultJson.msg);
                            }
                        }

                        response.oldData = response.data;
                        response.data = resultJson;
                        return $q.reject(response);
                    },

                    // 401 404 500 等错误
                    'responseError': function (response) {
                        // 配置禁止全局异常处理
                        if (response.config.skipGlobalErrorHandler) {
                            return $q.reject(response);
                        }


                        // 默认错误结果
                        var resultJson = {
                            msg: "系统错误，请稍后重试",
                            raw: false,  // 始终为false
                            code: 'ERROR',
                            rawMsg: null
                        };

                        var contentType = response.headers('Content-Type');
                        if (contentType == null) {
                            resultJson.msg = "网络连接异常";
                            resultJson.code = "UNKNOWN";
                        } else if (contentType && (contentType.indexOf('application/json') === 0)) {
                            var respData = response.data;
                            if (typeof respData.code === 'string' && respData.code) {
                                resultJson.code = respData.code;
                            }
                            if (respData.raw) {
                                if (respData.msg) {
                                    resultJson.rawMsg = respData.msg;
                                }
                            } else {
                                if (respData.msg) {
                                    resultJson.msg = respData.msg;
                                }
                            }
                        }
                        if (resultJson.code === 'NOT_LOGINED') {
                            if (!response.config.notShowError && response.config.showLoginError) {
                                errorService.errors(resultJson.msg);
                            }
                        } else {
                            if (resultJson.code !== "UNKNOWN" && !response.config.notShowError) {
                                errorService.errors(resultJson.msg);
                            } else if (resultJson.code == "UNKNOWN") {
                                //errorService.errors(resultJson.msg, true);    //暂时注释掉自定义的错误
                            }
                        }
                        response.oldData = response.data;
                        response.data = resultJson;

                        return $q.reject(response);
                    }
                };
            }]);

            $httpProvider.interceptors.push('myHttpInterceptor');
        }])

        .run(['$rootScope', '$interval', '$state', '$stateParams', '$log', '$cacheFactory', 'errorService', "appConfig", 'wxService',
            function ($rootScope, $interval, $state, $stateParams, $log, $cacheFactory, errorService, appConfig, wxService) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                // 缓存商品的详情
                $rootScope.itemCache = $cacheFactory('itemCache');
                // 缓存网店详情
                $rootScope.agentCache = $cacheFactory('agentCache');
                // 缓存公司详情
                $rootScope.pageCache = $cacheFactory('pageCache');
                // 缓存活动详情
                $rootScope.activityCache = $cacheFactory('activityCache');
                // 缓存蚕丝被翻新添补各类的介绍详情
                $rootScope.serviceOrderCache = $cacheFactory('serviceOrderCache');
                // 服务承诺详情
                $rootScope.productCache = $cacheFactory('productCache');
                // 前端商品的活动后的商品进行的缓存
                $rootScope.activitySkuCache = $cacheFactory('activitySkuCache');


                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                    var url = window.location.href;
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (!window.cordova) {
                        // 检查url是否输入错误
                        // 查找url中的#
                        var o = url.indexOf("#");
                        var y = url.indexOf("?");
                        if (o > 0 && (y > o || y === -1)) {
                            // 替换新的url  重新刷新url
                            url = url.substr(0, o) + "?showwxpaytitle=1" + url.substr(o);
                            location.href = url;
                        }
                    }
                    $interval.cancel($rootScope.intervalStop);
                    $rootScope.intervalStop = null;
                    if (window.cordova) {
                        if (cordova.platformId === 'ios') {
                            var toStates = ["main.center", "main.wallet", "main.wallet.balanceDetail", "main.user.codee", "main.vip", "main.vip.myPoints", "main.unionOrder"]; // #333333
                            for (var i = 0; i < toStates.length; i++) {
                                if (toStates[i] === toState.name) {
                                    StatusBar.backgroundColorByHexString("#101010");
                                    StatusBar.styleLightContent();
                                    return;
                                }
                            }
                            StatusBar.backgroundColorByHexString("#FFF");
                            StatusBar.styleDefault();
                        }
                    }
                });

                $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                    //$log.debug("$stateNotFound : fromState = " + JSON.stringify(fromState.name) + ", toState = " + JSON.stringify(unfoundState.name));
                });

                // $rootScope.wxLinsteners ={
                //     "${stateName}":{
                //         onShareWxRing: function1,
                //         onShareWxFriend: function2,
                //     }
                // }

                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    console.log("--------------------$stateChangeSuccess");
                    /*
                     *
                     * wxService.registShare(state, callback)
                     *
                     *
                     *
                     * */


                    wxService.initShareOnStart();
                    $rootScope.errorsMsg = true;
                    $log.debug("$stateChangeSuccess : fromState = " + JSON.stringify(fromState.name) + ", toState = " + JSON.stringify(toState.name));
                });
                $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                    $log.debug("$stateChangeError : fromState = " + JSON.stringify(fromState.name) + ", toState = " + JSON.stringify(toState.name) + ", error = ", error);
                    // 未登录
                    // https://github.com/angular-ui/ui-router/issues/42
                    if (error && error.data && error.data.code === 'NOT_LOGINED') {
                        //errorService.errors(error.data.msg ? error.data.msg : "请先登录", function () {
                        $rootScope._savedState = {
                            fromStateName: fromState.name,
                            fromStateParams: fromParams
                        };
                        var url = window.location.href;
                        var boo = false;
                        if (toState.name === "main.vip") {
                            url = window.location.href + "vip?s=1";
                        } else if (toState.name === "main.unionOrder") {
                            url = window.location.href + "unionOrder?s=1";
                        } else if (toState.name === "main.center") {
                            url = window.location.href + "center?s=1";
                        } else if (toState.name === "main.staffactivity") {
                            boo = true;
                        }
                        if (boo) {
                            wxService.wxLogin(url);
                        } else {
                            $state.go("main.newLogin", {backUrl: url});
                        }

                    }
                });

                $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
                });
                $rootScope.$on('$viewContentLoaded', function (event) {
                });
            }])

        .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }])

        .run(['updateService', function (updateService) {
            ///////////// 设置品牌的cookie
            // 获取参数
            var params = window.location.hash;
            // 查找是否有品牌的id
            var indexOfBrand = params.indexOf("brandId");
            // 有品牌的参数进行放入cookie
            if (params.indexOf("brandId") > -1) {
                // 从品牌处分割
                params = params.substring(indexOfBrand);
                // 获取当前的参数
                // 有其他参数则进行分割
                if (params.indexOf("&") > -1) {
                    params = params.substring(0, params.indexOf("&"));
                }
                // 分割字符串
                var paramMap = params.split("=");
                // 参数正确才进行设置
                if (paramMap.length == 2) {
                    if (paramMap[1] == 'null') {
                        paramMap[1] = '-1';
                    }
                    document.cookie = paramMap[0] + '=' + paramMap[1];
                }
            } else {
                document.cookie = 'brandId=;-1';
            }
            updateService.init();
        }])

        .run(['updateService', '$cookies', function (updateService, $cookies) {
            ///////////// 设置品牌的cookie
            // 获取参数
            var params = window.location.hash;
            // 查找是否有品牌的id
            var indexOfStaffactivity = params.indexOf("#/staffactivity");
            var indexOfFromId = params.indexOf("fromId");
            // 有品牌的参数进行放入cookie
            if (indexOfStaffactivity > -1 && params.indexOf("fromId") > -1) {
                // 从品牌处分割
                params = params.substring(indexOfFromId);
                // 获取当前的参数
                // 有其他参数则进行分割
                if (params.indexOf("&") > -1) {
                    params = params.substring(0, params.indexOf("&"));
                }
                // 分割字符串
                var paramMap = params.split("=");
                // 参数正确才进行设置
                if (paramMap.length == 2) {
                    if (paramMap[1] == 'null') {
                        paramMap[1] = '-1';
                    }
                    document.cookie = "staffactivity_" + paramMap[0] + '=' + paramMap[1];
                }
            } else {
                document.cookie = 'staffactivity_fromId=;-1';
            }
            //console.log($cookies.get("staffactivity_fromId"));
            updateService.init();
        }])

        //存储门店id
        .run(['updateService', function (updateService) {
            ///////////// 设置品牌的cookie
            // 获取参数
            var params = window.location.hash;
            // 查找是否有品牌的id
            var indexOfOrg = params.indexOf("orgId");
            // 有品牌的参数进行放入cookie
            if (indexOfOrg > -1) {
                // 从组织处分割
                params = params.substring(indexOfOrg);        //orgId=xxx&aaa=xxx
                // 获取当前的参数
                // 有其他参数则进行分割
                if (params.indexOf("&") > -1) {
                    params = params.substring(0, params.indexOf("&"));      //orgId=xxx
                }
                // 分割字符串
                var paramMap = params.split("=");
                // 参数正确才进行设置
                if (paramMap.length == 2) {
                    if (paramMap[1] == 'null') {
                        paramMap[1] = '-1';
                    }
                    document.cookie = paramMap[0] + '=' + paramMap[1];
                }
            } else {
                document.cookie = 'orgId=;-1';
            }
            document.cookie = 'userOrg=;-1';
        }])

        //存储title
        .run(['$rootScope', '$cookies', function ($rootScope, $cookies) {
            ///////////// 设置品牌的cookie
            // 获取参数
            var params = window.location.hash;
            // 查找是否有品牌的id
            var indexOfTitle = params.indexOf("title");
            // 有品牌的参数进行放入cookie
            if (indexOfTitle > -1) {
                // 从组织处分割
                params = params.substring(indexOfTitle);        //title=xxx&aaa=xxx

                console.log('params1', params);
                // 获取当前的参数
                // 有其他参数则进行分割
                if (params.indexOf("?") > -1) {
                    params = params.substring(0, params.indexOf("?"));      //title=xxx
                    console.log('params2', params);

                }
                // 分割字符串
                var paramMap = params.split("=");
                // 参数正确才进行设置
                if (paramMap.length == 2) {
                    if (paramMap[1] == 'null') {
                        paramMap[1] = '-1';
                    }
                    document.cookie = paramMap[0] + '=' + paramMap[1];
                }
                if ($cookies.get('title')) {
                    $rootScope.title = $cookies.get('title');
                } else {
                    $rootScope.title = '商城';
                }
            } else {
                document.cookie = 'title=;-1';
            }
            document.cookie = 'userOrg=;-1';
        }])
        //存储首页选项卡indexActive= 1 2 3 4
        // .run(['$rootScope', '$cookies', function ($rootScope, $cookies) {
        //     ///////////// 设置品牌的cookie
        //     // 获取参数
        //     var params = window.location.hash;
        //     // 查找是否有品牌的id
        //     var indexOfindexActive = params.indexOf("indexActive");
        //     // 有品牌的参数进行放入cookie
        //     if (indexOfindexActive > -1) {
        //         // 从组织处分割
        //         params = params.substring(indexOfindexActive);        //indexActive=xxx&aaa=xxx
        //         // 获取当前的参数
        //         // 有其他参数则进行分割
        //         if (params.indexOf("&") > -1) {
        //             params = params.substring(0, params.indexOf("&"));      //indexActive=xxx
        //         }
        //         // 分割字符串
        //         var paramMap = params.split("=");
        //         // 参数正确才进行设置
        //         if (paramMap.length == 2) {
        //             if (paramMap[1] == 'null') {
        //                 paramMap[1] = '-1';
        //             }
        //             document.cookie = paramMap[0] + '=' + paramMap[1];
        //         }
        //         $rootScope.indexActive = $cookies.get('indexActive');
        //
        //     } else {
        //         document.cookie = 'indexActive=;-1';
        //     }
        //     document.cookie = 'userOrg=;-1';
        // }])
        .run(['$mdDialog', '$state', function ($mdDialog, $state) {
            if (document.querySelector("html").classList.contains("js") && document.querySelector("html").classList.contains("flexbox") && document.querySelector("html").classList.contains("flexwrap")) {
            } else {
                $mdDialog.show({
                    templateUrl: 'views/main/service/security/validate/chaxunDialog/index.root.html',
                    parent: angular.element(document.body).find('#qh-wap'),
                    targetEvent: null,
                    clickOutsideToClose: false,
                    fullscreen: false,
                    controller: ['$scope', '$mdDialog', '$state', 'urlbackService', function ($scope, $mdDialog, $state, urlbackService) {
                        var vm = this;
                        vm.msg = '暂不支持该浏览器,请下载火狐或谷歌浏览器!';
                        vm.title = '错误';
                        vm.rightButton = "前往下载";
                        vm.checkSubmit = function () {
                            urlbackService.urlBack("http://rj.baidu.com/soft/detail/14744.html?ald");
                        };

                    }],
                    controllerAs: "vm"
                }).then(function (answer) {

                }, function () {
                    alert('失败');
                });
            }
        }])

        //追加静态资源
        .run(['$http', 'appConfig', 'wxService', function ($http, appConfig, wxService) {
            $http.get(appConfig.apiPath + "/common/sysConf?key=appendStaticResource")
                .then(function (resp) {
                    var list = resp.data.value;
                    for (var i = 0; i < list.length; i++) {
                        var newLink = document.createElement("link");
                        newLink.setAttribute("rel", "stylesheet");
                        newLink.setAttribute("href", list[i].url);
                        document.head.appendChild(newLink);
                    }
                }, function () {

                });
            //wxService.initShareOnStart('', '');
            // wxService.initShare();
        }]);
})();