<template>
	<view class="container">
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
			:direction="direction" @trigger="trigger"/>
	</view>
</template>

<script>
	export default {
		props: ['routerAt'],
		data() {
			return {
				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'vertical',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#7A7E83',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				is_color_type: false,
				content: [
					{
						iconPath: '/static/image/index.png',
						selectedIconPath: '/static/image/index.png',
						text: '首页',
						active: false
					},
					{
						iconPath: '/static/image/service.png',
						selectedIconPath: '/static/image/service.png',
						text: '工单',
						active: false
					},
					{
						iconPath: '/static/image/orders.png',
						selectedIconPath: '/static/image/orders.png',
						text: '订单',
						active: false
					},
					{
						iconPath: '/static/image/store.png',
						selectedIconPath: '/static/image/store.png',
						text: '书架',
						active: false
					},
					{
						iconPath: '/static/image/mine.png',
						selectedIconPath: '/static/image/mine.png',
						text: '我的',
						active: false
					}
				]
			}
		},
		onBackPress() {
			if (this.$refs.fab.isShow) {
				this.$refs.fab.close()
				return true
			}
			return false
		},
		methods: {
			trigger(e) {
				console.log(e)
				this.content[e.index].active = !e.item.active
				if(e.index == 0) {
					if(this.routerAt != 'service') {
						uni.navigateTo({
							url: '/pages/service/service'
						})
					}
				} else if(e.index == 1) {
					if(this.routerAt != 'serviceList') {
						uni.navigateTo({
							url: '/pages/mine/serviceList'
						})
					}
				} else if(e.index == 2) {
					if(this.routerAt != 'orderList') {
						uni.navigateTo({
							url: '/uselessPages/pages/orderList'
						})
					}
				}  else if(e.index == 3) {
					if(this.routerAt != 'store') {
						uni.navigateTo({
							url: '/pages/service/store'
						})
					}
				} else {
					if(this.routerAt != 'mine') {
						uni.switchTab({
							url: '/pages/mine/mine'
						})
					}
				}
			},
		}
	}
</script>

<style>
	.warp {
		padding: 10px;
	}

	.button {
		margin-bottom: 10px;
	}
</style>
