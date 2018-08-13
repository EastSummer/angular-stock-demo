
### AngularJS
1. 模板功能强大丰富(声明式)，自带丰富的angularjs指令->双向绑定
2. 比较完善的前端MVC框架(模板，数据双向绑定，路由，模块化，服务，过滤器，依赖注入...)
3. 引入了Java的一些概念(依赖注入，单元测试...)

### AngularJS 的一些问题
1. 随着项目的复杂，数据双向绑定会带来性能问题(任何操作都会触发脏检测)  
    > [AngularJS 深度解析：脏数据检查与 angular 性能优化](https://segmentfault.com/a/1190000010433675)
2. 路由(ng-view)只能有一个，不能嵌套
3. 作用域(将angularjs执行环境与浏览器环境隔离开，不能直接使用原生事件)
4. 表单验证
5. JavaScript语言(没有强类型)
6. 学习成本

### Angular新特性
1. 全新的命令行工具 AngularCLI
2. 服务器端渲染
3. 移动端和PC端的兼容
4. 官方UI库：[Angular Material](https://material.angular.io/)

### Angular4 目录结构
> npm install @angular/cli -g  
> ng new auction --routing  
> ng g component header (创建component)  
> ng g service logger (创建service)

1. e2e 端到端的测试目录，包含基本的测试桩，用来做自动化测试
2. src 项目源代码  
    * app 应用的组件和模块
    * assets 存放静态资源
    * environments 环境配置(pro/dev/...)
    * index.html 根文件
    * main.ts 脚本执行的入口
    * polyfills.ts 导入必要库兼容老版本浏览器
    * tsconfig.js ts编译器配置
3. .editorconfig 多种IDE下统一代码规范和风格
4. .gitgnore git配置文件
5. angular-cli.json angular命令行工具的配置文件(第三方包)
6. karma.conf.js karma(单元测试)配置文件
7. package.json npm配置文件
8. protractor.conf.js 自动化测试配置文件
9. tslint.json typescript代码质量检查规则

### directive
1. 循环html元素 *ngFor="let item of items;let i = index;"
2. 绑定class样式 [class.className]="flag"

### decorator
1. @Input() 输入注解:从外部引入数据
2. @Injectable() 让当前类支持依赖注入
3. @Output() 输出注解
4. @ViewChild 获取模板视图中的元素或直接调用其组件中的方法

### Angular Route
1. Routes 路由配置，保存URL、展示组件、RouterOutlet对应关系
2. RouterOutlet 在html中标记路由内容呈现位置的占位符指令
3. Router 执行路由的对象，通过navigate()/navigateByUrl()方法导航路由
4. RouterLink 在html中声明路由导航用的指令
5. ActivatedRoute 当前激活的路由对象，保存着路由地址、参数等信息
    > [routerLink]="['/xxx', param]" html路由跳转  
    > this.router.navigate(['/xxx'], param) 控制器中跳转
6. 传送数据  
    6.1 在查询参数中传递数据  
    > /product?id=1&name=2 => ActivatedRoute.queryParams[id]
    ```js
    /* 路由配置 */
    const router: Router = [
        {path:"product", component:ProductComponent}
    ]
    ```
    ```html
    <!-- 路由链接 -->
    <a [routerLink]="['/product'] [queryParams]="{id:1}">product</a>
    ```
    ```js
    /* 接收 */
    private productId: number;
    constructor(private routeInfo: ActivatedRoute) {}
    ngOnInit() {
        this.productId = this.routeInfo.snapshot.queryParams["id"]
    }
    ```

    6.2 在路由路径中传递数据  
    > {path:/product/:id} => /product/1 => ActivatedRoute.params[id]
    ```js
    /* 路由配置 */
    const router: Router = [
        {path:"product/:id", component:ProductComponent}
    ]
    ```
    ```html
    <!-- 路由链接 -->
    <a [routerLink]="['/product', 1]">product</a>
    ```
    ```js
    constructor(private routeInfo: ActivatedRoute) {}
    ngOnInit() {
        /* 两种方法选一种 */
        /* 快照 只在创建时执行 */
        this.stockId = this.routeInfo.snapshot.params['id'];
        /* 订阅 每次都执行 */
        this.routeInfo.params.subscribe((params:Params) => this.stockId = params['id'])
    }
    ```
    
    6.3 在路由配置中传递数据  
    > {path:/product, component:ProductComponent, data:[{isProd:true}]} => ActivatedRoute.data[0][isProd]
    ```js
    /* 路由配置 */
    const router: Router = [
        {path:"product", component:ProductComponent, data:[{isPro:true}]}
    ]
    /* 接收 */
    private isPro: boolean;
    ngOnInit() {
        this.isPro = this.routeInfo.snapshot.data[0]["isPro"]
    }
    ```
7. 重定向路由
    ```js
    /* redirectTo 跳转到指定path*/
    /* pathMatch full->精准匹配path时跳转 prefix->已xx开头都跳转过去*/
    const router: Router = [
        {path:"", redirectTo:'/home', pathMatch:"full"},
        {path:"**", component:Code404Component}
    ]
    ```
8. 子路由
    ```js
    const router: Router = [
        {
            path:"product",
            component:ProductComponent,
            data:[{isPro:true}],
            children: [
                {path:"", component:BuyerListComponent},
                {path:"seller/:id", component:SellerListComponent}
            ]
        }
    ]
    ```
    ```html
        <!-- 主路由用/ 子路由用./ -->
        <a [routerLink]="['./']">product</a>
        <a [routerLink]="['./seller', 100]">product</a>
        <router-outlet></router-outlet>
    ```
9. 辅助路由
    ```html
        <!-- 主路由导航到home，辅助路由显示consult -->
        <a [routerLink]="[{outlets:{primary:'home',aux:'consult'}}]">显示</a>
        <!-- 主路由不变，辅助路不显示consult -->
        <a [routerLink]="[{outlets: {aux: null}}]">不显示</a>
        <!-- 主路由 -->
        <router-outlet></router-outlet>
        <!-- 辅助路由 -->
        <router-outlet name="aux"></router-outlet>
    ```
    ```js
    const router: Router = [
        /* outlet 只能显示在aux上 */
        {path:"consult", component:ConsultComponent, outlet:"aux"}
    ]
    ```
10. 路由守卫
    * CanActivate 处理导航到某路由的情况
    * CanDeactivate 处理从当前路由离开的情况
    * Resolve 在路由激活之前获取路由数据
11. router.events 监听路由变化
    * NavigationStart：导航开始
    * NavigationEnd：导航结束
    * NavigationCancel：取消导航
    * NavigationError：导航出错
    * RoutesRecoginzed：路由已认证
    ```js
    /* 在判断事件类型需要导入对应的事件类型，如：*/
    import { Router, NavigationStart } from '@angular/router';
    /* 监听单一事件 */
    this.router.events
    .filter((event) => event instanceof NavigationEnd)
    .subscribe((event:NavigationEnd) => {
        /*do something*/
    });
    /* 监听多个事件 */
    constructor(router:Router) {
        router.events.subscribe(event:Event => {
            if(event instanceof NavigationStart) {
            } else if(event instanceof NavigationEnd) {
            } else if(event instanceof NavigationCancel) {
            } else if(event instanceof NavigationError) {
            } else if(event instanceof RoutesRecognized) {
            }
        });
    }
    ```

### 依赖注入(DI:Dependency Injection) & 控制反转(IOC:Inversion of Control)
1. 简述
    * 控制反转和依赖注入是一体两面
    * 控制反转描述目的：将依赖的控制权从代码内部转移到外部
    * 依赖注入描述手段：实现控制反转使用的手段
    * IOC容器：实现了控制反转模式的框架，如angular
    * 依赖注入的好处：以松耦合的方式编写代码，提高可测性和重用性
    ```java
    // createShipment依赖Product类，但是不知如何创造Product实例
    var product = New Product();
    createShipment(product);

    @NgModule({
        providers: [ProductService],
        // 等价于
        providers:[{
            provide: ProductService,
            useClass: ProductService
        }]
        /*
        意思是：注册一个类型是ProductService的token，当有组件或指令声明自己需要一个类型为ProductService的token时，实例化一个ProductService并将其注入到目标对象
        */
    })
    export class AppModule {}
    export class ProductCompoent {
        product: Product;
        // 用构造函数声明自己需要一个ProductService的token
        constructor(productService: ProductService) {
            this.product = productService.getPrroduct();
        }
    }
    ```
2. 注入器 & 提供器
    * 注入器
        ```js
        constructor(productService: ProductService) {...}
        ```
    * 提供器
        ```js
        providers: [ProductService] /*等价于下面*/
        providers: [{
            provide: ProductService,    /*与注入器一致，称为token*/
            useClass: AnotherProductService /*实例化具体类*/
        }]
        providers: [{
            provide: ProductService,
            useFactory: ()=>{...}   /*通过工厂方法返回一个实例*/
        }]
        ```
        > 声明在模块中时，对所有组件可见，所有组件都可注入  
        > 声明在组件中时，只对自己及自组件可见  
        > 当声明在模块和组件的提供器使用同样的token时，组件中的会覆盖模块中的提供器  
        > 应该优先声明在模块中，只有服务必须对某个组件不可见时才声明在组件中  
    * 注入器的层级关系
        > 应用级注入器 -> 主组件注入器 -> 子组件注入器
        ```java
        /*手动注入 angular注入器injector 避免这种写法*/
        public productService: ProductService
        constructor(public injector: Injector) {
            this.productService = injector.get(ProductService)
        }
        ```

### 数据绑定(单项数据流)
    ```html
    <h1>{{productTitle}}</h1>
    <img [src]="imgUrl" />
    <button (click)="toProductDetail()">商品详情</button>
    ```
1. 事件绑定 (event)="xxx($event)"
    * event: 绑定的事件名称
    * xxx: 组件方法名称 或者 属性赋值
    * $event: (可选)浏览器事件对象
2. 属性绑定(差值表达式)
    ```html
    <img [src]="imgUrl" />
    <img src={{imgUrl}} />
    ```
3. HTML属性和DOM属性的关系
    * 少量HTML属性和DOM属性之间有着1:1的映射，如id
    * 有些HTML属性没有对应的DOM属性，如colspan
    * 有些DOM属性没有对应的HTML属性，如textContent
    * HTML属性和DOM属性就算名字相同也不是同一样东西，但浏览器会自动同步
    * HTML属性的值为初始值，不能改变
    * DOM属性的值表示当前值，可以改变
    * Angular模板绑定是通过DOM属性个事件来工作的
4. HTML属性绑定
    ```html
    <!-- 基本Ht属性绑定 -->
    <td [attr.colspan]="tableColspan">Something</td>

    <!-- CSS类绑定 -->
    <!-- someExpression会替换掉a&b -->
    <div class="a b" [class]="someExpression">Something</div>
    <!-- isSpecial来控制是否显示special类 -->
    <div [class.special]="isSpecial">Something</div>
    <!-- 控制多个类是否显示 -->
    <div [ngClass]="{a:isA, b:isB}">Something</div>

    <!-- 样式绑定 -->
    <div [style.color]="isSpecial?'red':'blue'">Something</div>
    <div [ngStyle]="{'font-style:this.canSave?'italic':'normal'}">Something</div>
    ```
5. 双向绑定
    ```html
    <input [(ngModel)]="name" />
    <div>{{name}}</div>
    ```

### 响应式编程(Rxjs)
1. 观察者模式
    * 可观察对象Observable(流)：表示一组值或事件的集合
    * 观察者Observer：一个回调函数集合，监听Observable发送的值
    * Subscription：表示一个可观察对象，主要用于取消注册
    * 操作符Operators：纯粹的函数，使开发者可以以函数编程的方式处理集合
    ```js
    import {Observable} from "rxjs";
    var subscription = Observable.from([1,2,3,4])
        .filter(e => e%2==0)
        .map(e => e*e)
        .subscribe(
            e => console.log(e),
            error => console.log(error),
            () => console.log("End")
        );
    subscription.unsubscribe(); /*取消订阅*/
    ```
2. 模板本地变量
    ```html
    <input (keyup)="onKey1($event)" />
    <input #myField (keyup)="onKey2(myField.value)" />
    ```
    ```js
    onKey1(event) {
        console.log(event.target.value)
    }
    onKey2(value:string) {
        console.log(value)
    }
    ```

### 管道(filter)
* date:'yyyy-MM-dd HH:mm:ss'    日期(年-月-日 小时：分钟：秒)
* lowercase 转化成小写字母
* number:'2.1-4'    整数：2位；小数：最少1位，最多4位
* saync 处理异步流
* json 
    ```html
    <p>{{nowDate | date:'yyyy-MM-dd HH:mm:ss'}}</p>
    <p>{{sum | number:'2.1-4'}}</p>
    <p>自定义{{size | multiple:'2'}}</p>
    ```
    ```js
    size:number = 7;
    
    import { Pipe, PipeTransform } from '@angular/core';
    @Pipe({                 /*管道装饰器*/
        name: 'multiple'    /*自定义管道名字*/ 
    })
    export class MultiplePipe implements PipeTransform {
        /*value:传入的值 multiple:传入的参数 */
        transform(value: number, multiple?: number): number {
            return value * (isNaN(multiple)?1:multiple);
        }
    }
    ```

### 组件间通讯
1. 组件的输入输出属性
    * @Input()
    * @Output()
2. 使用中间人模式传递数据
3. 组件声明周期  
    * 组件初始化
        * constructor
        * ngOnChanges*
        * ngOnInit
        * ngDocheck*
        * ngAfterContentInit
        * ngAfterContentChecked*
        * ngAfterViewInit
        * ngAfterViewChecked*
    * 变化检测
        * ngOnChanges*（输入属性变化时才被调用）
        * ngDoCheck*
        * ngAfterContentChecked*
        * ngAfterViewChecked*
    * 组件销毁
        * ngOnDestroy
    > 带*的方法会被调用多次
4. angular的变更检测机制（zone.js）（doCheck）
    * 同步绑定关系
    * 不会改变属性的值，只会把变化反映到模板上
    * default策略（默认）
        > zonejs会从根节点检查整个组件树
    * OnPush策略
        > 标记组件树中的一个分支，使其被排除在变更机制之外

### 表单处理
1. 模板式表单 FormsModule
    * ngForm -> 创建FromGroup并且存储表单数据
    * ngModel -> FormControl
    * ngModelGroup -> 嵌套在FromGroup里
2. 响应式表单 ReactiveFormsModule
    * FormControl
    * FromGroup
    * FromArray
    * FormBuilder
3. 表单校验
    * 模板式表单 direactive校验
4. 状态字段
    * touched & untouched 表单元素是否获取过焦点
    * valid 标记表单元素是有效/合法的
    * invalid 标记表单元素是无效/不合法的
    * pristine 表示表单元素是纯净的，用户未操作过
    * dirty 表示表单元素是已被用户操作过
    * pending
    > 对应的Class： .ng-pristine .ng-dirty .ng-valid .ng-invalid .ng-touched

### node 服务器
1. npm init -y
2. npm i @types/node --save // 类型定义文件
3. Add "tsconfig.json" file
4. npm install express --save
5. npm install @ type/expess --save
6. coding...
7. node build/server.js
8. npm install -g nodemon   // 自动重启项目工具
9. nodemon build/server.js  // nodemon启动服务
10. npm install ws --save   // ws依赖库
11. npm install @ type/ws --save-dev



### flux架构

