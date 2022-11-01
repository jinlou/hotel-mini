<template>
	<view class="content">
		<Room></Room>
		<!-- <view class="scan" @click="scanCode">
			<image src="/static/logo.png" mode=""></image>
			<text>扫描设备二维码</text>
		</view>

		<view class="order-no">
			<text>订单号编号</text>
			<input v-model="orderNo" class="uni-input" type="number" placeholder="请填写订单号(非必填)" />
		</view>
		<view class="mark">
			<text>*</text>注：请先去订单列表复制订单号
		</view> -->
		<view class="type">
			<view class="txt">投诉类型</view>
			<view class="type-list">
				<view class="one" v-for="(item, index) in typeList" :key="index" @click="chooseType(item)"
					:class="[item.id == type ? 'active' : '']">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="imgs">
			<view class="txt">备注信息</view>
			<textarea class="info" v-model.trim="content" placeholder="输入问题内容" />
			<view class="txt">投诉图片 <text>最多上传四张(最多10M)</text></view>
			<view class="img-list">
				<view class="one" v-for="(item, index) in imgsList" :key="index" @click="chooseType(item)">
					<!-- <image :src="item" mode="aspectFill"></image> -->
					<view @click="chooseImage" class="bg"
						:style="{background: 'url('+item+') center/ 100% no-repeat border-box border-box'}"></view>
					<uni-icons @click="deleteOne(index)" class="delete" type="closeempty" color="#fff"></uni-icons>
				</view>
				<view v-if="imgsList.length < 4" class="upload">
					<!-- <image @click="chooseImage" src="/static/image/upload.png" mode=""  class="bg"></image> -->
					<view @click="chooseImage" class="bg"></view>
				</view>
			</view>
		</view>
		<button type="primary" @click="bathImage" class="submit">提交</button>
	</view>
</template>

