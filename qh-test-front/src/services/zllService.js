angular.module('qh-test-front').factory('zllService', ['$http', '$q', '$state', '$log', 'appConfig', function ($http, $q, $state, $log, appConfig) {

    $log.log("zllService is inited");


    // TODO RESET
    return {
        order1: {},
        resetOderBaseOn: function (initObj) {
            this.order1 = angular.extend({}, initObj);
        }
    };

}]);