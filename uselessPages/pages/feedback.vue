<template>
	<view class="content">
		<view class="scan" @click="scanCode">
			<image src="/static/logo.png" mode=""></image>
			<text>扫描设备二维码</text>
		</view>

		<view class="order-no">
			<text>订单号编号</text>
			<input v-model="orderNo" class="uni-input" type="number" placeholder="请填写订单号(非必填)" />
		</view>
		<view class="mark">
			<text>*</text>注：请先去订单列表复制订单号
		</view>
		<view class="type">
			<view>请选择问题类型</view>
			<view class="type-list">
				<view class="one" v-for="(item, index) in typeList" :key="index" @click="chooseType(item)"
					:class="[item.id == type ? 'active' : '']">
					{{item.text}}
				</view>
			</view>
			<textarea class="info" v-model.trim="content" placeholder="输入问题内容(必填)" />
		</view>
		<view class="imgs">
			<view>上传照片（帮助我们快速为您解决问题）</view>
			<view class="img-list">
				<view class="one" v-for="(item, index) in imgsList" :key="index" @click="chooseType(item)">
					<!-- <image :src="item" mode="aspectFill"></image> -->
					<view @click="chooseImage" class="bg" :style="{background: 'url('+item+') center/ 100% no-repeat border-box border-box'}"></view>
					<uni-icons @click="deleteOne(index)" class="delete" type="closeempty" color="#fff"></uni-icons>
				</view>
				<view v-if="imgsList.length < 4" class="upload">
					<!-- <image @click="chooseImage" src="/static/logo.png" size="24" mode=""></image> -->
					<view @click="chooseImage" class="bg"></view>
				</view>
			</view>
		</view>
		<view class="mark">
			<text>*</text>照片大小不能超过1M（最多四张）
		</view>
		<button type="primary" @click="submit" class="submit">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderNo: '',
				type: '',
				typeList: [{
						text: '无法充电',
						id: 1
					},
					{
						text: '订单问题',
						id: 2
					},
					{
						text: '其它',
						id: 3
					},
				],
				imgsList: [],
				content: '',
			}
		},
		components: {},
		onLoad(options) {
			console.log(options)
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
					success: res=> {
						console.log(res.tempFilePaths);
						console.log(JSON.stringify(res.tempFilePaths));
						this.imgsList.push(...res.tempFilePaths)
					}
				});
			},
			deleteOne(i) {
				this.imgsList.splice(i, 1)
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

	.type {
		padding: 6px 8px;
		background: #fff;
		border-radius: 6px;

		.type-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.one {
				width: 47%;
				border: 1px solid $uni-defualt-text;
				color: $uni-defualt-text;
				height: 28px;
				line-height: 28px;
				text-align: center;
				margin-top: 10px;

				&.active {
					background: $uni-defualt-text;
					color: #fff;
				}
			}
		}

		.info {
			margin-top: 15px;
			border-radius: 10rpx;
			box-sizing: border-box;
			background: #eee;
			padding: 6px;
			height: 80px;
			width: 100%;
		}
	}

	.imgs {
		margin-top: 16px;
		background: #fff;
		border-radius: 6px;
		padding: 6px;

		.img-list {
			display: flex;
			flex-wrap: wrap;
			margin-top: 10px;

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
					background: rgba(0,0,0,0.6)
				}
			}
			
			
		}

		.upload {
			width: 23%;
			
			.bg {
				width: 100%;
				height: 0;
				padding-bottom: 100%;
				background: url('/static/logo.png') no-repeat 100% 100%;
				background-size: 100% 100%;
			}
		}

	}
	
	.submit {
		margin: 10px 0 30px;
		background: $uni-color-primary;
	}
</style>
