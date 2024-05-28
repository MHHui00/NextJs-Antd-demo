# 基于 WEB 的基金统计分析系统
### NextJs14 + Prisma + Ant Design + zuStand


## 配置数据库
1. 打开项目文件夹里的隐藏文件 `.env`
2. 里面是Prisma约定的连接数据库格式，修改 `DATABASE_URL`里面的内容
3. 格式为：
   `所用数据库://用户名:密码@URL地址:端口号/数据库模式`
4. 例如：
   >DATABASE_URL="mysql://root:qweasd@localhost:3306/FYP20240512"


## 执行步骤
1. 打开控制台，使用cd命令到此文件夹路径。
2. 输入下面命令来安装依赖库：
    > npm i 
3. 安装完成后，输入一下命令执行项目：
    >npm run dev
4. 初次运行可能需要稍微等待，看到 `Ready`字样，代表运行成功
5. 打开`http://localhost:3000`即可看到程序。（端口号默认为3000）

