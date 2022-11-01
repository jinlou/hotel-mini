<template>
	<view class="content">
		<view class="bg"></view>
		<view class="top">
			<view class="info">
				<view class="branchInfo uni-padding-wrap">
					<view class="name">{{roomInfo.hotelBranch.name || '客房管家'}}</view>
					<view class="text">欢迎回家，愿您有个美好的入住体验！</view>
				</view>
				<view class="uni-padding-wrap">
					<view class="name">{{roomInfo.roomCode}}</view>
					<view class="text">房间</view>
				</view>
			</view>
			<view class="minis">
				<view class="mini" v-for="(item, index) in minis" :key="index" @click="goToOwn(item)">
					<image :src="item.bg" mode=""></image>
					<view class="text">{{item.text}}</view>
					<view class="text-en">{{item.textEn}}</view>
				</view>
			</view>
			<view class="notice">
				<view class="left">
					<text class="note">公告</text>
					<text class="notice-detail ellipsis">{{notice.content}}</text>
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
			<!-- <view class="other2">
				<view class="title">
					<view class="left">
						<text>出行服务</text>
						<image src="/static/image/index/text_line.png" mode=""></image>
					</view>
					<text class="right">TRAVEL SERVICE</text>
				</view>
				<view class="some">
					<view class="left">
						<view class="txt">打车</view>
						<view class="title1">低至3折起</view>
						<image src="/static/image/index/texi.png" mode=""></image>
					</view>
					<view class="right">
						<view class="someOne" v-for="(item, index) in minis2" :key="index" @click="goTo(item)">
							<view class="txt">{{item.text}}</view>
							<view class="title1">{{item.title}}</view>
							<image :src="item.bg" mode=""></image>
						</view>
					</view>
				</view>
				<view class="minis1">
					<view class="mini" v-for="(item, index) in minis1" :key="index" @click="goTo(item)">
						<view class="out">
							<image :src="item.bg" mode=""></image>
						</view>
						<view>{{item.text}}</view>
					</view>
				</view>
			</view> -->
			<view style="margin: 15px 0;">
				<ad unit-id="adunit-44ae282c4fd0fff0" ad-type="video" ad-theme="white"></ad>
			</view>
		</view>
		
		
		<uni-popup ref="notice" type="center">
			<view class="note-more">
				<text>{{notice.content}}</text>
				<button class="close" type="default" @click="close">关闭</button>
			</view>
		</uni-popup>
		<uni-popup ref="checkOut" type="dialog">
			<uni-popup-dialog title="温馨提示" :content="checkOutMassage" :duration="2000" :before-close="true"
				@close="cancel" @confirm="checkOut"></uni-popup-dialog>
		</uni-popup>
		<Auth ref="auth"></Auth>
		<InnerTab routerAt="service"></InnerTab>
	</view>
</template>

