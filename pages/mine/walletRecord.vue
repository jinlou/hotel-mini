<template>
	<view class="content">
		<view class="noData" v-if="!lists.length">
			<image class="logo" src="/static/logo.png"></image>
			<view>暂无数据</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				balance: 100,
				lists: [],
			}
		},
		components: {},
		onLoad(options) {
			console.log(options)
			uni.setNavigationBarTitle({
			    title: options.type == 3 ? '退款记录' : options.type == 2 ? '支付记录' : '充值记录'
			});
		},
		methods: {
			checkboxChange: function(e) {
				console.log(e)
				var checked = e.target.value
				var changed = {}
				for (var i = 0; i < this.checkboxItems.length; i++) {
					if (checked.indexOf(this.checkboxItems[i].name) !== -1) {
						changed['checkboxItems[' + i + '].checked'] = true
					} else {
						changed['checkboxItems[' + i + '].checked'] = false
					}
				}
			},
			radioChange: function(e) {
				var checked = e.target.value
				var changed = {}
				for (var i = 0; i < this.radioItems.length; i++) {
					if (checked.indexOf(this.radioItems[i].name) !== -1) {
						changed['radioItems[' + i + '].checked'] = true
					} else {
						changed['radioItems[' + i + '].checked'] = false
					}
				}
			},
			goTo(item) {
				// if (to == 'meituan') {
				// 	uni.navigateToMiniProgram({
				// 		appId: 'wx2c348cf579062e56',
				// 		path: 'packages/restaurant/restaurant/restaurant?poi_id=1027434691792581&aas=1003&cat_id=0',
				// 		extraDta: {
				// 			'data1': 'test'
				// 		},
				// 		success(res) {
				// 			console.log('tiao')
				// 		}
				// 	})
				// }
				uni.navigateToMiniProgram({
					appId: item.appID,
					path: item.defaultPage,
					success(res) {
						console.log('tiao')
					}
				})
			},
			showMore() {
				this.$refs.notice.open('center')
			},
			close() {
				this.$refs.notice.close()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100vh;
		min-height: 100vh;
		background: #eee;
	}
	
	.noData {
		height:70%;
	}
</style>
