create database if not exists easy_log;

drop table if exists t_user;
create table t_user (
    id int not null primary key auto_increment,
    username char(20) not null default '' comment '用户名，可以是工号',
    password char(32) not null default '' comment '密码 hash后存储',
    create_time int not null default 0 comment '创建时间',
    status tinyint not null default 1 comment '用户状态,1正常，2为不可用'
) engine=Innodb charset = 'utf8' comment '用户表';


drop table if exists t_ajax_request;
create table t_ajax_request (
    id int not null primary key auto_increment,
    url varchar(1000) not null default '' comment 'url地址',
    user_id int not null default 0 comment '用户id',
    ajax_url varchar(1000) not null default '' comment 'ajax请求url',
    ajax_method char(10) not null default 'get' comment '请求方法get/post',
    ajax_payload text comment '请求的数据',
    ajax_status int not null default 200 comment '请求的返回状态,http的状态码',
    create_time int not null default 0 comment '创建时间',
    status tinyint not null default 1 comment '1 有效，2无效'
)engine = innodb charset = 'utf8' comment 'ajax 请求表';



drop table if exists t_log;
create table t_log (
    id int not null primary key auto_increment,
    ajax_id int not null default 0 comment 'ajax请求id',
    user_id int not null default 0 comment '用户id',
    stage_id int not null default 0 comment '步骤id',
    log_data text comment '对应的步骤下的日志信息',
    create_time int not null default 0 comment '创建时间',
    status tinyint not null default 1 comment '1有效，2无效'
)engine = innodb charset = 'utf8' comment '日志表';

drop table if exists t_stage;
create table t_stage (
    id int not null primary key auto_increment,
    stage_name varchar(20) not null default '' comment '步骤名称',
    connect_str varchar(1000) not null default '' comment '连接字符串',
    cmd_format varchar(1000) not null default '' comment '待执行的命令格式, 可能会有宏替换如 ___host___',
    stage_type tinyint not null default  1 comment '1是mysql数据库，2是ssh服务器，3是redis, 4是zk',
    create_time int not null default 0 comment '创建时间',
    status tinyint not null default 1 comment '1有效，2无效'
) engine = innodb charset = 'utf8' comment '步骤表';

--  这样的请求，会需要哪些地方的日志/数据信息
-- 个性化的步骤列表，后期再做吧
drop table if exists t_ajax_stage_relation;
create table t_ajax_stage_relation (
    id int not null primary key auto_increment,
    ajax_id int not null default 0 comment 'ajax请求id',
    user_id int not null default 0 comment '用户id 0 就是公用的',
    stage_id int not null default 0 comment '步骤id',
    status  tinyint not null default 1 comment '1是可以，2是不可用'
)engine = innodb charset = 'utf8' comment 'ajax请求和步骤关系表';
