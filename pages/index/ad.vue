<template>
	<view class="page" @click="back()">
		<!-- <web-view src="https://uniapp.dcloud.io"></web-view> -->
		<web-view src="https://mimilive.cn/ad/download_link/dujinke"></web-view>
	</view>
</template>

<script>
	export default {
		mounted() {
			setTimeout(() => this.back(), 4000)
		},
		methods: {
			back() {
				console.log(1)
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style>
</style>