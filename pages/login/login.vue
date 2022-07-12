<template>
	<view class="page">
		<image src="@/static/logo.png" class="logo" mode=""></image>
		<button class="btn" type="primary" @click="login">登录</button>
		<Auth ref="auth"></Auth>
	</view>
</template>
<script>
	import Auth from '@/components/auth.vue'
	let globalData = getApp().globalData
	export default {
		data() {
			return {
				registerInfo: {},
			}
		},
		onShow() {
			console.log(3)
			console.log(globalData)
			console.log(this.$api)
		},
		components: {
			Auth
		},
		mounted() {
			console.log(1)
			// console.log(globalData)
			uni.$once('registerSuccess', info => {
				this.userInfo = info
				uni.navigateBack()
			})
		},
		methods: {
			login() {
				let _this = this
				uni.getUserProfile({
					desc: '用于完善用户信息',
					success: function(e) {
						console.log(e)
						_this.registerInfo = {
							..._this.registerInfo,
							...e
						}
						_this.getUserProfile()
					},
					fail: function(e) {
						console.log(e)
					}
				})
			},
			getUserProfile() {
				let _this = this
				wx.login({
					success(res) {
						if (res.code) {
							_this.$api.adminAuthLogin({
								code: res.code
							}).then(res => {
								console.log(res)
								if (res.code == 404) {
									_this.registerInfo.session_key = res.data.session_key
									_this.$refs.auth.show(_this.registerInfo)
								} else if (res.code == 0) {
									console.log('登陆成功')
									_this.userInfo = {
										...res.data.userInfo
									}
									uni.setStorageSync('userInfo', res.data.userInfo)
									uni.setStorageSync('token', res.data.token)
									uni.setStorageSync('ss', res.data.ss)
									uni.navigateBack({
										fail() {
											uni.navigateTo({
												url: '/pages/index/index'
											})
										}
									})
								} else {
									uni.showToast({
										title: res.msg || '网络错误',
										icon: 'none'
									})
								}
							}).catch(err => {
								console.log(err.errMsg)
							})
						} else {
							console.log('登录失败！' + res.errMsg)
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		width: 200rpx;
		height: 200rpx;
		margin: 200rpx 100rpx;
	}

	.btn {
		width: 80%;
	}
</style>
