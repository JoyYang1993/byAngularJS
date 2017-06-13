/**
 * Created by yangjiao on 2017/6/13.
 */
//创建模块
var registerApp = angular.module('registerApp',[]);

//创建控制器
registerApp.controller('registerController',function ($scope,registerService) {
    $scope.registerData = {
        email:'',
        psw:'',
        repsw:'',
        verification:''
    };
    //点击注册并将从页面中获取到的数据发送到后台
    $scope.register = function () {
        //调用服务中的方法
        registerService.sendRegister($scope.registerData,function (data) {
            //alert(data);
        })
    };
    //验证码
    $scope.showVer = function () {
        var randamNum = Math.round(Math.random()*10000);
        if(randamNum<1000){
            randamNum = randamNum+'0';
        }
        $scope.registerData.verification= randamNum;
       // console.log($scope.registerData.verification)
    }
});

//创建服务
registerApp.provider('registerService',function () {
    this.$get = function ($http,$httpParamSerializer) {
        return {
            sendRegister:function (registerData,fun) {
                var registerDatas = {};
                for(var key in registerData){
                    console.log(key);
                    var val = registerData[key];
                    console.log(val)
                    if(val){
                        switch (key){
                            case 'email':
                                registerDatas['email'] = val;
                                break;
                            case 'psw':
                                registerDatas['psw'] = val;
                                break;
                            case 'repsw':
                                registerDatas['repsw'] = val;
                                break;
                            case 'verification':
                                registerDatas['verification'] = val;
                        }
                    }
                }
                console.log(registerDatas)
                registerDatas = $httpParamSerializer(registerDatas);
                console.log(registerDatas)
                //将数据发送到后台
                $http.get('#',registerDatas,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                    fun(data);
                });
            }
        }
    }
});