# 基金网站
### NextJs14 + Ant Design + Redux
## 后端思路
1. 安装serverless- mysql
2. next.config里面配置 数据库
3. /script 配置一个function：excuteQuery用于执行sql语句
4. /lib 通过excuteQuery 封装好所有需要的sql语句格式
5. 创建api，路由传参，调用/lib里面的 封装好的执行sql的function
6. 在实际的组件page里面 全部声明成‘useclient’，使用useEffect 异步调用写好的api，得到数据，前端渲染

## 为什么有Redux？
* 之前学React的时候学的，在一些需要全局状态的场景就用它来实现
* 例如登陆的功能：
进网站根目录的时候检查Redux的全局状态，判断登陆状态来决定路由到登陆页还是主页
* 还有用户的uid也会用到全局变量，在进行sql查询的时候用到 “where userid = uid” 这样的操作，因为数据库没有单独为每个用户建表。

## 还卡住的点
1. 实际组件page里面调用创建好的api时，用文件名路由失败，“/api/test” 会报错。只能用“http://localhost:3000/api/test”先用着
2. Redux的部分还没有开始做，之前网上看Next14好像有些兼容性问题，不知道用Redux会不会


## 数据库
* 只有十几张表格，原本老师给的是sqlite。然后说sqlite不能多个用户同时使用，叫我转成Mysql。还说做出来之后以我的数据库为准。
* sql文件包含在项目里面了,根目录下的 sqliteToMysql_02_modified.sql

## 参考资料
这里有一个老师给的，上一届师兄做的毕业设计。题目和我的一样，我基本只要实现了这个网站的功能，就够了。
* http://39.108.183.221:8888/


## 有什么不足或更好代替方案希望多多指点