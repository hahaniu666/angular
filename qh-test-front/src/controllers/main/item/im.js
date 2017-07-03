// (function () {
//
//     angular.module('qh-test-front').config(['$stateProvider', function ($stateProvider) {
//         /**
//          * 购物咨询
//          */
//         $stateProvider.state("main.item.im", {
//             url: "/im",
//             resolve: {
//                 curUser: ['userService', function (userService) {
//                     return userService.getCurUser(true, true);
//                 }]
//             },
//             views: {
//                 "@": {
//                     templateUrl: 'views/main/item/im/index.root.html',
//                     controller: imController,
//                     controllerAs: 'vm'
//                 }
//             }
//         });
//     }]);
//     imController.$inject = ['$scope', '$http', '$state', 'appConfig', 'curUser'];
//     function imController($scope, $http, $state, appConfig, curUser) {
//
//         var vm = this;
//
//         vm.curUser = curUser.data;
//         // console.log('curUser:' + vm.curUser.userInfo.name);
//
//         vm.toUser = 'qhAdmin';          //临时写死，测试
//
//         $scope.gotoTop = function () {
//             window.scrollTo(0, 0);//滚动到顶部
//         };
//         $scope.gotoTop();
//
//         $scope.fallbackPage = function () {
//             if (history.length === 1) {
//                 $state.go("main.item", null, {reload: true});
//             } else {
//                 history.back();
//             }
//         };
//
//         //初始化im聊天，快速开发版
//         vm.initIm = function () {
//             WKIT.init({
//                 container: document.getElementById('content'),
//
//                 uid: vm.curUser.userInfo.name,       //需要登录的用户nick
//                 appkey: '23423859',
//                 credential: 'kingsilk',   //需要登录的用户密码( 就是通过 [taobao.openim.users.add] (//open.taobao.com/doc2/apiDetail.htm?apiId=24164)导入的password字段)
//                 touid: vm.toUser,     //需要聊天的nick
//
//                 themeBgColor: '#2db769',
//                 themeColor: '#fff',
//                 msgBgColor: '#2db769',
//                 msgColor: '#fff',
//
//                 avatar: '',
//                 toAvatar: 'http://o96iiewkd.qnssl.com/4be89a6c24ebf60f9ca8166e53facaf0%3FimageView2/1/w/600/h/600',     //客服头像
//
//                 autoMsg: window.location.hash,      //appConfig.rootPath +
//                 //welcomeMsg: 'abcdefhhg',      //欢迎消息，非发送的
//                 titleBar: true,
//                 title: '小皇叔',
//                 customUrl: 'https://www.taobao.com/market/seller/openim/mitem.php',
//
//                 //上传图片成功
//                 onUploaderSuccess: function (error) {
//                     // console.log('上传成功');
//                 },
//                 //上传图片失败
//                 onUploaderError: function (error) {
//                     // console.log('上传失败');
//                 },
//                 //接管上传图片按钮
//                 beforeImageUploaderTrigger: function () {
//                     // console.log('接管上传图片');
//                 },
//                 //后退按钮监听
//                 onBack: function () {
//                     // console.log('click back');
//                     $scope.fallbackPage();
//                 },
//                 //消息接收后回调
//                 onMsgReceived: function (data) {
//                     // console.log(data);
//                 },
//                 //消息发送后回调
//                 onMsgSent: function (data) {
//                     // console.log(data);
//                 },
//                 //登录成功的回调
//                 onLoginSuccess: function (data) {
//                     // console.log('登录成功', data);
//                 },
//                 //登录失败回调
//                 onLoginError: function (data) {
//                     // console.log('登录失败', data);
//                     // vm.login();
//                 }
//             });
//         };
//         vm.initIm();
//
//         //判断浏览器是否支持
//         window.__WSDK__POSTMESSAGE__DEBUG__ = function (error) {
//             // console.log(error);
//             alert('浏览器不支持，请切换浏览器');
//         };
//     }
// })();