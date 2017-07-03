(function () {

    /**
     * img-holder
     *
     *  使用方法: <img ng-src="{{xxx}}" img-holder missing-img="xxxVar" loading-img="xxxVar" >
     *
     *  目前， 图片未加载完是的图片和404加载出错的图片都是透明的，依靠CSS设置背景颜色和背景图片显示占位内容。
     */
    angular.module('qh-test-front').provider("imgHolder", function () {

        var imgHolder = this;
        this.loadingImg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" version="1.1"><rect style="fill:%23000;fill-opacity:0.0;" x="0" y="0" width="100%" height="100%"/></svg>';
        this.missingImg = this.loadingImg;

        this.$get = ["$log", function ($log) {
            return {
                loadingImg: imgHolder.loadingImg,
                missingImg: imgHolder.missingImg
            };
        }];
    }).directive('imgHolder', ['$q', 'imgHolder', function ($q, imgHolder) {

        return {
            restrict: 'A',
            priory: 90,
            scope: {
                loadingImg: '@',
                missingImg: '@'
            },

            link: function (scope, element, attrs) {

                attrs.$observe("src", function (imgSrc) {

                    var _DATA_DEFERRED = "img-holder-deferred",

                        _REJECT_C = "img-holder-canceled",
                        _REJECT_E = "img-holder-error",

                        _CLASS_L = "img-loading",
                        _CLASS_D = "img-loaded",
                        _CLASS_E = "img-error";

                    var oldDeferred = element.data(_DATA_DEFERRED);
                    if (oldDeferred) {
                        oldDeferred.reject(_REJECT_C);
                    }

                    var deferred = $q.defer();
                    element.data(_DATA_DEFERRED, deferred);

                    deferred.promise.then(function (loadedSrc) {
                        element.removeClass(_CLASS_L);
                        element.addClass(_CLASS_D);
                        element.attr('src', loadedSrc);
                    }, function (reason) {
                        if (reason === _REJECT_C) {
                            return;
                        }
                        element.removeClass(_CLASS_L);
                        element.addClass(_CLASS_E);
                        element.attr('src', scope.missingImg || imgHolder.missingImg);
                    });

                    element.removeClass(_CLASS_E);
                    element.removeClass(_CLASS_D);
                    element.addClass(_CLASS_L);
                    element.attr('src', scope.loadingImg || imgHolder.loadingImg);

                    var img = new Image();
                    img.src = imgSrc;
                    img.onload = function () {
                        deferred.resolve(imgSrc);
                    };
                    img.onerror = function () {
                        deferred.reject(_REJECT_E);
                    };
                });
            }
        };

    }]);
})();