(function () {
    angular.module('qh-test-front', [
            'ngResource',
            'ui.router',
            //'angular-flexslider',
            //'ui.bootstrap',
            //'ngTouch', // 目前只有轮播图在用ngTouch, 但ngTouch会重写ngClick
            'ngAnimate',
            'ngSanitize',
            'ngCookies',
            'monospaced.qrcode',
            //'mobile-angular-ui',
            //'mobile-angular-ui.gestures',
            'qh-test-front.views',
            //'infinite-scroll'
            //"ct.ui.router.extras",
            "ksSwiper",
            //"pageslide-directive",
            'ngMaterial',
            'ngMessages'
        ])

        .config(['$urlMatcherFactoryProvider', function ($urlMatcherFactoryProvider) {
            $urlMatcherFactoryProvider.strictMode(false);
        }])

        .config(['$urlRouterProvider', function ($urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
        }])

        // 可以回退的状态
        .constant('backStates', {
            "main.back.ccc": [
                "main.back.bbb"
            ],
            "main.back.bbb": [
                "main.back.aaa"
            ],
            "main.back.aaa": [
                "main.back.list"
            ]
        })


        .factory('uiList', function clientIdFactory() {
            return [{
                name: "主页效果图 - 整体布局",
                state: "main.index"
            },

                {
                    name: "侧边栏菜单",
                    state: "main.sidenav"
                },
                {
                    name: "主题色UI组件",
                    state: "main.ksTheme"
                },
                {
                    name: "图片占位",
                    state: "main.imgHolder"
                },
                {
                    name: "swiper model变更",
                    state: "main.swiper"
                },
                {
                    name: "福利舍",
                    state: "main.welfare"
                }, {
                    name: "10元小福利舍",
                    state: "main.welfareSmall"
                },
                {
                    name: "购物车",
                    state: "main.cart"
                },
                {
                    name: "订单确认",
                    state: "main.confirmOrder"
                },
                {
                    name: "发票列表",
                    state: "main.invoice.list"
                },
                {
                    name: "发票新增",
                    state: "main.invoice.add"
                },
                {
                    name: "注册页面",
                    state: "main.register"
                },
                {
                    name: "登录页面",
                    state: "main.login"
                },
                {
                    name: "商品详情",
                    state: "main.productDetail"
                },
                {
                    name: "订单列表",
                    state: "main.orderList"
                },
                {
                    name: "我的登录",
                    state: "main.center"
                },
                {
                    name: "订单详情待支付",
                    state: "main.orderDetail"
                },
                {
                    name: "订单详情已支付",
                    state: "main.confirm"
                },
                {
                    name: "订单详情待确认",
                    state: "main.payment"
                },
                {
                    name: "支付方式",
                    state: "main.payStyle"
                },
                {
                    name: "忘记密码",
                    state: "main.retrievePassword"
                },
                {
                    name: "个人中心",
                    state: "main.personCenter"
                },
                {
                    name: "待支付订单跟踪",
                    state: "main.orderTrack"
                },
                {
                    name: "申请退款",
                    state: "main.refund"
                },
                {
                    name: "申请售后",
                    state: "main.collect"
                },
                {
                    name: "登录密码",
                    state: "main.loginPassword"
                },
                {
                    name: "性别",
                    state: "main.sex"
                },
                {
                    name: "收货地址",
                    state: "main.shippingAddress"
                },
                {
                    name: "添加地址",
                    state: "main.addAddress"
                },
                {
                    name: "评价",
                    state: "main.evaluation"
                },
                {
                    name: "查看评价",
                    state: "main.viewEvaluation"
                },
                {
                    name: "退货信息",
                    state: "main.returnInform"
                },
                {
                    name: "申请换货",
                    state: "main.applyReplacement"
                },
                {
                    name: "申请维修",
                    state: "main.applyMaintenance"
                },
                {
                    name: "退货退款",
                    state: "main.returnRefund"

                },
                {
                    name: "用户名",
                    state: "main.userName"
                },
                {
                    name: "绑定手机号",
                    state: "main.bindTelNum"
                },
                {
                    name: "绑定邮箱",
                    state: "main.bindEmail"
                },
                {
                    name: "邮箱",
                    state: "main.email"
                },
                {
                    name: "更换邮箱",
                    state: "main.changeEmail"
                },
                {
                    name: "支付密码",
                    state: "main.payPassword"
                },
                {
                    name: "我的二维码",
                    state: "main.twoCode"
                },
                {
                    name: "订单详情待评价",
                    state: "main.assess"
                },
                {
                    name: "订单详情待评价",
                    state: "main.finishAssess"
                },
                {
                    name: "我的myCenter",
                    state: "main.myCenter"
                },
                {
                    name: "订单提交成功",
                    state: "main.orderSuccess"
                },
                {
                    name: "购物须知",
                    state: "main.counsel"
                },
                {
                    name: "防伪验证",
                    state: "main.antiCounterfeiting"
                },
                {
                    name: "验证记录",
                    state: "main.verifyLog"
                },
                {
                    name: "验证结果",
                    state: "main.verifyResult"
                }, {
                    name: "已选产品",
                    state: "main.selsectProduct"
                },
                {
                    name: "帐号绑定",
                    state: "main.bindAccounts"
                }, {
                    name: "推广页面",
                    state: "main.extension"
                },
                {
                    name: "佣金页面",
                    state: "main.commission"
                },
                {
                    name: "引入会员",
                    state: "main.introduceUser"
                },
                {
                    name: "推广帮助",
                    state: "main.promotionHelp"
                },
                {
                    name: "提现记录",
                    state: "main.presentRecord"
                },
                {
                    name: "退款详情",
                    state: "main.refundDetail"
                },
                {
                    name: "测试上传控件",
                    state: "main.Test"
                },
                {
                    name: "交易记录",
                    state: "main.transactionRecord"
                },
                {
                    name: "交易记录筛选",
                    state: "main.filterRecord"
                },
                {
                    name: "余额明细",
                    state: "main.balanceDetail"
                },
                {
                    name: "提现",
                    state: "main.withdraw"
                },
                {
                    name: "充值",
                    state: "main.recharge"
                },
                {
                    name: "充值卡",
                    state: "main.rechargeCard"
                },
                {
                    name: "绑定银行卡",
                    state: "main.bindCard"
                },
                {
                    name: "银行卡详情",
                    state: "main.cardinfo"
                },
                {
                    name: "学生活动报名",
                    state: "main.signUp"
                },
                {
                    name: "更多",
                    state: "main.more"
                },
                {
                    name: "意见反馈",
                    state: "main.feedBack"
                },
                {
                    name: "关于我们",
                    state: "main.aboutUs"
                }]
                ;
        })

        .config(['$mdThemingProvider', function ($mdThemingProvider) {
            $mdThemingProvider
                .theme('default')
                .primaryPalette('grey', {
                    'default': '800'
                });
        }])

        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main", {
                abstract: true,

                // 通过 resolve 获取的数据，只要state不重新加载，就不会重新发送http请求，
                // 因此可以在子状态之间临时保存一些数据，然后一起提交到服务器上
                resolve: {}
            });
        }]);
})();
