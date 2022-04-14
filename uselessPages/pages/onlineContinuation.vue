<template>
	<view class="content">
		<Room></Room>
		<view class="choose">
			<view class="cleanTime">
				<text>续房类型</text>
				<view class="types">
					<picker @change="bindPickerChange" v-model="type" :index="typeIndex" :range="typeList">
						<view class="uni-input">
							{{typeList[typeIndex]}}
							<uni-icons type="right" color="#666" size="14"></uni-icons>
						</view>

					</picker>
				</view>
			</view>
			<view class="cleanTime">
				<text>续房天数</text>
				<view class="types">
					<picker @change="bindPickerChangeDay" v-model="day" :index="dayIndex" :range="dayList">
						<view class="uni-input">
							{{dayList[dayIndex]}}
							<uni-icons type="right" color="#666" size="14"></uni-icons>
						</view>
					</picker>
				</view>
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
				type: '续住此房间',
				typeIndex: 0,
				typeList: [
					'续住此房间',
					'换房续住',
				],
				day: 1,
				dayIndex: 0,
				dayList: [
					1,
					2,
					3, 4, 5, 6, 7, 8, 9, 10
				],
				content: '',
			}
		},
		components: {
			Room
		},
		onLoad() {},
		mounted() {},
		methods: {
			bindPickerChange(e) {
				console.log(e)
				this.typeIndex = e.detail.value
			},
			bindPickerChangeDay(e) {
				console.log(e)
				this.dayIndex = e.detail.value
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

	.choose {
		background: #fff;
		border-radius: 8rpx;


	}

	.cleanTime {
		padding: 16rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;

		.types {
			display: flex;
			flex: 1;
			justify-content: flex-end;
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
