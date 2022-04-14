<template>
	<view class="content">
		<view class="lists">
			<view class="wallet-list" v-for="(item, index) in lists" :key="index" @click="goTo(item)">
				<view class="one">
					<view class="left">
						<text class="question">{{item.id}}{{item.question}}</text>
						<text class="date">日期：{{item.date}}</text>
					</view>
					<uni-icons class="right" type="right" size="14"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lists: [
					{
						question: '、断电后，回来还能继续充电吗？',
						date: '2020-01-01',
						id: 1,
					},
					{
						question: '、付完款设备不正常启动怎么办？',
						date: '2020-01-01',
						id: 2,
					},
					{
						question: '、设备计费标准是什么？',
						date: '2020-01-01',
						id: 3,
					},
				],
			}
		},
		components: {},
		onLoad() {},
		methods: {
			goTo(item) {
				console.log(item)
				uni.navigateTo({
					url: '/pages/mine/answer?id=' + item.id,
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
	}

	.top {
		height: 100px;
		font-size: 14px;
		color: #fff;
		padding: 10px 15px 0;

		.balance {
			font-size: 28px;
			line-height: 42px;
		}
	}

	.lists {
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		background: #fff;
		height: calc(100vh - 100px);

		.wallet-list {
			.one {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 50px;
				padding: 0 15px 0 10px;

				.left {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					
					.question {
						color:#333;
						font-size: 14px;
						line-height: 21px;
					}
					
					.date {
						color: #999;
						font-size: 12px;
					}
					
				}

				.right {
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid #ebedf2;

					text {
						font-size: 14px;
					}
				}
			}
		}
	}
</style>
