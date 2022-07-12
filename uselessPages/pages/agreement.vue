<template>
	<view class="topContent">
		<view class="contentTxt" v-html="content">

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: ``,
			}
		},
		onLoad() {
			this.userAgreement()
		},
		methods: {
			userAgreement() {
				this.$api.userAgreement().then(res => {
					console.log('getAgreementList', res);
					if(res.data) {
						this.content = res.data.content || '暂无消息'
					} else {
						this.content = '暂无消息'
					}
					console.log(this.content);
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.topContent {
		background-color: #fff;
		padding-top: 20rpx;

		.serviceTop {
			display: flex;
			justify-content: center;

			span {
				font-size: 36rpx;
			}
		}

	}
</style>
<style>
	.contentTxt p {
		margin-bottom: 10rpx;
		font-size: 32rpx;
	}
</style>
