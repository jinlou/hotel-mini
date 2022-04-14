<template>
	<view class="content">
		<view class="top">
			<view :class="['one', active == index ? 'active' : '' ]" v-for="(item,index) in lists" :key="index">
				{{item.text}}
			</view>
		</view>
		<view class="lists">
			<view class="wallet-list" v-for="(item, index) in orderList" :key="index" @click="goTo(item)">
				<view class="one">
					<image class="logo" src="/static/logo.png"></image>
					<view class="right">
						<text>{{item.text}}</text>
						<uni-icons type="right" size="14"></uni-icons>
					</view>
				</view>
			</view>
			<Nothing v-if="!orderList.length" style="margin-top: 90rpx;"></Nothing>
		</view>
	</view>
</template>

<script>
	import Nothing from '@/components/nothing.vue'
	export default {
		data() {
			return {
				active: 0,
				lists: [
					{
						text: '全部',
						type: 0,
					},
					{
						text: '租借中',
						type: 1,
					},
					{
						text: '已完成',
						type: 2
					},
					{
						text: '已取消',
						type: 3
					}
				],
				orderList: []
			}
		},
		components: {
			Nothing
		},
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
		background: #eee;
		min-height: 100vh;
	}
	
	.top {
		display: flex;
		padding: 20rpx 30rpx;
		position: fixed;
		top: 0;
		width: 100%;
		
		.one {
			width: 21%;
			margin: 0 2%;
			color: #333;
			font-size: 26rpx;
			background: #fff;
			text-align: center;
			height: 56rpx;
			line-height: 56rpx;
			border-radius: 24rpx;
			
			&.active {
				color: #fff;
				background: $uni-color-primary;
			}
		}
	}
	
	.lists {
		padding-top: 96rpx;
	}
</style>
