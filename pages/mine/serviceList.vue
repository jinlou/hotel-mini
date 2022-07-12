<template>
	<view class="page">
		<view class="top">
			<view @click="changeStatus(item)" :class="['one', active == item.type ? 'active' : '' ]" v-for="(item,index) in lists" :key="index">
				{{item.text}}
			</view>
		</view>
		<view class="lists">
			<view class="wallet-list" v-for="(item, index) in orderList" :key="index">
				<view class="oneOrder">
					<view class="status">
						<view class="left">
							<image src="@/static/logo.png" mode=""></image>
							<text>{{item.hotelBranch.name || '客房助手管家'}}</text>
						</view>
						<view class="right" :class="[items.status != 1 ? 'active' : '']">
							{{item.status | statusFilter}}
						</view>
					</view>
					<view class="content">
						<view class="one">
							<view class="left">订单编号</view>
							<view class="right">{{item.serviceSn}}</view>
						</view>
						<view class="one">
							<view class="left">房号/桌号</view>
							<view class="right">{{item.roomInfo.roomCode}}</view>
						</view>
						<view class="one">
							<view class="left">提交时间</view>
							<view class="right">{{item.addTime}}</view>
						</view>
						<view class="one">
							<view class="left">服务内容</view>
							<view class="right">{{item.comtent}}</view>
						</view>
						<view class="one">
							<view class="left">联系电话</view>
							<view class="right">{{item.contactNumber || '-'}}</view>
						</view>
						
						<view class="one">
							<view class="left">其他需求</view>
							<view class="right">{{item.remark || '-'}}</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="status"></uni-load-more>
			<Nothing v-if="!orderList.length" style="margin-top: 90rpx;"></Nothing>
		</view>
	</view>
</template>

<script>
	import Nothing from '@/components/nothing.vue'
	export default {
		data() {
			return {
				active: -1,
				lists: [
					{
						text: '全部',
						type: -1,
					},
					{
						text: '待处理',
						type: 0,
					},
					// {
					// 	text: '处理中',
					// 	type: 2
					// },
					{
						text: '已完成',
						type: 1
					},
					// {
					// 	text: '已取消',
					// 	type: 0
					// }
				],
				orderList: [],
				loading: true,
				status: 'more',
				page: 1,
				perPage: 10,
			}
		},
		filters: {
			statusFilter(status) {
				if(status == 1) {
					return '已完成'
				} else{ 
					return '已取消'
				}
			}
		},
		components: {
			Nothing
		},
		onLoad() {
			this.getOrderList()
		},
		onShow() {
			console.log('onSHow')
			uni.$on('updateList', () => this.getOrderList('mark'))
		},
		onReachBottom() {
			console.log('onReachBottom')
			this.getOrderList()
		},
		onPullDownRefresh() {
			console.log('onPullDownRefresh')
			this.getOrderList('mark')
		},
		methods: {
			goTo(item) {
				console.log(item)
				uni.navigateTo({
					url: '/uselessPages/pages/orderDetail?orderId=' + item.orderId
				})
			},
			changeStatus(item) {
				this.active = item.type
				this.page = 1
				this.status = 'loading'
				this.getOrderList('mark')
			},
			getOrderList(mark = '') {
				if(mark) {
					this.status = 'loading'
					this.page = 1
				}
				if(this.status == 'noMore') return
				this.loading = true
				this.$api.getServeiceList({
					processingStatus: this.active == -1 ? '' : this.active,
					page: this.page,
					per_page: this.perPage,
				}).then(res => {
					console.log(res)
					this.loading = false
					if(res.code == 0) {
						if (mark) this.orderList = []
						this.orderList = [...this.orderList, ...res.data.data]
						if(res.data.data.length < this.perPage) {
							this.status = 'noMore'
						} else {
							this.page++
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					console.log(err)
					this.loading = false
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background: #eee;
		min-height: 100vh;
	}
	
	.top {
		display: flex;
		padding: 20rpx 30rpx;
		position: fixed;
		top: 0;
		width: 100%;
		background: #eee;
		justify-content: space-around;
		
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
		padding: 96rpx 30rpx 0;
		
		.oneOrder {
			background: #fff;
			border-radius: 12rpx;
			margin-bottom: 16rpx;
			
			.status {
				display: flex;
				justify-content: space-between;
				height: 80rpx;
				align-items: center;
				padding: 0 20rpx;
				
				.left {
					image {
						width: 30rpx;
						height: 30rpx;
					}
					
					text {
						margin-left: 10rpx;
						font-size: 32rpx;
					}
				}
				
				.right {
					font-size: 26rpx;
					border-radius: 8rpx;
					background: #ebedf2;
					padding: 6rpx 16rpx;
					
					&.active {
						background:$uni-color-primary;
						color: #fff;
					}
				}
			}
			
			.content {
				border-top: 1px solid #ebedf2;
				padding: 26rpx 20rpx 20rpx;
				
				.one {
					display: flex;
					font-size: 26rpx;
					margin-bottom: 20rpx;
					
					.left {
						width: 170rpx;
						flex-grow: 0;
						flex-shrink: 0;
					}
				}
			}
			
			.btn {
				border-top: 1px solid #ebedf2;
				height: 90rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				padding: 0 20rpx;
				
				view {
					font-size: 26rpx;
					border: 1rpx solid #f25022;
					padding: 8rpx 20rpx;
					border-radius: 26rpx;
					color: #f25022;
				}
			}
		}
	}
</style>
