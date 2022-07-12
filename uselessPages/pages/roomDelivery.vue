<template>
	<view class="content">
		<Room></Room>
		<view class="needs">
			<view class="top">
				<view class="title">
					<view class="line"></view>
					<text>客房送物</text>
					<text class="txt">一键提交 快速送达到客房</text>
				</view>
			</view>
		
			<view class="needsList">
				<view class="one" v-for="(item,index) in needsList" :key="index">
					<view class="left">{{item.name}}</view>
					<view class="right">
						<uni-icons type="minus" size="24" @click="minus(item)" :color="item.number == 0 ? '#999' : '#00a4ef'"></uni-icons>
						<view>{{item.number}}</view>
						<uni-icons type="plus" size="24" @click="plus(item)" :color="item.number == 9 ? '#999' : '#00a4ef'"></uni-icons>
					</view>
					<!-- <uni-number-box v-model="item.number" :min="0" :max="9"></uni-number-box> -->
				</view>
			</view>
			<view class="more">
				<textarea class="info" v-model.trim="content" placeholder="如有其他需求,请输入…" />
			</view>
		</view>
		<button type="primary" @click="submit" class="submit">提交</button>
	</view>
</template>

<script>
	import Room from '@/components/room.vue'
	export default {
		data() {
			return {
				roomInfo: {},
				needsList: [],
			}
		},
		components: {
			Room
		},
		onLoad(options) {
			this.roomInfo = options
		},
		mounted() {
			this.getNeeds()
		},
		computed: {
			choosedList() {
				let arr = []
				this.needsList.forEach(v => {
					if(v.number) {
						arr.push({
							name: v.name,
							number: v.number
						})
					}
				})
				return arr
			}
		},
		methods: {
			getNeeds() {
				this.$api.roomItems().then(res => {
					console.log(res)
					this.needsList = res.data
					this.needsList.forEach(v => {
						v.number = 0
					})
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			minus(item) {
				if(!item.number) return
				this.needsList.forEach(v => {
					if(v.id == item.id) {
						v.number--
					}
				})
			},
			plus(item) {
				if(item.number == 9) return
				this.needsList.forEach((v, i) => {
					if(v.id == item.id) {
						v.number++
						this.$set(this.needsList, i, v)
					}
				})
				console.log(this.needsList)
			},
			submit() {
				console.log(this.choosedList)
				if(!this.choosedList.length) {
					uni.showToast({
						icon: 'none',
						title: '请选择物品'
					})
				} else {
					this.$api.roomSendItems({
						hotelRoomId: uni.getStorageSync('roomInfo').roomId,
						contactNumber: uni.getStorageSync('userInfo').phone,
						items: JSON.stringify(this.choosedList),
						remark: this.content,
					}).then(res => {
						if(res.code == 0) {
							uni.showToast({
								icon: 'none',
								title: '服务已提交，请稍后…'
							})
							wx.requestSubscribeMessage({
								tmplIds: this.$serviceIDs,
								success (res) { 
									console.log(res)
								},
								complete() {
									uni.navigateBack()
								}
							})
						}
					}).catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.msg
						})
					})
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 20rpx 30rpx;
		background: #eee;
		min-height: 100vh;
		color: #333;
	}
	
	.needs {
		background: #fff;
		border-radius: 8rpx;
		overflow: hidden;
		margin-top: 20rpx;
		
		.top {
			background: #fff;
			padding: 25rpx 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 24rpx;
		
			.title {
				display: flex;
				align-items: center;
		
				.line {
					width: 10rpx;
					height: 26rpx;
					border-radius: 10rpx;
					background: $uni-color-primary;
					margin-right: 8rpx;
				}
		
				text {
					color: #333;
					font-size: 26rpx;
					font-weight: 600;
				}
				
				.txt {
					color: #999;
					font-size: 18rpx;
				}
			}
		}
		
		.needsList {
			display: flex;
			flex-wrap: wrap;
			padding-top: 16rpx;
			border-top: 1rpx solid #ebedf2;
			
			.one {
				width: 46%;
				display: flex;
				height: 90rpx;
				border-radius: 45rpx;
				align-items: center;
				justify-content: space-between;
				border: 1rpx solid #ebedf2;
				padding: 20rpx;
				margin: 0 2% 12rpx;
				
				.left {
					font-size: 24rpx;
				}
				
				.right {
					display: flex;
					align-items: center;
					height: 100%;
					
					view {
						padding: 0 8rpx;
						height: 90rpx;
						line-height: 90rpx;
					}
				}
			}
		}
	}

	.more {
		margin-top: 16rpx;
		background: #fff;
		border-radius: 8rpx;
		padding: 20rpx;
		font-size: 24rpx;

		.info {
			height: 140rpx;
			background: #eee;
			padding: 8rpx 6rpx;
			width: 100%;
			border-radius: 10rpx;
			box-sizing: border-box;
		}
	}

	.submit {
		margin: 10px 0 30px;
		background: $uni-color-primary;
	}

	.button {
		height: 40rpx;
		line-height: 28rpx;
		font-size: 20rpx;
		padding: 6rpx 10rpx;
		color: #fff;
		background: $uni-color-primary;
		flex-grow: 0;
		flex-shrink: 0;
	}
</style>
