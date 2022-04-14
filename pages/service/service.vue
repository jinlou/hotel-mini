<template>
	<view class="content">
		<view class="bg"></view>
		<view class="top">
			<view class="uni-padding-wrap">
				<view class="name">{{room.name}}</view>
				<view class="text">房间号</view>
			</view>
			<view class="minis">
				<view class="mini" v-for="(item, index) in minis" :key="index" @click="goTo(item)">
					<image :src="item.bg" mode=""></image>
					<view class="text">{{item.text}}</view>
					<view class="text-en">{{item.textEn}}</view>
				</view>
			</view>
			<view class="notice">
				<view class="left">
					<text class="note">公告</text>
					<text class="notice-detail ellipsis">{{notice}}</text>
				</view>
				<view class="detail" @click="showMore">
					<text>详情</text>
					<uni-icons type="right" size="14"></uni-icons>
				</view>
			</view>
			
			<view class="operates">
				<view class="operate" v-for="(item, index) in opearate" :key="index" @click="goToOwn(item)">
					<view class="">
						<view class="text">{{item.text}}</view>
						<view class="text-en">{{item.textEn}}</view>
					</view>
					<image :src="item.bg" mode=""></image>
				</view>
			</view>
			
			<view class="others">
				<view class="other" v-for="(item, index) in others" :key="index" @click="goToOwn(item)">
					<image :src="item.bg" mode=""></image>
					<view>{{item.text}}</view>
				</view>
			</view>
		</view>
		<uni-popup ref="notice" type="center">
			<view class="note-more">
				<text>{{notice}}</text>
				<button class="close" type="default" @click="close">关闭</button>
			</view>
		</uni-popup>
		<uni-popup ref="checkOut" type="dialog">
		    <uni-popup-dialog title="温馨提示" :content="checkOutMassage" :duration="2000" :before-close="true" @close="cancel" @confirm="checkOut"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				room: {
					name: '这是高大妞'
				},
				takeawayAll: 68,
				takeawayMount: 55,
				minis: [{
						text: '手机充电',
						textEn: 'MOBILE CHARGE',
						bg: require('@/static/logo.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '连接WIFI',
						textEn: 'NETWORKING',
						bg: require('@/static/logo.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '点外卖',
						textEn: 'ORDER TAKE OUT',
						bg: require('@/static/logo.png'),
						appID: '',
						defaultPage: ''
					},
				],
				notice: '通知里面说了什么我也不知道，反正就是很多很多很多很多待核对很多很多的文字就对了！！！',
				opearate: [
					{
						text: '联系前台',
						textEn: 'FRONT DESK',
						bg: require('@/static/logo.png'),
						appID: '',
						defaultPage: '/pages/index/contactRecept'
					},
					{
						text: '预约发票',
						textEn: 'WRITE AN INVOICE',
						bg: require('@/static/logo.png'),
						appID: '',
						defaultPage: '/uselessPages/pages/invoice'
					},
					{
						text: '睡眠助手',
						textEn: 'SLEEP HELPER',
						bg: require('@/static/logo.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '一键退房',
						textEn: 'CHECK OUT',
						bg: require('@/static/logo.png'),
						appID: '',
						defaultPage: 'checkOut'
					},
				],
				others: [
					{
						text: '酒店超市',
						bg: require('@/static/logo.png'),
						defaultPage: '/uselessPages/pages/market'
					},
					{
						text: '投诉建议',
						bg: require('@/static/logo.png'),
						defaultPage: '/uselessPages/pages/feedback'
					},
					{
						text: '在线续住',
						bg: require('@/static/logo.png'),
						defaultPage: '/uselessPages/pages/onlineContinuation'
					},
					{
						text: '客房送物',
						bg: require('@/static/logo.png'),
						defaultPage: '/uselessPages/pages/roomDelivery'
					},
					{
						text: '客房清扫',
						bg: require('@/static/logo.png'),
						defaultPage: '/uselessPages/pages/roomClean'
					},
					{
						text: '叫醒服务',
						bg: require('@/static/logo.png'),
						defaultPage: '/uselessPages/pages/wakeUp'
					},
					{
						text: '物品维修',
						bg: require('@/static/logo.png'),
						defaultPage: '/uselessPages/pages/maintenance'
					},
					{
						text: '好评有礼',
						bg: require('@/static/logo.png'),
						defaultPage: ''
					},
					{
						text: '自定义模块',
						bg: require('@/static/logo.png'),
						defaultPage: ''
					},
				],
				checkOutMassage: '您确定药现在退房吗？退房前请带好您的随身物品，如有房卡请到前台退还房卡，欢迎您下次入住本酒店，祝您路途愉快！'
			}
		},
		components: {},
		onLoad() {},
		methods: {
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
			goToOwn(item) {
				if(item.defaultPage == 'checkOut') {
					this.$refs.checkOut.open()
				} else {
					uni.navigateTo({
						url: item.defaultPage
					})
				}
			},
			goTo(item) {
				// if (to == 'meituan') {
				// 	uni.navigateToMiniProgram({
				// 		appId: 'wx2c348cf579062e56',
				// 		path: 'packages/restaurant/restaurant/restaurant?poi_id=1027434691792581&aas=1003&cat_id=0',
				// 		extraDta: {
				// 			'data1': 'test'
				// 		},
				// 		success(res) {
				// 			console.log('tiao')
				// 		}
				// 	})
				// }
				uni.navigateToMiniProgram({
					appId: item.appID,
					path: item.defaultPage,
					success(res) {
						console.log('tiao')
					}
				})
			},
			showMore() {
				this.$refs.notice.open('center')
			},
			close() {
				this.$refs.notice.close()
			},
			cancel() {
				this.$refs.checkOut.close()
			},
			checkOut() {
				// 确定退房
				uni.navigateTo({
					url: '/uselessPages/pages/result'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		background: #eee;
		min-height: 100vh;
	}

	.bg {
		position: absolute;
		width: 100%;
		height: 120px;
		left: 0;
		top: 0;
		background: #00a4ef;
		z-index: 0;
		border-bottom-left-radius: 40px;
		border-bottom-right-radius: 40px;
	}

	.top {
		position: absolute;
		top: 0;
		width: calc(100% - 24px);
	}


	.uni-padding-wrap {
		height: 90px;
		width: 100px;
		color: #fff;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		float: right;

		.name {
			font-size: 16px;
		}

		.text {
			font-size: 14px;
		}
	}

	.minis {
		display: flex;
		justify-content: space-between;
		height: 110px;
		color: #fff;
		width: 100%;
		margin-top: 12px;

		.mini {
			width: 31%;
			height: 100%;
			background: #fff;
			border-radius: 10px;
			text-align: center;
			padding-top: 15px;

			image {
				width: 40px;
				height: 40px;
				border-radius: 50%;
			}

			.text {
				font-size: 15px;
				color: #333;
				text-align: center;
				font-weight: bold;
				margin-bottom: 6px;
			}

			.text-en {
				font-size: 12px;
				color: #666;
				text-align: center;
				transform: scale(0.8);
			}
		}
	}

	.notice {
		display: flex;
		justify-content: space-between;
		margin: 10px 0;
		height: 40px;
		border-radius: 6px;
		background: #fff;
		align-items: center;
		padding: 0 10px;

		.left {
			width: 60%;
			display: flex;

			.note {
				width: 50px;
				margin-right: 8px;
				flex-shrink: 0;
				background: orange;
				border-radius: 10px;
				height: 20px;
				line-height: 20px;
				font-size: 14px;
				color: #fff;
				text-align: center;
			}

			.notice-detail {
				font-size: 13px;
				color: #333;
			}
		}

		.detail {
			font-size: 13px;
		}
	}

	.note-more {
		width: 70%;
		height: 250px;
		margin: 0 auto;
		background: #fff;
		border-radius: 10px;
		padding: 15px 15px 42px;
		position: relative;

		text {
			font-size: 14px;
		}

		.close {
			position: absolute;
			bottom: 10px;
			width: 64px;
			left: 50%;
			margin-left: -32px;
			background: #00a4ef;
			color: #fff;
			height: 32px;
			line-height: 32px;
			font-size: 14px;
		}
	}
	
	.operates {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		
		.operate {
			height: 60px;
			width: 48%;
			display: flex;
			background: #fff;
			justify-content: space-between;
			margin-bottom: 15px;
			border-radius: 10px;
		
			> view {
				margin-top: 10px;
			}
			
			image {
				height: 40px;
				width: 30px;
				margin-top: 20px;
			}
			
			.text {
				font-size: 15px;
				color: #333;
				text-align: center;
				font-weight: bold;
				margin-bottom: 6px;
				line-height: 24px;
			}
			
			.text-en {
				font-size: 12px;
				color: #666;
				text-align: center;
				transform: scale(0.8);
			}
		}
	}
	
	.others {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		color: #333;
		padding: 15px;
		background: #fff;
		align-items: center;
		
		.other {
			width: 25%;
			text-align: center;
			margin-bottom: 10px;
			
			image {
				width: 30px;
				height: 30px;
				border-radius: 50%;
			}
			
			view {
				line-height: 20px;
				font-size: 14px;
				text-align: center;
				margin-top: 4px;
			}
		}
	}
</style>
