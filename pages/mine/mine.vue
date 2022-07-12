<template>
	<view class="content">
		<view class="user-info">
			<view class="user">
				<image v-if="userInfo.avatar" :src="userInfo.avatar" mode=""></image>
				<image v-else src="/static/image/user.png" mode=""></image>
			</view>
			<text @click="login">{{userInfo.nickname || '去登录'}}</text>
		</view>
		<view class="wallet">
			<view>
				<text @click="alert">余额</text>
				<text class="money">{{money}}</text>
			</view>
			<view class="myWallet" @click="goTo('wallet')">
				我的钱包
			</view>
		</view>
		<view class="mine">
			<view class="orders">
				<view class="order" v-for="(item, index) in orders" :key="index" @click="goTo(item)">
					<image :src="item.bg" mode=""></image>
					<view>{{item.text}}</view>
				</view>
			</view>
			<view class="line"></view>
			<view class="others">
				<view class="other" v-for="(item, index) in others" :key="index" @click="goTo(item)">
					<image :src="item.bg" mode=""></image>
					<view>{{item.text}}</view>
				</view>
			</view>
		</view>
		<Auth ref="auth"></Auth>
	</view>
</template>

<script>
	import Auth from '@/components/auth.vue'
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
				orders: [{
						text: '充电订单',
						bg: require('@/static/image/charge.png'),
						url: 'chargeOrderList',
						defaultPage: 'chargeOrderList'
					},
					{
						text: '服务工单',
						bg: require('@/static//image/order_serve.png'),
						url: '',
						Page: '/pages/mine/serviceList'
					},
					{
						text: '购物订单',
						bg: require('@/static/image/shop_order.png'),
						url: '',
						defaultPage: 'orderList'
					},
				],
				others: [{
						text: '常见问题',
						bg: require('@/static//image/question.png'),
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
						bg: require('@/static/image/agreement.png'),
						appID: '',
						defaultPage: 'agreement'
					},
					{
						text: '关于我们',
						bg: require('@/static/image/about_us.png'),
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
		height: 50px;
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
		height: calc(100% - 100px);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		background: #fff;
	}

	.orders {
		display: flex;
		justify-content: space-between;
		height: 90px;
		color: #333;
		align-items: center;
		background: #fff;
		box-sizing: border-box;

		.order {
			width: 33%;
			text-align: center;

			image {
				width: 40px;
				height: 40px;
				border-radius: 50%;
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
