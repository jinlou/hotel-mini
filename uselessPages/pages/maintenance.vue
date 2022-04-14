<template>
	<view class="content">
		<Room></Room>
		<view class="more">
			<text>选择物品</text>
			<view class="items">
				{{names.join(' ')}}
			</view>
			<view class="one" v-for="item in maintennanceList" :key="item.id" @click="choose(item)">
				{{item.name}}
			</view>
		</view>

		<view class="more">
			<text>备注</text>
			<textarea class="info" v-model.trim="content" placeholder="如有其他需求,请输入…" />
		</view>
		<button type="primary" @click="submit" class="submit">提交</button>
	</view>
</template>

<script>
	import Room from '@/components/room.vue'
	export default {
		data() {
			return {
				time: '立即清扫',
				index: 0,
				items: [],
				maintennanceList: [
					{
						name: '电视',
						id: 1
					},
					{
						name: '空调',
						id: 2
					},
					{
						name: '淋浴',
						id: 3
					},
					{
						name: '马桶',
						id: 4
					},
					{
						name: '桌椅',
						id: 5
					},
					{
						name: '门窗',
						id: 6
					},
					{
						name: '床',
						id: 7
					},
					{
						name: '灯具',
						id: 8
					},
					{
						name: '沙发',
						id: 9
					},
					{
						name: '其它',
						id: 10
					},
				],
				names: [],
				price: '',
			}
		},
		components: {
			Room
		},
		onLoad() {},
		mounted() {},
		methods: {
			choose(item) {
				console.log(item)
				let newArr = this.items.filter(v => {
					return v.id == item.id
				})
				console.log(newArr)
				if(!newArr.length) {
					console.log(this.items)
					this.items.push(item)
				}
				console.log(this.items)
				this.names = []
				this.items.forEach(v => {
					this.names.push(v.name)
				})
			},
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
	
	.items {
		height: 100rpx;
		background: #eee;
		border-radius: 8rpx;
		margin-bottom: 20rpx;
	}

	.one {
		border-radius: 10rpx;
		padding: 6rpx 10rpx;
		color: $uni-color-primary;
		border: 1px solid $uni-color-primary;
		font-size: 22rpx;
		display: inline-block;
		margin-right: 16rpx;
		margin-bottom: 12rpx;
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
