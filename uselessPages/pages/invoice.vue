<template>
	<view class="content">
		<Room></Room>
		<view class="invoiceType">
			<text>发票类型</text>
			<view class="types">
				<view :class="['one', type == item.id ? 'active' : '']" v-for="item in typeList" :key="item.id"
					@click="chooseType(item)">
					{{item.title}}
				</view>
			</view>
		</view>
		<view class="invoiceInfo">
			<view class="one" v-if="type == 1">
				<text>发票抬头</text>
				<input v-model="title" type="text" placeholder="请填写个人姓名 (必填)" />
			</view>
			<view class="one" v-if="type == 0">
				<text>公司名称</text>
				<input v-model="title1" type="text" placeholder="请填写公司名称 (必填)" />
				<button class="button" type="default" @click="chooseInvoiceTitle">选择发票抬头</button>
			</view>
			<view class="one" v-if="type == 0">
				<text>公司税号</text>
				<input v-model="taxNumber" type="text" placeholder="请填写公司税号 (必填)" />
			</view>
			<view class="one" v-if="type == 0">
				<text>公司地址</text>
				<input v-model="companyAddress" type="text" placeholder="请填写公司地址 (选填)" />
			</view>
			<view class="one" v-if="type == 0">
				<text>公司电话</text>
				<input v-model="telephone" type="text" placeholder="请填写公司电话 (选填)" />
			</view>
			<view class="one" v-if="type == 0">
				<text>开户银行</text>
				<input v-model="bankName" type="text" placeholder="请填写开户银行 (选填)" />
			</view>
			<view class="one" v-if="type == 0">
				<text>银行账号</text>
				<input v-model="bankAccount" type="text" placeholder="请填写银行账号 (选填)" />
			</view>
			<view class="one">
				<text>开票金额</text>
				<input v-model="price" type="text" placeholder="可不填,按实际消费开具" />
			</view>
		</view>

		<text class="getTypeTxt">接收方式</text>
		<view class="getType">
			<text>手机号</text>
			<input v-model="phone" type="text" placeholder="请填写手机号 (必填)" />
			<button class="button" type="default" @click="getPhone()">获取手机号</button>
		</view>

		<view class="more">
			<text>备注</text>
			<textarea class="info" v-model.trim="content" placeholder="输入问题内容(必填)" />
		</view>
		<button type="primary" @click="submit" class="submit">提交</button>
	</view>
</template>

<script>
	import Room from '@/components/room.vue'
	export default {
		data() {
			return {
				type: 0,
				typeList: [{
						title: '企业单位',
						id: 0
					},
					{
						title: '个人/非企业',
						id: 1
					}
				],
				phone: '',
				title: '',
				title1: '',
				taxNumber: '',
				companyAddress: '',
				telephone: '',
				bankName: '',
				bankAccount: '',
				price: '',
			}
		},
		components: {
			Room
		},
		onLoad() {},
		mounted() {},
		methods: {
			chooseType(item) {
				this.type = item.id
			},
			chooseInvoiceTitle() {
				let _this = this
				wx.chooseInvoiceTitle({
					success(res) {
						console.log(res)
						_this.title1 = res.title
						_this.taxNumber = res.taxNumber
					}
				})
			},
			getPhone() {

			}
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

	.invoiceType {
		padding: 16rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		border-radius: 8rpx;
		font-size: 24rpx;

		.types {
			display: flex;

			.one {
				padding: 6rpx 20rpx;
				background: #eee;
				color: #333;
				border-radius: 6rpx;

				&:first-child {
					margin-right: 10rpx;
				}

				&.active {
					background: $uni-color-primary;
					color: #fff;
				}
			}
		}
	}

	.invoiceInfo {
		background: #fff;
		border-radius: 8rpx;
		font-size: 24rpx;
		margin-top: 16rpx;

		.one {
			padding: 0 20rpx;
			height: 76rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1rpx solid #ebedf2;

			text {
				width: 96rpx;
				margin-right: 28rpx;
				flex-grow: 0;
				flex-shrink: 0;
			}

			input {
				flex: 1;
				padding-right: 12rpx;
			}
		}
	}

	.getTypeTxt {
		font-size: 28rpx;
		font-weight: bold;
		line-height: 50rpx;
	}

	.getType {
		background: #fff;
		border-radius: 8rpx;
		padding: 0 20rpx;
		height: 76rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #ebedf2;
		font-size: 24rpx;

		text {
			width: 96rpx;
			margin-right: 28rpx;
			flex-grow: 0;
			flex-shrink: 0;
		}

		input {
			flex: 1;
			padding-right: 12rpx;
		}
	}

	.more {
		margin-top: 16rpx;
		background: #fff;
		border-radius: 8rpx;
		padding: 0 20rpx 20rpx;
		font-size: 24rpx;

		text {
			line-height: 60rpx;
		}

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
