# ACM_Summary
为ACMer准备的刷题统计平台

# 本地部署流程

## 1.下载node.js，git与postgre数据库

请移步各官网进行下载安装

Node.js: https://nodejs.org/zh-cn

git: https://git-scm.com/downloads

postgre: https://www.postgresql.org/download/

## 2.注册postgre并创建新数据库

在终端中输入以下命令

```
    psql -U postgres
```

之后输入密码进行登录，登录后输入以下命令创建数据库

```
    CREATE DATABASE myDataBaseName;
```

也可以使用pgAdmin4可视化工具直接创建

## 3.克隆仓库到本地

在gitbash中运行

```
    git clone https://github.com/stars569/ACM_Summary.git
```

## 4.安装项目所需依赖

在项目的acmsummary文件夹打开终端并输入以下命令

```
    npm i
    cd server
    npm i
```

## 5.配置环境变量

1.进入acmsummary文件夹

2.进入server文件夹

3.找到config.js文件并打开

4.填写您的jwt密钥，数据库用户名称，密码以及数据库名

## 6.启动应用

进入acmsummary文件夹，双击start.bat并等待应用启动