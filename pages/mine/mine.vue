<template>
	<view class="content">
		<view class="user-info">
			<view class="user">
				<image v-if="userInfo.avatar" :src="userInfo.avatar" mode=""></image>
				<image v-else src="/static/image/user.png" mode=""></image>
			</view>
			<text @click="login">{{userInfo.nickname || '去登录'}}</text>
		</view>
		
		<!-- <view class="mine">
			<view class="orders">
				<view class="order" v-for="(item, index) in orders" :key="index" @click="goTo(item)">
					<view class="one">
						<image :src="item.bg" mode=""></image>
						<view>{{item.text}}</view>
					</view>
					<uni-icons type="right" color="#666" size="22" ></uni-icons>
				</view>
			</view>
			<view class="center">
				
			</view>
			<view class="orders">
				<view class="order" v-for="(item, index) in novel" :key="index" @click="goTo(item)">
					<view class="one">
						<image :src="item.bg" mode=""></image>
						<view>{{item.text}}</view>
					</view>
					<uni-icons type="right" color="#666" size="22" ></uni-icons>
				</view>
			</view>
		</view>
		 -->
		<view class="mine">
			<view class="orders">
				<view class="order" v-for="(item, index) in orders" :key="index" @click="goTo(item)">
					<view class="one">
						<image :src="item.bg" mode=""></image>
						<view>{{item.text}}</view>
					</view>
					<uni-icons type="right" color="#666" size="22" ></uni-icons>
				</view>
			</view>
			<view class="center">
			</view>
			<view class="orders">
				<view class="order" v-for="(item, index) in novel" :key="index" @click="goTo(item)">
					<view class="one">
						<image :src="item.bg" mode=""></image>
						<view>{{item.text}}</view>
					</view>
					<uni-icons type="right" color="#666" size="22" ></uni-icons>
				</view>
			</view>
			<view class="center">
			</view>
			<view class="orders">
				<view class="order" v-for="(item, index) in others" :key="index" @click="goTo(item)">
					<view class="one">
						<image :src="item.bg" mode=""></image>
						<view>{{item.text}}</view>
					</view>
					<uni-icons type="right" color="#666" size="22" ></uni-icons>
				</view>
			</view>
		</view>
		<Auth ref="auth"></Auth>
	</view>
</template>

<script>
	import Auth from '@/components/authNew.vue'
	import {
		baseURL
	} from 'api/axios'
	export default {
		data() {
			return {
				loaded: false,
				title: 'Hello',
				userInfo: {
					nickName: '',
					avatarUrl: ''
				},
				money: 0,
				orders: [
					{
						text: '充电订单',
						bg: require('@/static/image/order.png'),
						url: 'chargeOrderList',
						defaultPage: 'chargeOrderList'
					},
				
					{
						text: '购物订单',
						bg: require('@/static/image/car.png'),
						url: '',
						defaultPage: 'orderList'
					},
					{
						text: '服务工单',
						bg: require('@/static/image/user1.png'),
						url: '',
						Page: '/pages/mine/serviceList'
					},
				],
				novel: [
					{
						text: '我的书架',
						bg: require('@/static/image/order.png'),
						Page: '/pages/service/store',
						defaultPage: ''
					},
				
					{
						text: '小说续费',
						bg: require('@/static/image/car.png'),
						Page: '/pages/service/novelVIP',
						defaultPage: ''
					},
				],
				others: [{
						text: '常见问题',
						bg: require('@/static/image/question1.png'),
						appID: '',
						defaultPage: 'question'
					},
					// {
					// 	text: '问题反馈',
					// 	bg: require('@/static/image/question_suggest.png'),
					// 	appID: '',
					// 	defaultPage: 'feedback'
					// },
					{
						text: '用户协议',
						bg: require('@/static/image/rule.png'),
						appID: '',
						defaultPage: 'novelAgreement'
					},
					{
						text: '关于我们',
						bg: require('@/static/image/aboutus.png'),
						appID: '',
						defaultPage: 'aboutUs'
					},
				],
				registerInfo: {},
			}
		},
		components: {
			Auth
		},
		onLoad() {
			console.log(baseURL)
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo') || {}
			uni.$once('registerSuccess', info => {
				this.userInfo = info
			})
		},
		mounted() {
		},
		methods: {
			alert() {
				this.$refs.auth.show()
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
			login() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			checkboxChange: function(e) {
				console.log(e)
				var checked = e.target.value
				var changed = {}
				for (var i = 0; i < this.checkboxItems.length; i++) {
					if (checked.indexOf(this.checkboxItems[i].name) !== -1) {
						changed['checkboxItems[' + i + '].checked'] = true
					} else {
						changed['checkboxItems[' + i + '].checked'] = false
					}
				}
			},
			radioChange: function(e) {
				var checked = e.target.value
				var changed = {}
				for (var i = 0; i < this.radioItems.length; i++) {
					if (checked.indexOf(this.radioItems[i].name) !== -1) {
						changed['radioItems[' + i + '].checked'] = true
					} else {
						changed['radioItems[' + i + '].checked'] = false
					}
				}
			},
			goTo(item) {
				console.log(item)
				if (item == 'login') {
					console.log(uni.getStorageSync('isLogin'))
					if (!uni.getStorageSync('isLogin')) {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}
				} else {
					if(item.defaultPage) {
						uni.navigateTo({
							url: '/uselessPages/pages/' + item.defaultPage
						})
					} else {
						uni.navigateTo({
							url: item.Page
						})
					}
					
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background: #00a4ef;
		// background: #232c37;
		height: 100vh;
	}


	.user-info {
		height: 70px;
		display: flex;
		align-items: center;
		color: #fff;

		.user {
			background: #fff;
			width: 35px;
			height: 35px;
			border-radius: 50%;
			margin-left: 15px;
			margin-right: 10px;

			image {
				width: 35px;
				height: 35px;
				border-radius: 50%;

			}
		}

	}

	.wallet {
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		margin: 0 15px;
		width: calc(100% - 30px);
		background: #232c37;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		color: #fff;
		padding: 0 8px;
		font-size: 15px;

		.money {
			margin-left: 4px;
			color: yellow;
		}

		.myWallet {
			height: 30px;
			width: 90px;
			border-radius: 10px;
			text-align: center;
			line-height: 30px;
			border: 1px solid #fff;
		}
	}

	.mine {
		height: calc(100% - 70px);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		background: #fff;
	}
	
	.center{
		height: 15rpx;
		background: #eee;
	}

	.orders {
		display: flex;
		justify-content: space-between;
		color: #333;
		align-items: center;
		background: #fff;
		flex-direction: column;
		box-sizing: border-box;
		padding: 0 30rpx;

		.order {
			text-align: center;
			display: flex;
			align-items: center;
			height: 90rpx;
			width: calc(100% - 15rpx);
			justify-content: space-between;
			border-bottom: 1rpx solid #ebedf2;
			
			.one {
				height: 100%;
				display: flex;
				align-items: center;
			}

			image {
				width: 30px;
				height: 30px;
				margin-right: 20rpx;
			}

			view {
				line-height: 20px;
				font-size: 14px;
				text-align: center;
			}
		}
	}

	.line {
		background: #eee;
		height: 8px;
	}

	.others {
		display: flex;
		justify-content: space-between;
		height: 80px;
		color: #333;
		padding: 0 15px;
		background: #fff;
		align-items: center;

		.other {
			width: 70px;
			text-align: center;

			image {
				width: 35px;
				height: 35px;
				border-radius: 50%;
			}

			view {
				line-height: 20px;
				font-size: 14px;
				text-align: center;
			}
		}
	}

	
</style>
