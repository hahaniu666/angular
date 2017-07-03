// 开发环境的配置
angular.module('qh-test-front').factory('appConfig', function () {

    // // -------------------------- mock api
    // var domain = "http://dev.test.me";
    // var rootPath = domain + "/qh/admin/mock/";
    // var apiPath = rootPath + "/16025/api";

    // // -------------------------- 测试环境 api
    var domain = "//kingsilk.net";
    //domain = "http://dev.test.me";
    var rootPath = domain + "/qh/mall/local/?_ddnsPort=16300&wxPub=jngy";
    // var apiPath = domain + "/qh/mall/api";
    var apiPath = domain + "/qh/mall/local/11300/api";
    var appVersion = "3.0.0";
    return {
        rootPath: rootPath,
        share: "https:" + rootPath + "#/share",
        apiPath: apiPath,
        appVersion: appVersion,
        maxSize: 5,  // 页数多少多少翻页数
        pageSize: 10, // 每页多少条数据
        imgUrl: "//img.kingsilk.net/",   // 图片地址
        cdnUrl: "//img.kingsilk.net/qh-test-front/prod/",// cdn地址访问本地图片
        imgView1: "?imageView2/2/w/500/h/500",// 对图片进行缩放(首页)
        imgView2: "?imageView2/2/w/100/h/100",// 对图片进行缩放(用户中心)
        imgUpload: "/common/uploadImgS",
        tokenImg: apiPath + "/common/generatorToken",
        indexUrl: "https://kingsilk.net/qh/mall/jngy/?_ddnsPort=16500#/",
        storeUrl: "https://kingsilk.net/qh/mall/jngy/wineshop.html?_ddnsPort=16500#/store/",
        screenshotImgApi: "http://192.168.0.13:10190/qh/html/api/img?",
        dwzApiPath: 'https://dwz.kingsilk.net/admin/local/11300/rs/api/dwz/addDwz',     //添加短网址，返回data
        dwzUrlPath: 'https://dwz.kingsilk.net/admin/local/11300/rs/api/s/',             //data 直接加在后边
        // wxDebug: false
    };
});
