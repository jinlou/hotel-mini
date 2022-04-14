<template>
	<view class="content">
		<view class="question">{{detail.question}}</view>
		<view class="date">{{detail.date}}</view>
		<view class="answer">{{detail.answer}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {
					question: '1、付完款设备不正常启动怎么办？',
					date: '2020-01-01',
					id: 2,
					answer: '你问我我怎么知道，自己百度去！你问我我怎么知道，自己百度去！你问我我怎么知道，自己百度去！你问我我怎么知道，自己百度去！你问我我怎么知道，自己百度去！'
				},
			}
		},
		components: {},
		onLoad(options) {
			console.log(options)
		},
		methods: {
			getDetail() {
				
			},
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
