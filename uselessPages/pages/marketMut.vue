<template>
	<view class="content">
		<view class="top">
			<view class="left">
				<text class="txt1">酒店里的便利店</text>
				<text class="txt2">尊享免费送货到房服务</text>
			</view>
			<view class="right">
				<text class="txt1">{{room}}</text>
				<text class="txt2">房号/桌号</text>
			</view>
		</view>
		<view class="market">
			<view class="myOrder">
				<view class="left">
					<image src="@/static/logo.png" mode=""></image>
					<text>在线下单，即可免费送货到房</text>
				</view>
				<view class="right" @click="goTo('orderRecord')">
					<text>我的订单</text>
					<uni-icons class="right" type="right" size="14"></uni-icons>
				</view>
			</view>

			<scroll-view scroll-y class="scroll">
				<view class="goods">
					<view class="one" v-for="item in goodsList" :key="item.id">
						<view class="goodsInfo">
							<image :src="item.url" mode=""></image>
							<view class="info">
								<text>{{item.name}}</text>
								<text>库存{{item.stock}}</text>
								<text>￥{{item.rules[0].price}}</text>
							</view>
						</view>
						<view class="amount" v-if="item.rules.length == 1">
							<uni-icons type="minus" size="22" @click="minus(item, 0)"
								:color="item.rules[0].value == 0 ? '#999' : '#00a4ef'"></uni-icons>
							<text
								style="width: 40rpx;text-align:center;display: inline-block;">{{item.rules[0].value}}</text>
							<uni-icons type="plus" size="22" @click="plus(item, 0)"
								:color="item.rules[0].value == 9 ? '#999' : '#00a4ef'"></uni-icons>
						</view>
						<view class="rules" v-else @click="showRules(item)">
							选规格
						</view>
					</view>
				</view>
			</scroll-view>

			<view class="shoppingCat">
				<view class="left" @click="showChoosed">
					<view class="num">
						<image src="@/static/logo.png" mode=""></image>
						<text class="allNum">{{allNum}}</text>
					</view>
					<text class="money">￥{{allMoney}}</text>
				</view>
				<view class="pay" @click="goTo('confirmOrder')">
					选好了
				</view>
			</view>
		</view>

		<uni-popup ref="goods" type="bottom" @change="goodsPopChange">
			<view class="goodsRules">
				<view class="goodsInfo">
					<image :src="modifyGoods.url" mode=""></image>
					<view class="info">
						<text>{{modifyGoods.name}}</text>
						<text>库存{{modifyGoods.stock}}</text>
						<text>￥{{modifyGoods.rules[modifyGoodsIndex].price}}</text>
					</view>
				</view>
				<view class="title">规格</view>
				<view class="rules">
					<view :class="['one',modifyGoodsIndex==index ? 'active':'',item.stock == 0 ? 'disabled' : '']"
						v-for="(item,index) in modifyGoods.rules" :key="index" @click="chooseRule(item,index)">
						{{item.ruleName}}
					</view>
				</view>
				<button type="primary" @click="add" class="submit">加入购物车</button>

			</view>
		</uni-popup>

		<uni-popup ref="choosed" type="bottom">
			<view class="goods choosedGoods">
				<view class="title">
					<text>已选商品</text>
					<view class="clear" @click="clearAll">
						清空
					</view>
				</view>
				<scroll-view scroll-y="true" class="allGoods">
					<view class="one" v-for="item in choosedGoods" :key="item.id">
						<view class="goodsInfo">
							<image :src="item.url" mode=""></image>
							<view class="info">
								<text>{{item.name}}</text>
								<text>{{item.ruleName}}</text>
								<text style="color: #f25022;">￥{{item.price}}</text>
							</view>
						</view>
						<view class="amount">
							<uni-icons type="minus" size="22" @click="minusCart(item)"
								:color="item.value == 0 ? '#999' : '#00a4ef'"></uni-icons>
							<text
								style="width: 40rpx;text-align:center;display: inline-block;color: #f25022;">{{item.value}}</text>
							<uni-icons type="plus" size="22" @click="plusCart(item)"
								:color="item.value == 9 ? '#999' : '#00a4ef'"></uni-icons>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				room: '送样重启3',
				goodsList: [{
						name: '辣条',
						url: 'https://www.runoob.com/wp-content/themes/runoob/assets/images/qrcode.png',
						stock: 999,
						rules: [{
							name: '统一',
							ruleID: '1.1',
							price: 3.5,
							value: 0,
							stock: 999
						}, ],
						id: 1,
					}, {
						name: '辣条1',
						url: 'https://www.runoob.com/wp-content/themes/runoob/assets/images/qrcode.png',
						stock: 999,
						rules: [{
							name: '统一1',
							ruleID: '2.1',
							price: 111,
							value: 0,
							stock: 999
						}, ],
						id: 2,

					},
					{
						name: '方便面',
						url: 'https://www.runoob.com/wp-content/themes/runoob/assets/images/qrcode.png',
						stock: 113,
						rules: [{
								ruleName: '统一',
								ruleID: '3.1',
								price: 4.5,
								value: 0,
								stock: 0
							},
							{
								ruleName: '康师傅泡椒味道的味道',
								ruleID: '3.2',
								price: 4.5,
								value: 0,
								stock: 2
							},
							{
								ruleName: '康师傅同意老坛酸菜面',
								ruleID: '3.3',
								price: 4,
								value: 0,
								stock: 111
							}
						],
						id: 3,
						value: 0
					},
					{
						name: '方便面1',
						url: 'https://www.runoob.com/wp-content/themes/runoob/assets/images/qrcode.png',
						stock: 0,
						rules: [{
								ruleName: '统一',
								ruleID: '4.1',
								price: 4.5,
								value: 0,
								stock: 0
							},
							{
								ruleName: '康师傅同意老坛酸菜面',
								ruleID: '4.2',
								price: 4,
								value: 0,
								stock: 0
							}
						],
						id: 4,
						value: 0
					},
				],
				modifyGoods: {},
				modifyGoodsIndex: -1,
			}
		},
		computed: {
			allNum() {
				let num = 0
				this.goodsList.forEach(v => {
					v.rules.forEach(n => {
						num += n.value
					})
				})
				return num
			},
			allMoney() {
				let num = 0
				this.goodsList.forEach(v => {
					v.rules.forEach(n => {
						num += n.value * n.price
					})
				})
				return num
			},
			choosedGoods() {
				let arr = []
				for (let i = 0; i < this.goodsList.length; i++) {
					for (let j = 0; j < this.goodsList[i].rules.length; j++) {
						if (this.goodsList[i].rules[j].value) {
							arr.push({
								url: this.goodsList[i].url,
								name: this.goodsList[i].name,
								ruleName: this.goodsList[i].rules[j].ruleName,
								price: this.goodsList[i].rules[j].price,
								value: this.goodsList[i].rules[j].value,
								ruleID: this.goodsList[i].rules[j].ruleID,
							})
						}
					}
				}
				return arr
			}
		},
		mounted() {

		},
		methods: {
			goTo(to) {
				if(to == 'confirmOrder') {
					if(this.choosedGoods.length) {
						uni.setStorage({
							key: 'choosedGoods',
							data: this.choosedGoods
						})
						
						uni.navigateTo({
							url: '/uselessPages/pages/' + to
						})
						
					} else {
						uni.showToast({
							title: '请选择商品',
							icon: 'none'
						})
					}
					
				} else {
					uni.navigateTo({
						url: '/uselessPages/pages/' + to
					})
				}
			},
			minus(item, key = 0) {
				console.log(item)
				if (!item.rules[key].value) return
				for (let i = 0; i < this.goodsList.length; i++) {
					for (let j = 0; j < this.goodsList[i].rules.length; j++) {
						if (item.rules[key].ruleID == this.goodsList[i].rules[j].ruleID) {
							this.goodsList[i].rules[j].value--
						}
					}
				}
			},
			plus(item, key = 0) {
				if (item.rules[key].value == 9) return
				for (let i = 0; i < this.goodsList.length; i++) {
					for (let j = 0; j < this.goodsList[i].rules.length; j++) {
						if (item.rules[key].ruleID == this.goodsList[i].rules[j].ruleID) {
							this.goodsList[i].rules[j].value++
						}
					}
				}
			},
			minusCart(item) {
				for (let i = 0; i < this.goodsList.length; i++) {
					for (let j = 0; j < this.goodsList[i].rules.length; j++) {
						if (item.ruleID == this.goodsList[i].rules[j].ruleID) {
							this.goodsList[i].rules[j].value--
						}
					}
				}
			},
			plusCart(item) {
				for (let i = 0; i < this.goodsList.length; i++) {
					for (let j = 0; j < this.goodsList[i].rules.length; j++) {
						if (item.ruleID == this.goodsList[i].rules[j].ruleID) {
							this.goodsList[i].rules[j].value++
						}
					}
				}
			},
			showRules(item) {
				this.modifyGoods = item
				for (let i = 0; i < this.modifyGoods.rules.length; i++) {
					if (this.modifyGoods.rules[i].stock && this.modifyGoodsIndex == -1) {
						this.modifyGoodsIndex = i
					}
				}
				if (this.modifyGoodsIndex == -1) {
					uni.showToast({
						title: '暂无库存',
						icon: 'none'
					})
				} else {
					this.$refs.goods.open()
				}
			},
			// 选择商品规格弹窗显示或隐藏
			goodsPopChange(e) {
				console.log(e)
				if (!e.show) {
					this.modifyGoodsIndex = -1
				}
			},
			chooseRule(item, index) {
				if (item.stock) {
					this.modifyGoodsIndex = index
				}
			},
			add() {
				this.modifyGoods.rules[this.modifyGoodsIndex].value++
				this.$refs.goods.close()
			},
			showChoosed() {
				this.$refs.choosed.open()
			},
			clearAll() {
				for (let i = 0; i < this.goodsList.length; i++) {
					for (let j = 0; j < this.goodsList[i].rules.length; j++) {
						this.goodsList[i].rules[j].value = 0
					}

				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
	}

	.top {
		display: flex;
		height: 180rpx;
		padding-bottom: 40rpx;
		color: #fff;
		background: #000;
		justify-content: space-between;

		.left {
			display: flex;
			flex-direction: column;
			font-size: 26rpx;
			align-items: center;
			justify-content: center;
			padding-left: 20rpx;
		}

		.right {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding-right: 20rpx;

			.txt1 {
				font-size: 26rpx;
			}

			.txt2 {
				font-size: 20rpx;
			}
		}
	}

	.market {
		margin-top: -40rpx;
		height: calc(100% - 145rpx);
		background: #fff;
		border-radius: 30rpx;
		overflow: hidden;

		.myOrder {
			height: 80rpx;
			background: #00a4ef;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;

			.left {
				display: flex;
				align-items: center;
				height: 100%;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 12rpx;
				}

				text {
					font-size: 24rpx;
				}
			}

			.right {
				display: flex;
				align-items: center;
				height: 100%;

				text {
					font-size: 24rpx;
					font-weight: bold;
					margin-right: 6rpx;
				}
			}
		}
	}

	.scroll {
		height: calc(100% - 160rpx);
	}

	.goods {
		.one {
			display: flex;
			padding: 0 30rpx;
			align-items: flex-end;

			.rules {
				padding: 6rpx 12rpx;
				color: #fff;
				background: $uni-color-primary;
				font-size: 22rpx;
				border-radius: 14rpx;
			}
		}
	}

	.goodsInfo {
		flex: 1;
		display: flex;
		margin-top: 20rpx;

		image {
			width: 120rpx;
			height: 120rpx;
			margin-right: 10rpx;
		}

		.info {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			text:nth-child(1) {
				font-size: 22rpx;
				color: #333;
			}

			text:nth-child(2) {
				font-size: 20rpx;
				color: #999;
			}

			text:nth-child(3) {
				font-size: 22rpx;
				color: #f25022;
			}
		}
	}

	.shoppingCat {
		height: 120rpx;
		display: flex;
		// align-items: center;
		justify-content: space-between;
		padding: 16rpx 30rpx;
		border-top: 1rpx solid #ebedf2;

		.left {
			display: flex;

			.num {
				position: relative;

				image {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
				}

				.allNum {
					position: absolute;
					top: 0;
					right: -10rpx;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					background: #f25022;
					text-align: center;
					line-height: 30rpx;
					color: #fff;
				}


			}

			.money {
				font-size: 32rpx;
				color: #f25022;
				margin-left: 30rpx;
			}

		}

		.pay {
			width: 150rpx;
			height: 56rpx;
			line-height: 56rpx;
			color: #fff;
			text-align: center;
			background: $uni-color-primary;
			font-size: 26rpx;
			border-radius: 8rpx;
		}
	}

	.amount {
		display: flex;
		align-items: center;
	}

	.goodsRules {
		background: #fff;
		padding: 30rpx 40rpx 20rpx;

		.title {
			font-size: 24rpx;
			color: #333;
			margin: 20rpx 0 10rpx;
		}

		.rules {
			display: flex;
			margin-bottom: 60rpx;
			flex-wrap: wrap;

			.one {
				padding: 8rpx 40rpx;
				background: #eee;
				color: #333;
				font-size: 22rpx;
				margin-left: 30rpx;
				margin-bottom: 20rpx;
				border-radius: 8rpx;


				&.active {
					background: rgba(0, 164, 239, 0.4);
					color: rgba(0, 164, 239, 1);
				}

				&.disabled {
					color: #999;
				}
			}
		}
	}

	.choosedGoods {
		height: 600rpx;
		background: #fff;
		padding: 30rpx 0;

		.title {
			height: 60rpx;
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;
			align-items: center;

			text {
				font-size: 26rpx;
			}

			.clear {
				width: 80rpx;
				font-size: 22rpx;
				border-radius: 25rpx;
				height: 50rpx;
				line-height: 50rpx;
				text-align: center;
				background: rgba(0, 164, 239, 0.4);
				color: rgba(0, 164, 239, 1);
			}
		}
	}

	.allGoods {
		height: calc(100% - 60rpx);
	}

	.submit {
		background: $uni-color-primary;
		font-size: 26rpx;
	}
</style>
