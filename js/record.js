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
        money:''
    };
    $scope.labelExpend = '支出';
    $scope.labelIncome = '收入';
    //调用服务中的方法，将数据发送到后台
    $scope.applyExpend = function () {
        recordService.sendRecord($scope.recordData,$scope.labelExpend,function (data) {
            //alert(data);
        });
        //清空数据
        $scope.recordData = {
            classify:'',
            remark:'',
            date:'',
            money:''
        };
    };
    $scope.applyIncome = function () {
        recordService.sendRecord($scope.recordData,$scope.labelIncome,function (data) {
            //alert(data);
        });
        //清空数据
        $scope.recordData = {
            classify:'',
            remark:'',
            date:'',
            money:''
        };
    };

    //计算器

    //计算时用的数字的栈
    $scope.num=[];
    //接受输入用的运算符栈
    $scope.opt=[];
    //计算器计算结果
   // $scope.result="";
    //表示是否要重新开始显示,为true表示不重新显示，false表示要清空当前输出重新显示数字
    $scope.flag=true;
    //表示当前是否可以再输入运算符，如果可以为true，否则为false
    $scope.isOpt=true;

    //计算器界面数据
    $scope.data={
        "1":["AC","+/-","%","÷"],
        "2":["7","8","9","×"],
        "3":["4","5","6","－"],
        "4":["1","2","3","＋"],
        "5":["0",".","="]
    };
    $scope.init=function(){
        $scope.num=[];
        $scope.opt=[];
        $scope.flag = true;
        $scope.isOpt=true;
    } ;
    //显示计算器样式
    $scope.showClass=function(index,a){
        if(a==0){
            return "zero";
        }
        return index==3||a=="="?"end-no":"normal";
    };
    $scope.showResult=function(a){
        var reg=/\d/ig,regDot=/\./ig,regAbs=/\//ig;
        //如果点击的是个数字
        if(reg.test(a)) {
            //消除冻结
            if($scope.isOpt==false){
                $scope.isOpt=true;
            }

            if ($scope.recordData.money != 0 && $scope.flag && $scope.recordData.money != "error") {
                $scope.recordData.money += a;
            }
            else {
                $scope.recordData.money = a;
                $scope.flag = true;
            }

        }
        //如果点击的是AC
        else if(a=="AC"){
            $scope.recordData.money=0;
            $scope.init();
        }
        //如果点击的是个小数点
        else if(a=="."){
            if($scope.recordData.money!=""&&!regDot.test($scope.recordData.money)){
                $scope.recordData.money+=a;
            }
        }
        //如果点击的是个取反操作符
        else if(regAbs.test(a)){
            if($scope.recordData.money>0){
                $scope.recordData.money="-"+$scope.recordData.money;
            }
            else{
                $scope.recordData.money=Math.abs($scope.recordData.money);
            }
        }
        //如果点击的是个百分号
        else if(a=="%"){
            $scope.recordData.money=$scope.format(Number($scope.recordData.money)/100);

        }
        //如果点击的是个运算符且当前显示结果不为空和error
        else if($scope.checkOperator(a)&&$scope.recordData.money!=""&&$scope.recordData.money!="error"&&$scope.isOpt){
            $scope.flag=false;
            $scope.num.push($scope.recordData.money);
            $scope.operation(a);
            //点击一次运算符之后需要将再次点击运算符的情况忽略掉
            $scope.isOpt=false;
        }
        //如果点击的是等于号
        else if(a=="="&&$scope.recordData.money!=""&&$scope.recordData.money!="error"){
            $scope.flag=false;
            $scope.num.push($scope.recordData.money);
            while($scope.opt.length!=0){
                var operator=$scope.opt.pop();
                var right=$scope.num.pop();
                var left=$scope.num.pop();
                $scope.calculate(left,operator,right);
            }
        }
    };
    //比较当前输入的运算符和运算符栈栈顶运算符的优先级
    //如果栈顶运算符优先级小，则将当前运算符进栈，并且不计算，
    //否则栈顶运算符出栈，且数字栈连续出栈两个元素，进行计算
    //然后将当前运算符进栈。
    $scope.operation=function(current){
        //如果运算符栈为空，直接将当前运算符入栈
        if(!$scope.opt.length){
            $scope.opt.push(current);
            return;
        }
        var  operator,right,left;
        var  lastOpt=$scope.opt[$scope.opt.length-1];
        //如果当前运算符优先级大于last运算符，仅进栈
        if($scope.isPri(current,lastOpt)){
            $scope.opt.push(current);
        }
        else{
            operator=$scope.opt.pop();
            right=$scope.num.pop();
            left=$scope.num.pop();
            $scope.calculate(left,operator,right);
            $scope.operation(current);
        }
    };
    //判断当前运算符是否优先级高于last，如果是返回true
    //否则返回false
    $scope.isPri=function(current,last){
        if(current==last){
            return false;
        }
        else {
            if(current=="×"||current=="÷"){
                if(last=="×"||last=="÷"){
                    return false;
                }
                else{
                    return true;
                }
            }
            else{
                return false;
            }
        }
    };

    //负责计算结果函数
    $scope.calculate=function(left,operator,right) {
        switch (operator) {
            case "＋":
                $scope.recordData.money = $scope.format(Number(left) + Number(right));
                $scope.num.push($scope.recordData.money);
                break;
            case "－":
                $scope.recordData.money = $scope.format(Number(left) - Number(right));
                $scope.num.push($scope.recordData.money);
                break;
            case "×":
                $scope.recordData.money = $scope.format(Number(left) * Number(right));
                $scope.num.push($scope.recordData.money);
                break;
            case "÷":
                if(right==0){
                    $scope.recordData.money="error";
                    $scope.init();
                }
                else{
                    $scope.recordData.money = $scope.format(Number(left) / Number(right));
                    $scope.num.push($scope.recordData.money);
                }
                break;
            default:break;
        }
    };
    //格式化result输出
    $scope.format=function(num){
        var regNum=/.{10,}/ig;
        if(regNum.test(num)){
            if(/\./.test(num)){
                return num.toExponential(3);
            }
            else{
                return num.toExponential();
            }
        }
        else{
            return num;
        }
    };
    //判断当前符号是否是可运算符号
    $scope.checkOperator=function(opt){
        if(opt=="＋"||opt=="－"||opt=="×"||opt=="÷"){
            return true;
        }
        return false;
    }
});




//创建服务
recordApp.provider('recordService',function () {
    this.$get = function ($http,$httpParamSerializer) {
        return {
            //向后台发送
            sendRecord:function (recordData,opt,fun) {
                recordData.label = opt;
                console.log(recordData);
                recordData = $httpParamSerializer(recordData);
                console.log(recordData);
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
