<template>
	<!-- <view class="content" style="background-image: url('/static/image/logo.png')"> -->
	<view class="content">
		<image class="bg" src="/static/image/logo.png" mode=""></image>
		<view class="outer">
			<view class="top">
				<text>前台电话</text>
				<view class="phone">
					<uni-icons type="phone"></uni-icons>
					<text @click="call">400-6885-029</text>
				</view>
			</view>
			<Room></Room>
			<view class="question">
				<view class="top">
					<view class="title">
						<view class="line"></view>
						<text>猜你所问</text>
					</view>
					<view class="refresh" @click="refresh">
						<image src="@/static/image/refresh.png" mode=""></image>
						<text>换一批</text>
					</view>
				</view>

				<view class="questionList">
					<view class="one" v-for="(item,index) in questionList" :key="index">
						<view class="left">
							{{index + 1}}: {{item.question}}
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
							<uni-icons type="minus" size="20" @click="minus(item)" :color="item.value == 0 ? '#999' : '#00a4ef'"></uni-icons>
							<text>{{item.value}}</text>
							<uni-icons type="plus" size="20" @click="plus(item)" :color="item.value == 9 ? '#999' : '#00a4ef'"></uni-icons>
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
				others: ''
			}
		},
		components: {
			Room
		},
		onLoad() {},
		mounted() {
			this.getQuestion()
			this.getNeeds()
		},
		methods: {
			call() {
				wx.makePhoneCall({
					phoneNumber: '4006885029' //仅为示例，并非真实的电话号码
				})
			},
			refresh() {

			},
			getQuestion() {
				this.questionList = [{
						id: 1,
						question: '酒店有免费停车场吗？'
					},
					{
						id: 2,
						question: '酒店是否有餐厅？'
					},
					{
						id: 3,
						question: '附近有什么购物中心？'
					},
					{
						id: 4,
						question: '酒店早餐是什么类型？'
					},
					{
						id: 5,
						question: '早餐几点供应？'
					},
					{
						id: 6,
						question: '酒店附近有什么景点？'
					}
				]
			},
			getNeeds() {
				this.needsList = [
					{
						id: 1,
						name: '被子'
					},
					{
						id: 2,
						name: '枕头'
					},
					{
						id: 3,
						name: '拖鞋'
					},
					{
						id: 4,
						name: '卷纸'
					},
					{
						id: 5,
						name: '洗发水'
					},
					{
						id: 6,
						name: '牙具'
					},
					{
						id: 7,
						name: '香皂'
					},
					{
						id: 8,
						name: '毛巾'
					},
					{
						id: 9,
						name: '矿泉水'
					},
					{
						id: 10,
						name: '电吹风'
					},
					{
						id: 11,
						name: '漱口水'
					},
					{
						id: 12,
						name: '梳子'
					},
				]
				
				this.needsList.forEach(v => {
					v.value = 0
				})
			},
			minus(item) {
				if(!item.value) return
				this.needsList.forEach(v => {
					if(v.id == item.id) {
						v.value--
					}
				})
			},
			plus(item) {
				if(item.value == 9) return
				this.needsList.forEach((v, i) => {
					if(v.id == item.id) {
						v.value++
						
						this.$set(this.needsList, i, v)
					}
				})
				console.log(this.needsList)
				this.needsList
			}
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
		padding: 0 30rpx;
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
		padding: 6px;
		height: 80px;
		width: 100%;
	}
	
	.submit {
		margin: 10px 0 30px;
		background: $uni-defualt-text;
	}
</style>
