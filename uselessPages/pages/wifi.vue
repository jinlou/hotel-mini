<template>
	<view class="page">
		<image src="@/static/image/wifi_bg.jpg" mode="" class="bg"></image>
		<view class="chargeList">
			<!-- <Button @click="startSearch()">搜索</Button> -->
			<!-- <uni-search-bar @confirm="search" :focus="true" v-model="searchValue"
				@cancel="cancel" @clear="clear">
			</uni-search-bar> -->
			<scroll-view class="device-list" scroll-y style="height: 100%;">
				<view class="item" v-for="(item, index) in wifiList" :key="index">
					<view class="list">
						<view class="out">
							<view class="name" @click="copy(item)">{{ item.name }}</view>
							<view class="password" @click="copy(item)">		
								<text>{{ item.password }} 	</text>
								<image src="@/static/image/copy.png" mode=""></image>
							</view>
						</view>
						<view class="btn" @click="connectWifi(item)">一键连接</view>
					</view>
					<!-- <view class="list">
						<text>{{ item.SSID }}</text>
						<span class="wifi-icon">
							<span class="wifi-1"></span>
							<span :class="['wifi-2', item.strength < 2 ? 'off' : '']"></span>
							<span :class="['wifi-3 ',item.strength < 3 ? 'off' : '']"></span>
							<span :class="['wifi-4 ',item.strength < 4 ? 'off' : '']"></span>
							<span class="lock" v-if="item.secure"></span>
						</span>
					</view> -->
				</view>
			</scroll-view>
			<view class="nothing" v-if="!wifiList.length">
				<Nothing></Nothing>
			</view>
		</view>
	</view>
</template>

