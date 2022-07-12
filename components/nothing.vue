<template>
	<div class="empty">
		<img v-if="!error" src="@/static/image/nothing.png" />
		<img v-else src="@/static/image/net_error.png" />
		<p class="title">{{word}}</p>
		<button v-if="error" round custom-class="refrsh-btn" @click="refresh">刷新</button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				word: ''
			}
		},
		props: {
			title: {
				type: String,
				default: '暂无数据'
			},
			error: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			error() {
				console.log(this.error)
				if (this.error) {
					this.word = '网络繁忙，请稍候再试'
				} else {
					this.word = this.title
				}
			},
		},
		onLoad(option) {

		},
		filters: {},
		mounted() {
			this.word = this.error ? '网络繁忙，请稍候再试' : this.title
		},
		methods: {
			refresh() {
				this.$emit('refresh')
			}
		}
	}
</script>

<style scoped lang="scss">
	.empty {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		img {
			width: 182rpx;
			height: 120rpx;
			margin: 0 auto 18rpx;
		}

		.title {
			font-size: 26rpx;
			color: #666;
			text-align: center;
		}
	}
	
	/deep/ .refrsh-btn {
		background-color: #00a4ef;
		width: 180rpx;
		height: 60rpx;
		color: #fff;
		margin-top: 30rpx;
	}
</style>
