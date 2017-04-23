Datepicker[日期选择器]
---
引入文件
'datepicker.js'
'statics/css/datepicker.css'
```js
// angular 注册模块：
angular.module('comp', ['ngLocale', 'tjfdatepicker'])


angular.module('comp').controller('demoCtl', function($scope) {
    $scope.date = '2017-01-10'
})
```

html
```html
<!--单个日历-->
<div ng-controller="demoCtl">
    <div datepicker init-date="date">
        <input type="text" ng-model="date">
    </div>
</div>
    
    
<!--互联的日历-->
<div datepicker class="date-left" init-date="startTime" date-max-limit="endTime">
    <input type="text" ng-model="startTime" >
</div>
<span class="date-addon">-</span>
<div datepicker class="date-right" init-date="endTime" date-min-limit="startTime">
    <input type="text" ng-model="endTime">
</div>
```

api 接口 | 说明
---|---
init-date | 日历的日期
date-max-limit | 限制最大的日期
date-min-limit | 限制最小的日期



pagination[分页]
---
```js
// angular 注册模块：
angular.module('comp', ['tjfpagination'])


angular.module('comp').controller('demoCtl', function($scope) {
    $scope.total = 190;
    $scope.page = 1;
    $scope.change = function(){
        // do some after page change 
    }
})
```

```html
<pagination total="total" page="page" maxPageNumber="maxPageNumber" changed="onPageChange()"></pagination>
```


api 接口 | 说明
---|---
total | 总数
page | 当前页码
maxPageNumber | 可见页码数量
change | 页面切换后的动作