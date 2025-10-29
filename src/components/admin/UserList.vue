<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 导航 -->
      <el-row :gutter="20">
        <el-col :span="16">
          <el-select
            v-model="query.searchType"
            placeholder="请选择搜索类型"
            style="width: 140px; margin-right: 10px;"
          >
            <el-option label="用户名" value="username">用户名</el-option>
            <el-option label="邮箱" value="email">邮箱</el-option>
            <el-option label="角色" value="role">角色</el-option>
          </el-select>
          <el-input
            placeholder="请输入搜索内容"
            v-model="query.searchValue"
            style="width: calc(100% - 150px);"
            @keyup.enter.native="getUserList"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">新增用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名" width="130px" align="center"></el-table-column>
        <el-table-column prop="password" label="密码" width="130px" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200px" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" width="200px" align="center"></el-table-column>
        <el-table-column prop="role" label="角色" width="130px" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.isEditing">
              <el-select
                v-model="scope.row.role"
                size="mini"
                @change="handleRoleChange(scope.row)"
                @blur="cancelEdit(scope.row)"
                style="width: 100px"
              >
                <el-option label="超级管理员" value="超级管理员"></el-option>
                <el-option label="普通用户" value="普通用户"></el-option>
              </el-select>
            </template>
            <template v-else>{{ scope.row.role }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200px" align="center"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- scope.row中包含了这一行所有数据。 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            >删除</el-button>
            <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="enterEditMode(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[5, 7, 10]"
          :page-size.sync="query.pageSize"
          :current-page.sync="query.pageNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addFormReset"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('addFormRef')">确定</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户弹窗 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editFormReset"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUser">确定</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询
      userList: [],
      total: 0,
      query: {
        searchType: "",
        searchValue: "",
        pageNum: 1,
        pageSize: 7
      },

      //添加
      addForm: {
        username: "",
        password: "",
        email: ""
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        email: [
          { message: "请输入邮箱", trigger: "change" }, // 增加必填验证
          {
            type: "email",
            // pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "请输入正确的邮箱格式"
          }
        ]
      },
      addDialogVisible: false,
      //编辑
      editForm: {
        id: "",
        username: "",
        password: "",
        email: ""
      },
      editFormRules: {
        email: [
          { message: "请输入邮箱", trigger: "change" }, // 增加必填验证
          {
            type: "email",
            // pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "请输入正确的邮箱格式"
          }
        ]
      },
      editDialogVisible: false
    };
  },
  methods: {
    //查询
    getUserList() {
      this.$http
        .get("/admin/list", { params: this.query })
        .then(res => {
          if (res.data.code === 200) {
            this.userList = res.data.data.map(item => ({
              ...item,
              isEditing: false // 预先添加，成为响应式属性
            }));
            this.total = res.data.total;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message(err.response.data.msg);
        });
    },
    // 分页大小改变时触发
    handleSizeChange(newSize) {
      this.query.pageSize = newSize;
      this.getUserList();
    },
    // 分页当前页改变时触发
    handleCurrentChange(newPage) {
      this.query.pageNum = newPage;
      this.getUserList();
    },

    //添加
    // 提交添加用户表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post("/admin/add", this.addForm).then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: "添加用户成功",
                type: "success"
              });
              this.addDialogVisible = false;
              this.getUserList();
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          console.log("校验失败");
        }
      });
    },
    // 重置添加用户表单
    addFormReset() {
      this.$refs.addFormRef.resetFields();
    },

    //编辑
    async showEditDialog(id) {
      try {
        const res = await this.$http.get(`/admin/get/${id}`);
        this.editForm.id = id;
        if (res.data.code === 200) {
          console.log(res.data.data);
          this.editForm = res.data.data;
          this.editDialogVisible = true;
        }
      } catch (error) {
        this.$message({
          message: res.data.msg,
          type: "error"
        });
      }
    },
    // 提交编辑用户表单
    async editUser() {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          this.$http.put("/admin/edit", this.editForm).then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: "编辑用户成功",
                type: "success"
              });
              this.editDialogVisible = false;
              this.getUserList();
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          console.log("校验失败");
        }
      });
    },
    // 重置编辑用户表单
    editFormReset() {
      this.$refs.editFormRef.resetFields();
    },

    //删除
    async deleteUser(id) {
      try {
        const confirm = await this.$confirm("确认删除该用户吗？", "删除用户", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        if (!confirm) {
          return;
        }
        const res = await this.$http.delete(`/admin/delete/${id}`);
        if (res.data.code === 200) {
          this.$message({
            message: "删除用户成功",
            type: "success"
          });
          this.getUserList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      } catch (error) {
        console.error("删除用户失败:", error);
      }
    },
    // 进入编辑模式
    enterEditMode(row) {
      // console.log(row);
      row.isEditing = true;
      row.originalRole = row.role;
    },

    // 处理角色变更
    handleRoleChange(row) {
      // 1. 清除blur的延迟计时器，让blur不执行
      if (this.blurTimer) {
        clearTimeout(this.blurTimer);
        this.blurTimer = null; // 清空计时器
      }
      console.log(row);
      this.$http
        .post("/admin/role", {
          id: row.id,
          role: row.role
        })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success("角色分配成功");
            row.isEditing = false; // 成功后关闭编辑态
          } else {
            this.$message.error(res.data.msg);
            row.role = row.originalRole; // 失败恢复原始角色
          }
        })
        .catch(error => {
          console.error("角色分配失败:", error);
          this.$message.error("分配失败");
          row.role = row.originalRole;
        });
    },
    // 取消编辑（失去焦点时）
    cancelEdit(row) {
      // 1. 清除之前可能存在的延迟，避免多次触发
      if (this.blurTimer) clearTimeout(this.blurTimer);
      // 2. 延迟100ms执行，给change留时间
      this.blurTimer = setTimeout(() => {
        if (row.isEditing) {
          row.role = row.originalRole;
          row.isEditing = false;
        }
      }, 100);
    }
  },

  //生命周期 - 创建完成（可以访问当前this 实例）
  created() {
    this.getUserList();
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
</style>