/**
 * Created by yangjiao on 2017/6/12.
 */
//创建模块
var loginApp = angular.module('loginApp',[]);

//创建控制器
loginApp.controller('loginController',function ($scope,loginService) {
    //从页面中获取到的数据并发送到后台
    $scope.loginData = {
        username:'',
        psw:'',
        remember:true
    };
    //点击登录并发送到后台
    $scope.login = function () {
        //调用服务中的方法
        loginService.sendLogin($scope.loginData,function (data) {//data是后台接收到数据之后发送给前台的信息
            //alert(data);
        });
    };
    //点击重置
    $scope.reset = function () {
        $scope.loginData = {
             username:'',
             psw:'',
             remember:true
         };
    }
});

//创建服务：从后台获取数据&&向后台发送数据
loginApp.provider('loginService',function () {
    this.$get = function ($http,$httpParamSerializer) {
        return {
            //向后台发送从页面获取到的数据
            sendLogin:function (loginData,fun) {
                //声明一个空对象
                var loginDatas = {};
                for(var key in loginData){
                    var val = loginData[key];
                    if(val){
                        switch (key){
                            case 'username':
                                loginDatas['username'] = val;
                            break;
                            case 'psw':
                                loginDatas['psw'] = val;
                            break;
                            case 'remember':
                                loginDatas['remember'] = Number(val);
                            break;
                        }
                    }
                }
               console.log(loginDatas);
                loginDatas = $httpParamSerializer(loginDatas);
               // console.log(loginDatas)
                //将数据发送到后台
                $http.get('#',loginDatas,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function (data) {//data是后台成功接收数据之后返回给前台的信息
                    fun(data)
                });
            }
        }
    }
});