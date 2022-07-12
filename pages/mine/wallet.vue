<template>
	<view class="content">
		<view class="top">
			<view>可用余额</view>
			<view class="balance">{{balance}}</view>
		</view>
		<view class="lists">
			<view class="wallet-list" v-for="(item, index) in lists" :key="index" @click="goTo(item)">
				<view class="one">
					<image class="logo" src="/static/logo.png"></image>
					<view class="right">
						<text>{{item.text}}</text>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				balance: 100,
				lists: [
					{
						text: '充值记录',
						type: 1,
					},
					{
						text: '支付记录',
						type: 2,
					},
					{
						text: '退款记录',
						type: 3
					},
				],
			}
		},
		components: {},
		onLoad() {},
		methods: {
			goTo(item) {
				console.log(item)
				uni.navigateTo({
					url: '/pages/mine/walletRecord?type=' + item.type,
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
		background: #00a4ef;
	}

	.top {
		height: 100px;
		font-size: 14px;
		color: #fff;
		padding: 10px 15px 0;

		.balance {
			font-size: 28px;
			line-height: 42px;
		}
	}

	.lists {
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		background: #fff;
		height: calc(100vh - 100px);

		.wallet-list {
			.one {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 42px;
				padding: 0 15px 0 10px;
				
				.logo {
					width: 20px;
					height: 20px;
					margin: 0 20px;
				}
				
				.right {
					height: 100%;
					flex-grow: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid #ebedf2;
					
					text {
						font-size: 14px;
					}
				}
			}
		}
	}
</style>