<script>
	import {baseURL} from '@/api/baseURL.js'
	import Room from '@/components/room.vue'
	export default {
		data() {
			return {
				orderNo: '',
				type: '',
				typeList: [
					// {
					// 	text: '无法充电',
					// 	id: 1
					// },
					// {
					// 	text: '订单问题',
					// 	id: 2
					// },
					// {
					// 	text: '其它',
					// 	id: 3
					// },
				],
				imgsList: [],
				content: '',
			}
		},
		components: {
			Room
		},
		onLoad(options) {
			console.log(options)
		},
		mounted() {
			this.getComplainTypes()
		},
		methods: {
			scanCode() {
				uni.scanCode({
					scanType: ['qrCode'],
					success: res => {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					},
					fail: err => {
						console.log(err)
						uni.showToast({
							icon: 'none',
							title: '扫码失败'
						})
					}
				})
			},
			chooseType(item) {
				this.type = item.id
			},
			chooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: res => {
						console.log(res);
						console.log(JSON.stringify(res.tempFilePaths));
						res.tempFiles.forEach(v => {
							if(v.size < 10*1024*1024) {
								this.imgsList.push(v.path)
							} else {
								uni.showToast({
									icon: 'none',
									title: '已过滤掉大于10M的图片'
								})
							}
						})
					}
				});
			},
			deleteOne(i) {
				this.imgsList.splice(i, 1)
			},
			getComplainTypes() {
				this.$api.getComplainTypes({
					roomId: uni.getStorageSync('roomInfo').roomId
				}).then(res => {
					if (res.code == 0) {
						this.typeList = res.data.complainType
						this.type = this.typeList[0].id
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			bathImage() {
				// if (!this.content.trim()) {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '请描述问题'
				// 	})
				// 	return
				// }

				let _this = this,
					promiseArr = []
				for (let i = 0; i < this.imgsList.length; i++) {
					let promise = new Promise((resolve, reject) => {
						wx.uploadFile({
							url: baseURL + '/upload/file/image',
							filePath: _this.imgsList[i],
							name: 'image',
							success(res) {
								console.log(res)
								console.log(JSON.parse(res.data))
								console.log(JSON.parse(res.data).data.url)
								resolve(JSON.parse(res.data).data.url)
							},
							fail(err) {
								console.log(err)
								reject(err)
							}
						})
					})
					promiseArr.push(promise)
				}

				Promise.all(promiseArr).then(res => {
					console.log(res)
					_this.submit(res)
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			submit(images) {
				console.log(images)
				console.log(typeof images)
				this.$api.postComplain({
					hotelRoomId: uni.getStorageSync('roomInfo').roomId,
					contactNumber: uni.getStorageSync('userInfo').phone,
					content: this.content,
					type: this.type,
					images: images,
				}).then(res => {
					if (res.code == 0) {
						
						wx.requestSubscribeMessage({
							tmplIds: this.$serviceIDs,
							success(res) {
								console.log(res)
							},
							complete() {
								console.log('company')
								uni.showToast({
									icon: 'none',
									title: '服务已提交，请稍后…'
								})
								setTimeout(() =>uni.navigateBack(), 1500)
							}
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
		padding: 15px;
		font-size: 13px;
		background: #eee;
	}

	.scan {
		border: 1px solid $uni-defualt-text;
		border-radius: 6px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		// background: #55aaff;

		image {
			width: 24px;
			height: 24px;
		}

		text {
			color: $uni-defualt-text;
			margin-left: 20px;
			font-size: 14px;
		}
	}

	.order-no {
		display: flex;
		height: 40px;
		align-items: center;
		padding: 0 8px;
		margin-top: 15px;
		background: #fff;
		border-radius: 6px;

		text {
			flex-shrink: 0;
		}

		input {
			flex-grow: 1;
			padding: 0 15px;
		}
	}

	.mark {
		height: 28px;
		line-height: 28px;
		font-size: 12px;

		text {
			color: $uni-error-text;
		}
	}
	
	.txt {
		height: 60rpx;
		line-height: 60rpx;
		
		text {
			font-size: 22rpx;
			color: #999;
		}
	}

	.type {
		padding: 6px 8px 15px;
		background: #fff;
		border-radius: 6px;
		box-shadow: 0px 2px 3px 1px rgba(0,0,0,0.1);
		border-radius: 10rpx;

		.type-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.one {
				width: 47%;
				border: 1px solid $uni-defualt-text;
				color: $uni-defualt-text;
				height: 32px;
				line-height: 32px;
				text-align: center;
				margin-top: 10px;
				border-radius: 8rpx;
				border-radius: 10rpx;

				&.active {
					background: $uni-defualt-text;
					color: #fff;
				}
			}
		}

		
	}

	.imgs {
		margin-top: 16px;
		background: #fff;
		padding: 6px 6px 15px;
		box-shadow: 0px 2px 3px 1px rgba(0,0,0,0.1);
		border-radius: 10rpx;
		
		.info {
			border-radius: 10rpx;
			box-sizing: border-box;
			background: #eee;
			padding: 6px;
			height: 80px;
			width: calc(100% - 30rpx);
			margin: 0 auto 16rpx;
		}

		.img-list {
			display: flex;
			flex-wrap: wrap;
			margin-top: 10px;
			margin: 0 15rpx;

			.one {
				width: 23%;
				position: relative;
				margin-right: 2%;

				.bg {
					width: 100%;
					height: 0;
					padding-bottom: 100%;
				}

				.delete {
					position: absolute;
					right: 0;
					top: 0;
					background: rgba(0, 0, 0, 0.6)
				}
			}

			
		}

		.upload {
			width: 23%;

			.bg {
				width: 100%;
				height: 0;
				padding-bottom: 100%;
				background: url('/static/image/upload.png') no-repeat 100% 100%;
				background-size: 100% 100%;
			}
		}

	}

	.submit {
		position: fixed;
		bottom: 100rpx;
		width: calc(100% - 60rpx);
		background: $uni-color-primary;
	}
</style>
