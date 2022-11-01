<template>
	<!-- <view class="content" style="background-image: url('/static/image/logo.png')"> -->
	<view class="content">
		<image class="bg" src="/static/image/bg5.jpg" mode=""></image>
		<view class="outer">
			<!-- <view class="top">
				<text>联系前台</text>
				<view class="phone" v-if="phone">
					<uni-icons type="phone" color="#fff"></uni-icons>
					<text @click="call">{{phone}}</text>
				</view>
			</view> -->
			<Room></Room>
			
			<view class="question" style="margin-bottom: 20rpx;">
				<view class="top">
					<view class="title">
						<view class="line"></view>
						<text>联系前台</text>
						<text class="txt">点击下方电话联系前台</text>
					</view>
					<!-- <view class="refresh" @click="refresh">
						<image src="@/static/image/refresh.png" mode=""></image>
						<text>换一批</text>
					</view> -->
				</view>
			
				<view class="questionList">
					<view class="one" v-for="(item,index) in phone" :key="index"  @click="call(item.content)">
						<view class="left">
							{{item.content}}
						</view>
						<uni-icons type="phone" color="#999" size="21"></uni-icons>
					</view>
				</view>
			</view>
			
			<view class="question">
				<view class="top">
					<view class="title">
						<view class="line"></view>
						<text>猜你所问</text>
					</view>
					<!-- <view class="refresh" @click="refresh">
						<image src="@/static/image/refresh.png" mode=""></image>
						<text>换一批</text>
					</view> -->
				</view>

				<view class="questionList">
					<view class="one" v-for="(item,index) in questionList" :key="index"  @click="goTo(item)">
						<view class="left">
							{{index + 1}}: {{item.title}}
						</view>
						<uni-icons type="right" color="#999"></uni-icons>
					</view>
				</view>
			</view>
			
			
			
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
							<uni-icons type="minus" size="28" @click="minus(item)" :color="item.number == 0 ? '#999' : '#00a4ef'"></uni-icons>
							<view>{{item.number}}</view>
							<uni-icons type="plus" size="28" @click="plus(item)" :color="item.number == 9 ? '#999' : '#00a4ef'"></uni-icons>
						</view>
						<!-- <uni-number-box v-model="item.value" :min="0" :max="9"></uni-number-box> -->
					</view>
				</view>
				
				<textarea class="info" v-model.trim="others" placeholder="输入问题内容(必填)" />
				<button type="primary" @click="submit" class="submit">提交</button>
				
			</view>
		</view>
	</view>
</template>

<script>
	import Room from '@/components/room.vue'
	export default {
		data() {
			return {
				type: 0,
				questionList: [],
				needsList: [],
				others: '',
				phone: [],
			}
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
		components: {
			Room
		},
		onLoad() {},
		onShow() {
			this.getQuestion()
			this.getNeeds()
			if(uni.getStorageSync('roomInfo')) {
				console.log(uni.getStorageSync('roomInfo'))
				console.log(typeof uni.getStorageSync('roomInfo'))
				this.phone = uni.getStorageSync('roomInfo').complaintPhones
			}
		},
		mounted() {
			// this.phone = uni.getStorageSync('roomInfo').conplaintPhone ? uni.getStorageSync('roomInfo').content : ''
		},
		methods: {
			call(phone) {
				wx.makePhoneCall({
					phoneNumber: phone //仅为示例，并非真实的电话号码
				})
			},
			refresh() {

			},
			getQuestion() {
				this.$api.QandA({
					hotelBranchId: uni.getStorageSync('roomInfo').hotelBranchId,
				}).then(res => {
					console.log(res)
					this.questionList = res.data
				}).catch(() => {
					console.log('err')
				})
			},
			goTo(item) {
				console.log(item)
				uni.navigateTo({
					url: '/uselessPages/pages/answer?id=' + item.articleId,
				})
			},
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
				this.needsList.forEach((v, i) => {
					if(v.id == item.id) {
						v.number--
						this.$set(this.needsList, i, v)
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
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		position: relative;
		min-height: 100vh;
		background: #eee;
		

		.bg {
			width: 100%;
			height: 300rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
		}
	}
	
	.outer {
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 2;
		padding: 20rpx 30rpx;
		
		background: #eee;
	}

	.top {
		justify-content: space-between;
		display: flex;
		padding: 40rpx 0 20rpx;

		text {
			color: #fff;
		}
	}

	
	.question {
		background: #fff;
		border-radius: 8rpx;
		overflow: hidden;

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
					margin-left: 10rpx;
				}
			}

			.refresh {
				display: flex;
				align-items: center;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 6rpx;
				}

				text {
					color: #999;
					font-size: 24rpx;
				}
			}
		}

		.questionList {
			.one {
				display: flex;
				justify-content: space-between;
				padding: 0 20rpx;
				border-top: 1rpx solid #ebedf2;
				height: 80rpx;
				align-items: center;
				font-size: 26rpx;
			}
		}
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
					margin-left: 10rpx;
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
					
					text {
						padding: 0 4rpx;
					}
				}
			}
		}
	}
	
	.info {
		margin-top: 15px;
		background: #eee;
		margin: 6px;
		height: 80px;
		width: 100%;
	}
	
	.submit {
		margin: 10px 0 30px;
		background: $uni-defualt-text;
	}
</style>
