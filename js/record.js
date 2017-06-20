/**
 * Created by yangjiao on 2017/6/19.
 */
//
    

//AngularJS
//创建模块
var recordApp = angular.module('recordApp',[]);

//创建控制器
recordApp.controller('recordController',function ($scope,recordService) {
    //从页面中获取到的数据
    $scope.recordData = {
        classify:'',
        remark:'',
        date:'',
        money:'',
    };
    //计算器
    $scope.calculator =  function () {
        //调用服务中的方法
        recordService.calculatorData($scope.recordData.money)
    };
    //调用服务中的方法，将数据发送到后台
    $scope.apply = function () {
        recordService.sendRecord($scope.recordData,function (data) {
            //alert(data);
        })
    };
});

//创建服务
recordApp.provider('recordService',function () {
    this.$get = function ($http,$httpParamSerializer) {
        return {
            //计算器
            calculatorData:function (moneyInputData) {
                
            },
            //向后台发送
            sendRecord:function (recordData,fun) {
                console.log(recordData)
                recordData = $httpParamSerializer(recordData);
                console.log(recordData)
                //发送到后台
                $http.get('#',recordData,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    fun(data);
                });
            }
        }
    }
})
