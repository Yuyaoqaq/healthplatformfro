<template>
  <div class="login_container">
    <div class="avatar_box">
      <img src="@/assets/images/logo.png" alt="logo" />
    </div>
    <div class="login_box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login_form" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
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
        loginForm: {
            username: 'cyy',
            password: '666666'
        },
         rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ],
        },
    };
  },
  //计算属性 类似于data概念
  computed: {},
  //监控data 中的数据变化
  watch: {},
  //方法集合
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.$http.post('/login', this.loginForm).then(res => {
            if (res.data.code === 200) {
              localStorage.setItem('token', JSON.stringify(res.data.data.username));
              localStorage.setItem('role', JSON.stringify(res.data.data.role));
              // console.log(localStorage.getItem('role'));
              this.$message({
                message: '登录成功',
                type: 'success'
              });
              this.$router.push({path:'/home'});
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          });
        } else {
          console.log('校验失败');
        }
      });
    },
  },
  //生命周期 - 创建完成（可以访问当前this 实例）
  created() {
  
  },
  //生命周期-挂载完成（可以访问DOM 元素）
  mounted() {
  
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 -更新之后
  beforeDestroy() {}, //声明周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {}, // 如果页面有keep-alive 缓存功能 这个函数会触发 
}
</script>
<style lang="less" scoped>
/* //@import url();引入公共css类 */
.login_container {
  height: 100%;
  background-color: #b5ce98;
  position: relative; /* 新增：让子元素的absolute基于此容器定位 */
}

.login_box {
  width: 400px;
  height: 250px;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 65%;
  transform: translate(-50%, -50%);
  /* 透明模糊效果 */
  background-color: rgba(255, 255, 255, 0.1); /* 白色半透明 */
}

.avatar_box {
  height: 330px;
  width: 330px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left: 50%;
  top: 17%;
  transform: translate(-50%);
  box-shadow: 0 0 10px #ddd;
  background-color: #b5ce98;

  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
}

.login_form {
  width: 80%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  /* 2. 靠近底部：设置距离底部的距离 */
  bottom: 0;
}

.btns {
  display: flex;
  justify-content: flex-end; /* 按钮靠右 */
  margin-top: 10px; /* 与输入框保持距离 */
}
</style>