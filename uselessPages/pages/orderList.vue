<template>
	<view class="page">
		<view class="top">
			<view @click="changeStatus(item)" :class="['one', active == item.type ? 'active' : '' ]" v-for="(item,index) in lists" :key="index">
				{{item.text}}
			</view>
		</view>
		<view class="lists">
			<view class="wallet-list" v-for="(item, index) in orderList" :key="index" @click="goTo(item)">
				<view class="oneOrder">
					<view class="status">
						<view class="left">
							<image src="@/static/logo.png" mode=""></image>
							<text>{{item.hotelBranch.name || '客房助手管家'}}</text>
						</view>
						<view class="right" :class="[items.status != 5 ? 'active' : '']">
							{{item.status | statusFilter}}
						</view>
					</view>
					<view class="content">
						<view class="one">
							<view class="left">订单编号</view>
							<view class="right">{{item.orderSn}}</view>
						</view>
						<view class="one">
							<view class="left">房号/桌号</view>
							<view class="right">{{item.roomInfo.roomCode}}</view>
						</view>
						<view class="one">
							<view class="left">商品明细</view>
							<view class="right">{{item.goods}}</view>
						</view>
						<view class="one">
							<view class="left">订单金额</view>
							<view class="right">{{item.goodsAmount}}</view>
						</view>
						<view class="one">
							<view class="left">支付状态</view>
							<view class="right">{{item.payStatus ? '已支付' : '未支付'}}</view>
						</view>
						<view class="one">
							<view class="left">支付方式</view>
							<view class="right">{{item.payType ? '微信支付' : '现金支付'}}</view>
						</view>
						<view class="one">
							<view class="left">提交时间</view>
							<view class="right">{{item.addTime}}</view>
						</view>
					</view>
					<view class="btn" v-if="item.status == 0 || (item.status > 0 && item.status < 4 && item.payStatus)">
						<view v-if="item.status == 0" @click.stop="cancelOrder(item)">取消订单</view>
						<view v-if="item.status > 0 && item.status < 4 && item.payStatus" @click.stop="confirmReceipt(item)">确认订单</view>
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
						text: '待接单',
						type: 0,
					},
					{
						text: '配送中',
						type: 2
					},
					{
						text: '已完成',
						type: 4
					},
					{
						text: '已取消',
						type: 5
					}
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
					return '已接单'
				} else if (status == 2) {
					return '配送中'
				}  else if (status == 3 || status == 4) {
					return '已完成'
				} else if (status == 5) {
					return '已取消'
				} else{ 
					return '待接单'
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
				this.$api.getOrderList({
					status: this.active == -1 ? '' : this.active,
					page: this.page,
					per_page: this.perPage,
					order_type: 'goods'
				}).then(res => {
					this.loading = false
					if(res.code == 0) {
						if (mark) this.orderList = []
						this.orderList = [...this.orderList, ...res.data.data]
						if(res.data.data.length < this.perPage) {
							this.status = 'noMore'
						} else {
							this.page++
						}
						this.orderList.forEach(v => {
							let goods = []
							v.orderGoods.forEach(y => {
								goods.push(y.goodsName)
							})
							v['goods'] = goods.join(',')
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					this.loading = false
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			cancelOrder(item) {
				this.$api.cancelOrder({
					orderId: item.orderId,
					orderSn: item.orderSn,
				}).then(res => {
					if(res.code == 0) {
						uni.showToast({
							icon: 'none',
							title: '已取消订单'
						})
						this.getOrderList('mark')
					} else {
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			confirmReceipt(item) {
				this.$api.confirmReceipt({
					orderId: item.orderId,
					orderSn: item.orderSn,
				}).then(res => {
					if(res.code == 0) {
						uni.showToast({
							icon: 'none',
							title: '已确认订单'
						})
						this.getOrderList('mark')
					} else {
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
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
						color: #00aeef
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
