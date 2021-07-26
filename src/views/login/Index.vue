<template>
  <div>
    <div class="form-box">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
        <el-form-item label="name:" prop="username">
          <el-input v-model="loginForm.username" placeholder="enter name"></el-input>
        </el-form-item>
        <el-form-item label="password:" prop="password">
          <el-input v-model="loginForm.password" placeholder="enter password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="loading">Login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: "Index",
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: 'enter name', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'enter password', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods:{
    ...mapActions(['LOGIN']),
    onSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.login()
        }
      })
    },
    async login() {
      const data = {
        ...this.loginForm
      }
      this.loading = true
      const { res } = await this.$post(this.$urls.login, data)
      this.loading = false
      if (res) {
        this.LOGIN(res.data)
        this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-box {
  width: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
</style>