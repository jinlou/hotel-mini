<template>
	<view class="content">
		<view class="user-info">
			<view class="user">
				<image v-if="loaded" :src="userInfo.avatar" mode=""></image>
				<image v-else src="/static/image/user.png" mode=""></image>
			</view>
			
			<button v-if="!loaded" custom-class="wechat-btn" color="#07c160" open-type="getPhoneNumber"
				style="width: 100% ;" @click="getUserInfo">
				未登录
			</button>
			<text v-else @click="getUserInfo()">未登录1</text>
		</view>
		<view class="wallet">
			<view>
				<text>余额</text>
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
				<view class="other" v-for="(item, index) in others" :key="index" @click="goTo(item.defaultPage)">
					<image :src="item.bg" mode=""></image>
					<view>{{item.text}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		baseURL
	} from 'api/axios'
	export default {
		data() {
			return {
				loaded: false,
				title: 'Hello',
				userInfo: {
					name: '',
					avatar: ''
				},
				money: 0,
				orders: [{
						text: '充电订单',
						bg: require('@/static/image/charge.png'),
						url: 'chargeOrderList',
						defaultPage: 'chargeOrderList'
					},
					{
						text: '服务订单',
						bg: require('@/static//image/order_serve.png'),
						url: '',
						defaultPage: ''
					},
					{
						text: '购物订单',
						bg: require('@/static/image/shop_order.png'),
						url: '',
						defaultPage: ''
					},
				],
				others: [{
						text: '常见问题',
						bg: require('@/static//image/question.png'),
						appID: '',
						defaultPage: 'question'
					},
					{
						text: '问题反馈',
						bg: require('@/static/image/question_suggest.png'),
						appID: '',
						defaultPage: 'feedback'
					},
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
			}
		},
		onLoad() {
			console.log(baseURL)
		},
		methods: {
			getUserInfo() {
				uni.getUserInfo({
					success: res => {
						console.log(res)
					}
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
					uni.navigateTo({
						url: '/uselessPages/pages/' + item.defaultPage
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background: #00a4ef;
		height: 100vh;
	}


	.user-info {
		height: 50px;
		display: flex;
		align-items: center;
		color: #fff;

		.user {
			background: #fff;
			width: 70rpx;
			height: 70rpx;
			border-radius: 50%;
			margin-left: 15px;
			margin-right: 10px;
			image {
				width: 35px;
				height: 35px;
				
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
		background: #123132;
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
