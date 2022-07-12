<template>
	<uni-popup ref="alertDialog" type="center">
		<view class="getPhone">
			<view class="txt">
				<view class="title">授权注册</view>
				<view class="con">授权获取手机号即可注册登录</view>
				<button type="warn" class="btn" open-type="getPhoneNumber"
					@getphonenumber="miniprogramRegister">确定</button>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		data() {
			return {
				registerInfo: {},
			}
		},
		methods: {
			show(info) {
				this.registerInfo = info
				this.$refs.alertDialog.open()
			},
			miniprogramRegister(info) {
				this.$refs.alertDialog.close()
				console.log(info)
				console.log(info)
				this.$api.miniprogramRegister({
					sessionKey: this.registerInfo.session_key,
					iv: this.registerInfo.iv,
					encryptedData: this.registerInfo.encryptedData,
					phonenumberIv: info.detail.iv,
					phonenumberEncryptedData: info.detail.encryptedData
				}).then(res => {
					console.log(res)
					if (res.code == 0) {
						console.log('登陆成功')
						this.userInfo = {
							...res.data.userInfo
						}
						uni.setStorageSync('userInfo', res.data.userInfo)
						uni.setStorageSync('token', res.data.token)
						uni.$emit('registerSuccess', this.userInfo)
					} else {
						uni.showToast({
							title: res.msg || '网络错误',
							icon: 'none'
						})
					}
				}).catch(err => {
					console.log(err)
					uni.showToast({
						title: err.msg || '网络错误',
						icon: 'none'
					})
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.getPhone {
		width: 70vw;
		height: 155px;
		background: #fff;
		border-radius: 10px;

		.txt {
			padding: 24px 20px 20px;
			text-align: center;
			display: flex;
			flex-direction: column;
			font-size: 15px;

			.title {
				font-weight: 600;
			}

			.con {
				margin: 15px 0;
			}

			.btn {
				width: 100%;
				font-size: 15px;
			}
		}
	}
</style>
