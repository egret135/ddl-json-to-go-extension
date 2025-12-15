# DDL & JSON to Go Struct Converter

一个强大的浏览器扩展，可以将 MySQL、PostgreSQL、SQLite DDL 和 JSON 快速转换为 Go struct 代码，自动生成 `json` 和 `gorm` 标签。

![Extension Icon](icons/icon128.png)

## ✨ 特性

- 🎯 **多数据库支持**：MySQL、PostgreSQL、SQLite DDL 自动识别
- ⚖️ **DDL 差异对比**：[NEW] 对比新旧 DDL 差异，自动生成 ALTER 语句
- 📦 **JSON 转换**：支持嵌套对象的 JSON 转 Go struct
- 🧠 **智能整数映射**：[NEW] 根据 DDL 类型精确映射 `int8/16/32` 及 `unsigned`
- ⚡ **自动转换**：[NEW] 输入防抖自动转换，无需手动点击
- 🏷️ **智能标签**：自动生成 `json` 和 `gorm` 标签
- 📝 **注释保留**：DDL 中的 COMMENT 自动转为行内注释
- 🔄 **TableName 方法**：自动生成 GORM 的 TableName() 方法
- 🎨 **嵌套结构**：支持内联或独立声明嵌套 struct
- ⚡ **快速操作**：一键复制、导出为 .go 文件
- 🌐 **多浏览器**：支持 Chrome、Edge、Firefox、Safari

## 📸 预览

简洁优雅的左右分栏界面，输入 DDL 或 JSON，立即生成 Go struct：

```go
// User users表
type User struct {
    ID         int64     `json:"id" gorm:"column:id;primaryKey;autoIncrement;not null"`       // 用户ID
    Username   string    `json:"username" gorm:"column:username;not null"`                    // 用户名
    Email      string    `json:"email" gorm:"column:email"`                                   // 邮箱
    CreateTime time.Time `json:"create_time" gorm:"column:create_time"`                       // 创建时间
}

// TableName 返回表名
func (User) TableName() string {
    return "users"
}
```

## 🚀 安装

### Chrome / Edge

1. 下载或克隆此仓库
2. 打开 `chrome://extensions/`
3. 开启右上角"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `ddl-json-to-go-extension` 目录

### Firefox

1. 打开 `about:debugging#/runtime/this-firefox`
2. 点击"临时加载附加组件"
3. 选择 `manifest.json` 文件

## 📖 使用方法

### 基本使用

1. 点击浏览器工具栏中的扩展图标
2. 在左侧输入框粘贴 DDL 或 JSON
3. 扩展会自动识别类型（也可手动选择）
4. 点击"转换"按钮
5. 右侧显示生成的 Go struct 代码

### DDL 转换示例

**输入**（MySQL DDL）：
```sql
CREATE TABLE sc_robot_xbot (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  robot_name VARCHAR(100) COMMENT '机器人名称',
  status TINYINT DEFAULT 1 COMMENT '状态',
  create_time DATETIME COMMENT '创建时间'
);
```

**输出**：
```go
// ScRobotXbot sc_robot_xbot表
type ScRobotXbot struct {
    ID         int64     `json:"id" gorm:"column:id;primaryKey;autoIncrement;not null"`       // ID
    RobotName  string    `json:"robot_name" gorm:"column:robot_name"`                         // 机器人名称
    Status     int8      `json:"status" gorm:"column:status"`                                 // 状态
    CreateTime time.Time `json:"create_time" gorm:"column:create_time"`                       // 创建时间
}

// TableName 返回表名
func (ScRobotXbot) TableName() string {
    return "sc_robot_xbot"
}
```

### DDL 差异对比 (New)

1. 点击顶部切换到 **DDL 对比** 模式
2. 左侧分别输入 **Target (旧)** 和 **Source (新)** DDL
3. 右侧自动生成对应的 `ALTER TABLE` 语句

**输入**：
```sql
-- Target (旧)
CREATE TABLE users (id INT, name VARCHAR(100), status INT);

-- Source (新)
CREATE TABLE users (id INT, name VARCHAR(200), email VARCHAR(100));
```

**自动生成 SQL**：
```sql
ALTER TABLE `users` ADD COLUMN `email` VARCHAR(100);
ALTER TABLE `users` MODIFY COLUMN `name` VARCHAR(200);
ALTER TABLE `users` DROP COLUMN `status`;
```

### JSON 转换示例

**输入**：
```json
{
  "user_id": 123,
  "user_name": "Alice",
  "profile": {
    "age": 30,
    "city": "Beijing"
  }
}
```

**输出**（内联模式）：
```go
// Response 
type Response struct {
    UserID   int64 `json:"user_id"`
    UserName string `json:"user_name"`
    Profile  struct {
        Age  int64  `json:"age"`
        City string `json:"city"`
    } `json:"profile"`
}
```

## ⚙️ 功能选项

### 快速切换

- **内联嵌套**：在页面右上角勾选，JSON 嵌套对象直接内联声明，无需单独定义

### 设置（点击右上角齿轮图标）

- **结构体名称**：留空自动从表名生成（如 `user_info` → `UserInfo`）
- **包名**：默认 `model`
- **生成 TableName() 方法**：为 DDL 自动生成 GORM 的 TableName 方法

## ⌨️ 快捷键

- `Cmd/Ctrl + Enter`：转换
- `Cmd/Ctrl + K`：清除
- `Esc`：关闭设置弹窗

## 🛠️ 技术栈

- Vanilla JavaScript（无外部依赖）
- Manifest V3
- Chrome Extension APIs

## 📁 项目结构

```
ddl-json-to-go-extension/
├── manifest.json           # 扩展配置
├── background.js           # 后台服务
├── index.html             # 主界面
├── style.css             # 样式
├── app.js                # 主逻辑
├── icons/                # 图标文件
├── parsers/              # 解析器
│   ├── detector.js       # 类型检测
│   ├── mysql-parser.js   # MySQL 解析
│   ├── postgresql-parser.js
│   ├── sqlite-parser.js
│   └── json-parser.js
│   ├── formatter.js      # 代码格式化
│   └── exporter.js       # 文件导出
├── generators/
│   ├── struct-generator.js  # Go struct 生成
│   └── diff-engine.js       # [NEW] DDL 差异对比引擎
└── config/
    └── settings.js       # 设置管理
```

## 🔧 开发

```bash
# 克隆仓库
git clone https://github.com/yourusername/ddl-json-to-go-extension.git

# 在浏览器中加载扩展
# Chrome: chrome://extensions/ -> 开发者模式 -> 加载已解压的扩展程序
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有贡献者和使用者的支持！

---

**作者**: bailu  
**仓库**: https://github.com/yourusername/ddl-json-to-go-extension