<script>
	import Auth from '@/components/authNew.vue'
	import InnerTab from '@/components/innerTab.vue'
	import {
		baseURL
	} from 'api/axios'
	export default {
		data() {
			return {
				roomInfo: {
					hotelBranch: {}
				},
				takeawayAll: 68,
				takeawayMount: 55,
				minis: [
					{
						text: '手机充电',
						textEn: 'MOBILE CHARGE',
						bg: require('@/static/image/service_charge.png'),
						appID: '',
						defaultPage: '/pages/service/charge'
					},
					{
						text: '连接WIFI',
						textEn: 'NETWORKING',
						bg: require('@/static/image/service_wifi.png'),
						appID: '',
						defaultPage: '/uselessPages/pages/wifi'
					},
					{
						text: '小说阅读',
						textEn: 'ORDER TAKE OUT',
						bg: require('@/static/image/story.png'),
						appID: '',
						defaultPage: '/pages/service/novel'
					},
				],
				minisTags: [
					{
						text: '酒店超市',
						textEn: 'MARKET',
						bg: require('@/static/image/service_gw.png'),
						appID: '',
						defaultPage: '/pages/service/market'
					},
					{
						text: '连接WIFI',
						textEn: 'NETWORKING',
						bg: require('@/static/image/service_wifi.png'),
						appID: '',
						defaultPage: '/uselessPages/pages/wifi'
					},
					{
						text: '小说阅读',
						textEn: 'ORDER TAKE OUT',
						bg: require('@/static/image/story.png'),
						appID: '',
						defaultPage: '/pages/service/novel'
					},
				],
				notice: {
					title: '',
					content: '暂无公告！'
				},
				opearate: [
					{
						text: '联系前台',
						textEn: '一键呼叫',
						bg: require('@/static/image/service_qt.png'),
						appID: '',
						defaultPage: '/pages/index/contactRecept'
					},{
						text: '客房送物',
						textEn: '即可送达',
						bg: require('@/static/image/service_sw.png'),
						appID: '',
						defaultPage: '/uselessPages/pages/roomDelivery'
					},
					{
						text: '预约发票',
						textEn: '无需等待',
						bg: require('@/static/image/service_fp.png'),
						appID: '',
						defaultPage: '/pages/service/invoice'
					},
					{
						text: '酒店超市',
						textEn: '方便快捷',
						bg: require('@/static/image/service_gw.png'),
						appID: '',
						defaultPage: '/pages/service/market'
					},
				],
				others: [
					{
						text: '投诉建议',
						bg: require('@/static/image/feedback.png'),
						defaultPage: '/uselessPages/pages/feedback'
					},
					{
						text: '在线续住',
						bg: require('@/static/image/hotel_add.png'),
						defaultPage: '/uselessPages/pages/onlineContinuation'
					},
					{
						text: '好评有礼',
						bg: require('@/static/image/service_hp.png'),
						defaultPage: '/pages/service/serviceHp'
					},
					// {
					// 	text: '吃喝玩乐',
					// 	bg: require('@/static/image/others.png'),
					// 	defaultPage: '',
					// 	appID: 'wx734c1ad7b3562129'
					// },
					// {
					// 	text: '客房送物',
					// 	bg: require('@/static/logo.png'),
					// 	defaultPage: '/uselessPages/pages/roomDelivery'
					// },
					// {
					// 	text: '客房清扫',
					// 	bg: require('@/static/logo.png'),
					// 	defaultPage: '/uselessPages/pages/roomClean'
					// },
					// {
					// 	text: '叫醒服务',
					// 	bg: require('@/static/logo.png'),
					// 	defaultPage: '/uselessPages/pages/wakeUp'
					// },
					// {
					// 	text: '物品维修',
					// 	bg: require('@/static/logo.png'),
					// 	defaultPage: '/uselessPages/pages/maintenance'
					// },
					
					// {
					// 	text: '一键退房',
					// 	bg: require('@/static/logo.png'),
					// 	defaultPage: 'checkOut'
					// },
					// {
					// 	text: '自定义模块',
					// 	bg: require('@/static/logo.png'),
					// 	defaultPage: ''
					// },
				],
				minis1: [
					{
						text: '景区门票',
						bg: require('@/static/image/index/ticket.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '跟团游',
						bg: require('@/static/image/index/trip.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '附近公交',
						bg: require('@/static/image/index/bus.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '地铁线路',
						bg: require('@/static/image/index/subway.png'),
						appID: '',
						defaultPage: ''
					},
				],
				minis2: [
					{
						text: '特价机票',
						title: '全网最低价',
						bg: require('@/static/image/index/plane.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '汽车票',
						title: '点击查看详情',
						bg: require('@/static/image/index/automobile.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '火车票',
						title: '赠80元抢票特权',
						bg: require('@/static/image/index/train.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '租车',
						title: '点击查看详情',
						bg: require('@/static/image/index/car.png'),
						appID: '',
						defaultPage: ''
					},
				],
				checkOutMassage: '您确定药现在退房吗？退房前请带好您的随身物品，如有房卡请到前台退还房卡，欢迎您下次入住本酒店，祝您路途愉快！'
			}
		},
		components: {
			Auth,
			InnerTab
		},
		onLoad(options) {
			console.log(options)
			let code = options.code
			let query = options
			if(!code) {
				console.log(options)
				if(query && query.q) {
					console.log(query.q)
					console.log(decodeURIComponent(query.q))
					const q = decodeURIComponent(query.q).split('/') // 获取到二维码原始链接内容
					console.log(q)
					if(q) {
						code = q[q.length -1]
					} 
				} else {
					const roomInfo = uni.getStorageSync('roomInfo') || {}
					code = roomInfo.deviceCode
				}
			}
			if(code) {
				this.getHotelRoomID(code)
			} else {
				uni.showToast({
					title: '未检测到设备码',
					icon: 'none'
				})
				setTimeout(()=> {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}, 1500)
			}
			
		},
		onShareAppMessage(res) {
			return {
				title: '小智客房',
				path: `/pages/index/index`
			}
		},
		methods: {
			getHotelRoomID(roomId) {
				this.$api.getHotelRoomID({
					roomId
				}).then(res => {
					console.log(res)
					if(res.code == 0) {
						this.roomInfo = res.data
						uni.setStorageSync('roomInfo', res.data)
						console.log('roomInfo:', res.data)
						this.notices()
						if(this.roomInfo.deviceInfo.deviceType == 'tags') {
							this.minis = this.minisTags
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg || '网络错误'
						})
						uni.setStorageSync('roomInfo', null)
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/index/index'
							})
						}, 1500)
					}
					
				}).catch(e => {
					console.log(e)
					uni.showToast({
						icon: 'none',
						title: e.msg
					})
				})
			},
			notices() {
				console.log(uni.getStorageSync('roomInfo') && uni.getStorageSync('roomInfo').hotelBranchId)
				if(uni.getStorageSync('roomInfo') && uni.getStorageSync('roomInfo').hotelBranchId){
					this.$api.answernotices({
						hotelBranchId: uni.getStorageSync('roomInfo').hotelBranchId
					}).then(res => {
						console.log(res)
						if(res.data && res.data.length) {
							this.getNoticesDetail(res.data[0].articleId)
						}
					})
				} else {
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			},
			getNoticesDetail(articleId) {
				this.$api.noticesDetail({
					articleId
				}).then(res => {
					this.notice = res.data
				})
			},
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
				let token = uni.getStorageSync('token')
				if(!token) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else {
					if (item.defaultPage == 'checkOut') {
						this.$refs.checkOut.open()
					} else if(!item.defaultPage) {
						uni.navigateToMiniProgram({
							appId: item.appID,
							path: item.defaultPage,
							success(res) {
								console.log('tiao')
							}
						})
					} else {
						uni.navigateTo({
							url: item.defaultPage
						})
					}
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
		// border-bottom-left-radius: 40px;
		// border-bottom-right-radius: 40px;
	}

	.top {
		position: absolute;
		top: 0;
		width: calc(100% - 24px);
		z-index: 2;
		
		.info {
			height: 60px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.branchInfo {
				flex: 1;
				align-items: flex-start;
				
				.name {
					font-size: 20px;
					font-weight: 600;
				}
				
				.text {
					font-size: 13px;
				}
			}
			
			.uni-padding-wrap {
				height: 100%;
				width: 100px;
				color: #fff;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
			
				.name {
					font-size: 18px;
					font-weight: 600;
				}
			
				.text {
					font-size: 12px;
				}
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
				margin-bottom: 20rpx;
				border-radius: 10px;
		
				>view {
					margin-top: 10px;
					margin-left: 15px;
				}
		
				image {
					height: 30px;
					width: 30px;
					margin-top: 20px;
					margin-right: 20px;
				}
		
				.text {
					font-size: 15px;
					color: #333;
					font-weight: bold;
					margin-bottom: 6px;
					line-height: 24px;
					padding-left: 20rpx;
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
			// justify-content: space-between;
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
					// border-radius: 50%;
				}
		
				view {
					line-height: 20px;
					font-size: 14px;
					text-align: center;
					margin-top: 4px;
				}
			}
		}
	}

	
	
	.other2 {
		width: 100%;
		padding: 20rpx;
		box-shadow: 0px 2px 3px 1px rgba(0,0,0,0.1000);
		border-radius: 10rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		background: #fff;
		
		.title {
			display: flex;
			align-items: flex-end;
			padding: 0 10rpx;
			height: 40rpx;
			
			.left {
				position: relative;
				font-size: 32rpx;
				font-weight: 600;
				height: 40rpx;
				width: 130rpx;
				
				text {
					position: absolute;
					z-index: 3;
				}
				
				image {
					position: absolute;
					width: 124rpx;
					height: 12rpx;
					right: 0;
					bottom: 0;
					z-index: 1;
				}
			}
			
			.right {
				color: rgb(157,169,189);
				font-size: 24rpx;
			}
			
		}
		
		.some {
			display: flex;
			justify-content: space-between;
			margin-top: 16rpx;
			
			.left {
				width: 30%;
				background: #e8e8e8;
				border-radius: 8rpx;
				position: relative;
				padding: 20rpx;
				flex-grow: 0;
				flex-shrink: 0;
				margin-right: 2%;
				
				view {
					&.txt {
						font-size: 28rpx;
						font-weight: bold;
						color: #000000;
					}
					
					&.title1 {
						font-size: 18rpx;
						color: #333;
					}
				}
				
				image {
					width: 56rpx;
					height: 56rpx;
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}
			
			.right {
				display: flex;
				flex-wrap: wrap;
				
				.someOne {
					width: 48%;
					background: #e8e8e8;
					border-radius: 8rpx;
					position: relative;
					padding: 20rpx;
					
					&:nth-child(2n + 1) {
						margin: 0 2% 0 0;
					}
					
					&:nth-child(1),&:nth-child(2) {
						margin-bottom: 20rpx;
					}
					
					view {
						&.txt {
							font-size: 28rpx;
							font-weight: bold;
							color: #000000;
						}
						
						&.title1 {
							font-size: 18rpx;
							color: #333;
						}
					}
					
					image {
						width: 56rpx;
						height: 56rpx;
						position: absolute;
						right: 0;
						bottom: 0;
					}
				}
			}
		}
	}
	
	.minis1 {
		display: flex;
		justify-content: space-between;
		height: 80px;
		color: #333;
		width: 100%;
		margin-top: 12px;
	
		.mini {
			flex: 1;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
	
			.out {
				
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #fff;
	
				image {
					// width: 50rpx;
					width: 64rpx;
					height: 64rpx;
				}
			}
	
			view {
				line-height: 20px;
				font-size: 14px;
				text-align: center;
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
		width: 600rpx;
		height: 220px;
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
</style>
