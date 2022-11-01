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
							<image src="@/static/image/order_icon.png" mode=""></image>
							<text>{{item.hotelBranch.name || '客房助手管家'}}</text>
						</view>
						<view class="right" :class="['active' + item.status]">
							{{item.status | statusFilter}}
						</view>
					</view>
					<view class="content">
						<view class="one">
							<view class="left">订单编号</view>
							<view class="right">{{item.orderSn}}</view>
						</view>
						<view class="one">
							<view class="left">房间号</view>
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
						<view v-if="item.refundStatus == 0 && item.status != 5  && item.status != 0 && item.payStatus == 1 && item.payType == 1" style="margin-left: 15px;" @click.stop="showDialog(item)">退款</view>
					</view>
				</view>
			</view>
			<uni-load-more v-if="orderList.length || status == 'loading'" :status="status"></uni-load-more>
			<Nothing v-if="!orderList.length" style="margin-top: 90rpx;" title="近期暂无订单"></Nothing>
		</view>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="退款" v-modal="reason" before-close
				placeholder="请输入退款说明" @confirm="applyRefund"></uni-popup-dialog>
		</uni-popup>
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
				modifyInfo: {},
				reason: '',
			}
		},
		filters: {
			statusFilter(status) {
				if(status == 2) {
					return '配送中'
				}  else if (status == 4) {
					return '已完成'
				} else if (status == 5) {
					return '已取消'
				} else if (status == 0){ 
					return '待接单'
				} else if (status == 1){ 
					return '已接单'
				}  else if (status == 3){ 
					return '已送达'
				} else {
					return ''
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
					orderType: 'goods'
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
			showDialog(item) {
				this.modifyInfo = item
				this.$refs.inputDialog.open()
			},
			applyRefund(val) {
				console.log(val)
				if(!val) {
					uni.showToast({
						title: '请填写原因',
						icon: 'none'
					})
					return
				}
				this.$api.applyRefund({
					orderId: this.modifyInfo.orderId,
					orderSn: this.modifyInfo.orderSn,
					refundReasonExplain: val
				}).then(res => {
					if(res.code == 0) {
						uni.showToast({
							icon: 'none',
							title: '已提交申请，请稍等…'
						})
						this.$refs.inputDialog.close()
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
					display: flex;
					justify-content: space-between;
					height: 80rpx;
					align-items: center;
					
					image {
						width: 48rpx;
						height: 48rpx;
					}
					
					text {
						margin-left: 4rpx;
						font-size: 28rpx;
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
					
					&.active5,&.active4 {
						background: #E4E4E4;
						color: #fff;
					}
					
					&.active2,&.active1 {
						background: #5BCD33;
						color: #fff;
					}
					
					&.active0 {
						background: rgba(0,128,255,.2);
						color: #007df8;
					}
				}
			}
			
			.content {
				border-top: 1px solid #ebedf2;
				padding: 26rpx 20rpx 20rpx;
				
				.one {
					display: flex;
					font-size: 22rpx;
					margin-bottom: 20rpx;
					
					.left {
						width: 170rpx;
						flex-grow: 0;
						flex-shrink: 0;
						padding-left: 14rpx;
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
