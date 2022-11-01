<template>
	<view class="content">
		<view class="question">{{detail.title}}</view>
		<view class="date">{{detail.addTime}}</view>
		<view class="answer">{{detail.content}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {
					title: '',
					addTime: '',
					content: ''
				},
			}
		},
		components: {},
		onLoad(options) {
			console.log(options)
			this.answer(options.id)
		},
		methods: {
			answer(questionId) {
				this.$api.answer({
					questionId
				}).then(res => {
					if (res.code == 0) {
						this.detail = res.data
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
		padding: 15px;
	}

	.question {
		font-size: 15px;
		color: #333;
		font-weight: bold;
	}
	
	.date {
		font-size: 13px;
		color: #999;
		margin: 10px 0 12px;
	}
	
	.answer {
		font-size: 13px;
		color: #666;
	    word-break: break-all;
	}
</style>
