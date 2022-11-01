<template>
	<uni-popup ref="alertDialog" type="center">
		<view class="getPhone">
			<image src="/static/image/logo.png" mode=""></image>
			<view class="check">
				<radio v-model="checked" color="#74C7FF" style="transform:scale(0.7)"/>
				<view class="right">
					<view>我已阅读并同意
					<text @click="to('agreement')">《久电用户协议》</text>、
					<text @click="to()">《隐私政策》</text>
					，并授权久电使用该久电账号信息（如昵称、头像）进行统一管理。
					</view>
				</view>
			</view>
			<view class="txt">
				<button type="warn" style="background: #74C7FF;" class="btn" open-type="getPhoneNumber"
					@getphonenumber="miniprogramRegister">确定</button>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		data() {
			return {
				checked: false,
				registerInfo: {},
			}
		},
		methods: {
			show(info) {
				this.registerInfo = info
				this.$refs.alertDialog.open()
			},
			to(to) {
				uni.navigateTo({
					url: '/uselessPages/pages/' + to
				})
			},
			miniprogramRegister(info) {
				this.$refs.alertDialog.close()
				console.log(info)
				console.log(info)
				let _this = this
				// wx.login({
				// 	success(res1) {
				// 		console.log(res1)
				// 		if(res1.code) {
							_this.$api.miniprogramRegister({
								sessionKey: this.registerInfo.session_key,
								iv: this.registerInfo.iv,
								encryptedData: this.registerInfo.encryptedData,
								phonenumberIv: info.detail.iv,
								phonenumberEncryptedData: info.detail.encryptedData
							}).then(res => {
								console.log(res)
								if (res.code == 0) {
									console.log('登陆成功')
									_this.userInfo = {
										...res.data.userInfo
									}
									uni.setStorageSync('userInfo', res.data.userInfo)
									uni.setStorageSync('token', res.data.token)
									uni.setStorageSync('ss', res.data.ss)
									uni.$emit('registerSuccess', _this.userInfo)
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
						// } else {
							// console.log('登录失败！' + res.errMsg)
						// }
					// }
				// })
				
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.getPhone {
		width: 70vw;
		background: #E8F6FF;
		border-radius: 10px;
		text-align: center;
		padding-top: 24px;

		.txt {
			padding: 12px 20px 20px;
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
				width: 150px;
				font-size: 15px;
				border-radius: 24px;
			}
		}
		
		image {
			width: 126px;
			height: 126px;
		}
	}
	
	.check {
		display: flex;
		padding: 0 32rpx;
		align-items: baseline;
		
		radio {
			flex: 1;
		}
		
		.right {
			flex-grow: 1;
			flex-shrink: 1;
			padding-left: 8rpx;
			color: #7E7E7E;
			display: flex;
			flex-wrap: wrap;
			font-size: 12px;
			text-align: left;
			
			
			text {
				color: #74C7FF;
				display: inline;
			}
		}
	}
</style>
