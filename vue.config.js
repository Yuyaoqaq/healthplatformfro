const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true, // 保留原配置
  css: {
    loaderOptions: {
      less: {
        // 配置 Less 全局变量（Vue CLI 4+ 用 additionalData，旧版本可能需要 prependData）
        additionalData: `@primary-color: #1890ff;`
      }
    }
  }
})