<script>
	import Nothing from '@/components/nothing'
	export default {
		data() {
			return {
				searchValue: '',
				wifiList: [],
			}
		},
		onLoad() {

		},
		components: {
			Nothing
		},
		onShow() {
			// console.log(uni.getStorageSync('roomInfo'))
			// console.log(typeof uni.getStorageSync('roomInfo'))
			let roomInfo = uni.getStorageSync('roomInfo')
			if(roomInfo.wifiName && roomInfo.wifiPassword) {
				this.wifiList = [
					{
						name: roomInfo.wifiName,
						password: roomInfo.wifiPassword
					}
				]
			} else {
				this.wifiList = roomInfo.hotelWifi
			}
			
		},
		mounted() {
			// this.wifiList = uni.getStorageSync('roomInfo').hotelWifi
		},
		onUnload() {
			// this.stopSearch();
		},
		methods: {
			copy(data) {
				uni.setClipboardData({
					data: data.password,
					success: function() {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				})
			},
			connectWifi: function(item) {
				uni.showLoading({
					title: '连接中……'
				})
				var that = this;
				//检测手机型号
				wx.getSystemInfo({
					success: function(res) {
						var system = '';
						if (res.platform == 'android') system = parseInt(res.system.substr(8));
						if (res.platform == 'ios') system = parseInt(res.system.substr(4));
						if (res.platform == 'android' && system < 6) {
							wx.showToast({
								title: '手机版本不支持'
							});
							uni.hideLoading()
							return;
						}
						if (res.platform == 'ios' && system < 11.2) {
							wx.showToast({
								title: '手机版本不支持'
							});
							uni.hideLoading()
							return;
						}
						//2.初始化 Wi-Fi 模块
						that.startWifi(item);
					},
					fail: function(err) {
						
					},
				});
			},
			//初始化 Wi-Fi 模块
			startWifi: function(item) {
				var that = this;
				wx.startWifi({
					success: function() {
						//请求成功连接Wifi
						that.Connected(item);
					},
					fail: function(res) {
						wx.showToast({
							title: '连接失败',
							icon: 'none'
						});
						uni.hideLoading()
					}
				});
			},
			Connected: function(item) {
				var that = this;
				wx.connectWifi({
					SSID: item.name,
					password: item.password,
					success: function(res) {
						wx.showToast({
							title: 'wifi连接成功'
						});
						uni.hideLoading()
						_this.$api.connectWifi({
							hotelBranchId: uni.getStorageSync('roomInfo').hotelBranchId,
							name: item.name
						}).then(res => {
							console.log(res)
						})
					},
					fail: function(res) {
						wx.showToast({
							title: 'wifi连接失败'
						});
						uni.hideLoading()
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		position: relative;
		background: #bcbcbc;
		min-height: 100vh;

		.bg {
			width: 100%;
			height: 220rpx;
		}

		.chargeList {
			position: fixed;
			height: calc(100% - 156rpx);
			width: 100%;
			top: 156rpx;
			z-index: 2;
			border-top-left-radius: 60rpx;
			border-top-right-radius: 60rpx;
			background: #fff;
			padding: 40rpx 30rpx;
		}

	}

	.device-list {
		height: 300rpx;
		text-align: center;
	}

	.item {
		width: 100%;
		margin-bottom: 10px;
	}

	.list {
		width: 100%;
		text-align: left;
		font-size: 30rpx;
		border-bottom: 1px solid #ebedf2;
		
		display:flex;

		.name {
			font-size: 14px;
		}
		
		.password {
			font-size:12px;
			height: 20px;
			display: flex;
			align-items: center;
			
			text {
				font-size: 12px;
			}
			
			image {
				width:10px;
				height: 10px;
				margin-left: 6px;
			}
		}
		
		.btns {
			display: flex;
			border-top: 1px solid #ebedf2;
		}
		
		.copy {
			margin-left: 8px;
		}
		
	}
	
	.out {
		display:flex;
	    flex-direction: column;
		justify-content: space-between;
		padding-right: 10px;
		flex: 1;
		
		.ellipsis {
			padding-right: 10px;
			width: 140px;
		}
		
		
	}
	
	.btn {
		height: 60rpx;
		padding: 0 30rpx;
		line-height: 60rpx;
		font-size: 24rpx;
		color: #fff;
		background: #44A2FF;
		border-radius: 40rpx;
	}

	.list text {
		display: inline-block;
		max-width: 80%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.strength-ready {
		color: #26a69a;
	}

	.strength-no {
		color: #37474f;
	}

	.wifi-icon {
		width: 20px;
		height: 20px;
		display: inline-block;
		position: relative;
		overflow: hidden;
		margin: 0 10px;
		float: right;
	}

	.wifi-icon span {
		display: block;
		position: absolute;
		border-radius: 50%;
	}

	.wifi-icon .wifi-1 {
		width: 4px;
		height: 4px;
		left: 8px;
		bottom: 3px;
		background: currentcolor;
	}

	.wifi-icon .wifi-2,
	.wifi-icon .wifi-3,
	.wifi-icon .wifi-4 {
		border: 2px solid;
		border-color: currentcolor transparent transparent;
	}

	.wifi-icon .wifi-2 {
		width: 12px;
		height: 12px;
		left: 2px;
		bottom: -4px;
	}

	.wifi-icon .wifi-3 {
		width: 20px;
		height: 20px;
		left: -2px;
		bottom: -8px;
	}

	.wifi-icon .wifi-4 {
		width: 28px;
		height: 28px;
		left: -6px;
		bottom: -12px;
	}

	.wifi-icon span:after {
		content: "";
		display: block;
		position: absolute;
	}

	.wifi-icon .lock {
		width: 6px;
		height: 5px;
		background: currentcolor;
		display: block;
		right: 1px;
		bottom: 2px;
		border-radius: 0;
	}

	.wifi-icon .lock:after {
		width: 4px;
		height: 3px;
		border: 1px solid;
		border-radius: 100px 100px 0 0;
		border-bottom: none;
		left: 0px;
		bottom: 100%;
	}

	.off {
		border-color: #b0bec5 transparent transparent !important;
	}
</style>
