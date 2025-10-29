<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div class="div1">
        <img src="../assets/images/head.png" alt />
        <span>健康管理系统</span>
      </div>
      <div class="div2">
        <span class="span1">欢迎您，{{ userToken }}</span>
        <el-button class="logout-btn" type="info" @click="logout">退出登录</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->

      <el-aside :width="isCollapse ? '64px' : '169px'">
        <div class="toggle-button" @click="isCollapse = !isCollapse">|||</div>
        <el-menu
        class="custom-menu"
          background-color="#9CB885"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObject[item.id]"></i>
              <span>{{ item.title }}</span>
            </template>
            <!-- 二级 -->
            <el-menu-item :index="subItem.path" v-for="subItem in item.slist" :key="subItem.id">
              <i :class="iconsObject[subItem.id]"></i>
              <span>{{ subItem.title }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js,json文件，图片文件等等）
//例如： import <<组件名称>> from <<组件路径>> ;

export default {
  //import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    //这里存放数据
    return {
      isCollapse: false,
      userToken: localStorage.getItem("token") || "",
      menuList: [],
      iconsObject: {
        "100": "iconfont icon-guanliyuan",
        "200": "iconfont icon-paobu",
        "101": "iconfont icon-user",
        "102": "iconfont icon-mima",
        "103": "iconfont icon-paobu",
        "104": "iconfont icon-shangpin",
        "201": "iconfont icon-shu",
        "202": "iconfont icon-kaluli",
        "203": "iconfont icon-yinshi",
      },
      activePath: this.$route.path,
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data 中的数据变化
  watch: {},
  //方法集合
  methods: {
    logout() {
      // 退出登录，清除本地存储中的token
      localStorage.removeItem("token");
      this.$message({
        message: "退出登录成功",
        type: "success"
      });
      this.$router.push({ path: "/login" });
    },
    // 从后端获取菜单列表
    async getMenuList() {
      try {
        const role = localStorage.getItem("role");
        const response = await this.$http.post("/menu", { role: role });
        if (response.data.code === 200) {
          console.log(response.data.data);
          this.menuList = response.data.data;
          0;
        }
      } catch (error) {
        this.$message({
          message: response.data.msg,
          type: "error"
        });
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this 实例）
  created() {
    this.getMenuList();
  },
  //生命周期-挂载完成（可以访问DOM 元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 -更新之后
  beforeDestroy() {}, //声明周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive 缓存功能 这个函数会触发
};
</script>
<style lang="less" scoped>
/* //@import url();引入公共css类 */
.home_container {
  height: 100%;
  background-color: #b5ce98;
  position: relative; /* 新增：让子元素的absolute基于此容器定位 */
}
.el-header {
  background-color: #b5ce98;
  display: flex;
  justify-content: space-between;
  padding: 0 0;
  color: #fff;
  font-size: 20px;
}
/* 拆出 div 的样式 */
.div1 {
  height: 60px;
  width: 370px;
  display: flex;
  align-items: center;
  overflow: hidden;
}
/* 拆出 span 的样式 */
.el-header div span {
  margin-left: 10px;
}
.el-aside {
  background-color: #b5ce98;
}
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #eeeeee;
}
img {
  width: 200px;
  border: 7px solid #eee;
  border-radius: 50%;
  margin-left: -25px;
}
.div2 {
  display: flex;
  width: auto;
  padding-right: 5px;
  justify-content: flex-end;
  align-items: center;
}
.span1 {
  margin-right: 10px;
}
.toggle-button {
  background-color: transparent;
  line-height: 24px;
  color: #fff;
  font-size: 10px;
  cursor: pointer;
  text-align: center;
  letter-spacing: 0.2em;
}
</style>