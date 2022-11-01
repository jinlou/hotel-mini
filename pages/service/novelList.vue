<template>
	<view class="page">
		<view class="top">
			<view class="search"  style="width: 100%">
				<uni-search-bar @confirm="getData" :focus="true" v-model="searchValue" @clear="clear">
				</uni-search-bar>
			</view>
		</view>
		<view class="lists">
			<view class="bookList" v-for="(item, index) in bookList" :key="index">
				<view class="one" @click="detail(item)">
					<image class="cover" :src="item.cover">
					<view class="info">
						<view class="name ellipsis">{{item.bookName}}</view>
						<view class="desc">{{item.description.length > 50 ? (item.description.slice(0, 50) + '…'): item.description}}</view>
						<view class="author ellipsis">{{item.author}}/{{item.status == 2 ? '完结' : '连载中'}}</view>
					</view>
				</view>
			</view>
			<Nothing v-if="!bookList.length" style="margin-top: 156rpx;" title="暂无数据"></Nothing>
			<uni-load-more v-if="bookList.length || status == 'loading'" :status="status"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import Nothing from '@/components/nothing.vue'
	export default {
		data() {
			return {
				searchValue: '',
				bookList: [],
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
					return '待处理'
				}
			}
		},
		components: {
			Nothing
		},
		onLoad() {
			this.getData()
		},
		onShow() {
			console.log('onSHow')
			uni.$on('updateList', () => this.getData('mark'))
		},
		onReachBottom() {
			console.log('onReachBottom')
			this.getData()
		},
		onPullDownRefresh() {
			console.log('onPullDownRefresh')
			this.getData('mark')
		},
		methods: {
			clear() {
				this.searchValue = ''
				this.getData()
			},
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
				this.getData('mark')
			},
			getData(mark = '') {
				if(mark) {
					this.status = 'loading'
					this.page = 1
				}
				if(this.status == 'noMore') return
				this.loading = true
				this.$api.searchNovel({
					page: this.page,
					per_page: this.perPage,
					keyword: this.searchValue
				}).then(res => {
					console.log(res)
					this.loading = false
					if(res.code == 0) {
						if (mark) this.bookList = []
						this.bookList = [...this.bookList, ...res.data.data]
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
			detail(item) {
				uni.navigateTo({
					url: '/pages/service/novelDesc?id=' + item.bookId
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
		position: fixed;
		top: 0;
		width: 100%;
		background: #eee;
		justify-content: space-around;
		
		.one {
			width: 21%;
			margin: 0 2%;
			color: #333;
			font-size: 30rpx;
			background: #e4f3ff;
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
			box-shadow: 0px 3px 3px 1px rgba(0,0,0,0.05);
			
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
					
					&.active0 {
						background: rgba(0,128,255,.2);
						color: #007df8;
					}
					
					&.active1 {
						background: #E4E4E4;
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
	
	.bookList {
		.one {
			display: flex;
			margin: 15px 0;
			height: 100px;
			
			.cover {
				width: 75px;
				height: 100px;
				margin-right: 8px;
				flex-grow: 0;
				flex-shrink: 0;
			}
			
			
			.info {
				display: flex;
				justify-content: space-between;							
				font-family: PingFang SC-Bold, PingFang SC;
				font-weight: bold;
				color: #000000;
				flex-direction: column;
				
				.name {
					font-size: 18px;
				}
				
				.desc {
					font-size: 12px;
				}
				
				.author {
					font-size: 10px;
				}
			}
		}
	}
</style>
