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
        classify:0,
        remark:'',
        date:'',
        money:'',
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
            //向后台发送
            sendRecord:function (recordData,fun) {
                //声明一个空对象
                var recordDatas = {};
                for(var key in recordData){
                    var val = recordData[key];
                    if(val){
                        switch (key){
                            case 'classify':
                                recordDatas['classify'] = val;
                            case 'remark':
                                recordDatas['remark'] = val;
                                break;
                            case 'date':
                                recordDatas['date'] = val;
                                break;
                            case 'money':
                                recordDatas['money'] = val;
                                break;
                        }
                    }
                }
                console.log(recordDatas)
                recordDatas = $httpParamSerializer(recordDatas);

                
            }
            
        }
    }
})
