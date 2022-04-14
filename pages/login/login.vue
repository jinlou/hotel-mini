<template>
	<view class="page">
		<button type="primary" @click="accoutLogin">账号密码登录</button>
		<button type="primary" open-type="getPhoneNumber" @getphonenumber="directLogin">一键登录</button>
	</view>
</template>
<script>
	let globalData = getApp().globalData
	export default {
		data() {
			return {
				accout: 'wll',
				password: 'a123456'
			}
		},
		onShow() {
			console.log(3)
			console.log(globalData)
			console.log(this.$api)
		},
		mounted() {
			console.log(1)
			// console.log(globalData)
		},
		methods: {
			accoutLogin() {
				uni.getUserProfile({
					desc: '用于完善会员资料',
					success: (res) => {
						console.log(res)
						getApp().globalData.userInfo = res
						this.idLogin(res)
					}
				})
			},
			directLogin(e) {
				// #ifdef MP-WEIXIN
				console.log('e', e);
				uni.login({
					success: (res) => {
						console.log(res);
						console.log(this.accout)
						const data1 = res;
						this.code = res.code;
						if (e.detail.errMsg == "getPhoneNumber:ok") {
							this.$api.wxLogin({
								code: this.code,
								encryptedData: e.detail.encryptedData,
								iv: e.detail.iv,
								mini_version: 'v3.0.5'
							}).then(res => {
								if (res.statusCode == 200) {
									if (res.data.result == 'FAIL') {
										uni.showToast({
											icon: 'none',
											title: '登陆失败'
										})
									} else {
										uni.setStorage({
										    key: 'userInfo',
										    data: data.data
										})
										uni.setStorage({
										    key: 'isLogin',
										    data: true
										})
										wx.getSetting({
											success: function(res) {
												console.log(res)
												if (res.authSetting['scope.userInfo']) {
													uni.getUserInfo({
														provider: 'weixin',
														success: function(res) {
															uni.navigateBack();
														},
														fail: function(e) {
															console.log(e)
														}
													});
												} else {
													uni.navigateTo({
														url: '/uselessPages/pages/authorize'
													})
												}
											},
											fail: function(e) {
												console.log(e)
											}
										})
									}
								} else {
									console.log('code:', this.code)
									console.log('encryptedData:', e.detail.encryptedData)
									console.log('iv:', e.detail.iv)
									if (res.data.err_code == 110002) {
										uni.showToast({
											title: '请重试一次',
											icon: 'none'
										})
									} else {
										Notify(res.data.err_msg);
									}
								}
							})
						} else {
							console.log('用户点击了拒绝');
						}
					},
					fail: (err) => {
						console.log('登录失败：', err)
					}
				})
				// #endif
				// #ifdef MP-ALIPAY
				my.getAuthCode({
					scopes: 'auth_base',
					success: res => {
						if (res.authCode) {
							console.log(res)
							this.getAliOpenID(res.authCode)
						}
					},
					fail: err => {
						console.log(err)
					}
				})
				// #endif
			},
			idLogin(userInfo) {
				// let _this = this
				uni.login({
					success: res => {
						console.log(res)
						this.$api.idLogin({
							code: res.code,
							login_id: this.accout,
							password: this.password,
							user_inf: JSON.stringify(userInfo),
							mini_version: 'v3.0.5'
						}).then(res => {
							console.log(res)
						}).catch(err => {
							console.log(err)
						})
					},
					fail: err => {
						console.log(err)
					}
				})
			},
			getWxOpenID(res) {

			},
			getAliOpenID(res) {

			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
