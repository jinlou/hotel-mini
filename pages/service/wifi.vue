<template>
	<view class="content">
		<uni-search-bar @confirm="search" :focus="true" v-model="searchValue"
			@cancel="cancel" @clear="clear">
		</uni-search-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchValue: ''
			}
		},
		onLoad() {
		},
		mounted() {
			
		},
		methods: {
			search(res) {
				console.log(res)
				uni.showToast({
					title: '搜索：' + res.value,
					icon: 'none'
				})
			},
			clear(res) {
				console.log(res)
				uni.showToast({
					title: 'clear事件，清除值为：' + res.value,
					icon: 'none'
				})
				this.searchValue = ''
			},
			cancel(res) {
				console.log(res)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background: #00a4ef;
		// background: #232c37;
		height: 100vh;
	}


	.user-info {
		height: 50px;
		display: flex;
		align-items: center;
		color: #fff;

		.user {
			background: #fff;
			width: 35px;
			height: 35px;
			border-radius: 50%;
			margin-left: 15px;
			margin-right: 10px;

			image {
				width: 35px;
				height: 35px;
				border-radius: 50%;

			}
		}

	}

	.wallet {
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		margin: 0 15px;
		width: calc(100% - 30px);
		background: #232c37;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		color: #fff;
		padding: 0 8px;
		font-size: 15px;

		.money {
			margin-left: 4px;
			color: yellow;
		}

		.myWallet {
			height: 30px;
			width: 90px;
			border-radius: 10px;
			text-align: center;
			line-height: 30px;
			border: 1px solid #fff;
		}
	}

	.mine {
		height: calc(100% - 100px);
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		background: #fff;
	}

	.orders {
		display: flex;
		justify-content: space-between;
		height: 90px;
		color: #333;
		align-items: center;
		background: #fff;
		box-sizing: border-box;

		.order {
			width: 33%;
			text-align: center;

			image {
				width: 40px;
				height: 40px;
				border-radius: 50%;
			}

			view {
				line-height: 20px;
				font-size: 14px;
				text-align: center;
			}
		}
	}

	.line {
		background: #eee;
		height: 8px;
	}

	.others {
		display: flex;
		justify-content: space-between;
		height: 80px;
		color: #333;
		padding: 0 15px;
		background: #fff;
		align-items: center;

		.other {
			width: 70px;
			text-align: center;

			image {
				width: 35px;
				height: 35px;
				border-radius: 50%;
			}

			view {
				line-height: 20px;
				font-size: 14px;
				text-align: center;
			}
		}
	}

	
</style>
