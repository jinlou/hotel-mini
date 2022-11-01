<template>
	<view class="page">
		<view class="out" v-for="(item, index) in imgs"  :key="index" :style="{height: item.height,width: '100%'}">
			<image :style="{height: item.height,width: '100%'}"
				:src="item.url" :data-i="index" @load="load" />
			<view class="text" v-if="index == 2">
				<view class="contact">
					<view>联系客服</view>	
					<cell @startmessage='startmessage' @completemessage="completemessage" plugid='ae9842bedc2efc990023de3c3ed1b415'></cell>
				</view>
				<text>好评有礼流程：</text>
				<text>在抖音搜索</text>
				<text class="name">{{roomInfo.hotelBranch.name}}</text>
				<text>点击绿色定位图标</text>
				<text>在评论区发布30字好评+2张图</text>
				<text>或者一条视频</text>
				<text>好评截图联系客服确认，即可获取对应好礼</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// imgUrl:'https://jdguanjia.jdkeji.top/',
				imgs: [
					{url: 'https://jdguanjia.jdkeji.top/static/favorable_reception/favorable_reception1.png'},
					{url: 'https://jdguanjia.jdkeji.top/static/favorable_reception/favorable_reception2.png'},
					{url: 'https://jdguanjia.jdkeji.top/static/favorable_reception/favorable_reception3.png'},
					{url: 'https://jdguanjia.jdkeji.top/static/favorable_reception/favorable_reception4.png'},
					// 'static/favorable_reception/favorable_reception1.png',
					// 'static/favorable_reception/favorable_reception2.png',
					// 'static/favorable_reception/favorable_reception3.png',
					// 'static/favorable_reception/favorable_reception4.png',
				],
				roomInfo: uni.getStorageSync('roomInfo'),
				phone: uni.getStorageSync('roomInfo').complaintPhone.content 
			}
		},
		mounted() {
			
		},
		methods: {
			load(v) {
				console.log(v)
				let i = v.target.dataset.i
				let height = v.target.height
				let width = v.target.width
				// this.info.detail_img[i].height = (750 * height / width) + 'rpx'
				console.log(this.imgs)
				this.$set(this.imgs, i, {
					...this.imgs[i],
					height: (750 * height / width) + 'rpx'
				})
				console.log(this.imgs)
				// this.info.detail_img.splice(i,1 ,{...this.info,height: (750 * height / width) + 'rpx'})
			},
			call() {
				let _this = this
				wx.makePhoneCall({
					phoneNumber: _this.phone //仅为示例，并非真实的电话号码
				})
			},
			startmessage(){
			　　console.log('startmessage--start')
			　　},
			completemessage(){
			　　console.log('completemessage--ok')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page{
		display: flex;
		flex-direction: column;
	}
	
	view,image {
		margin: 0;
		padding:0;
	}
	
	.out {
		position: relative;
		
		.text {
			position: absolute;
			top: 18px;
			display: flex;
			flex-direction: column;
			color: #fff;
			line-height: 27px;
			justify-content: center;
			align-items: center;
			text-align: center;
			width: 100%;
			font-size: 14px;
			
			text:first-child {
				font-size: 18px;
				margin-bottom: 20px;
			}
			
			.name {
				font-size: 16px;
				color: #007aff;
			}
		}
	}
	
	.contact {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 48px;
		margin-bottom: 14px;
		
		view {
			font-size: 18px;
			color: #fff;
			margin-right: 10px;
			margin-bottom: 0;
		}
	}
	
	/deep/ {
		.cell--bubble {
			transform: scale(.7);
		}
	}
</style>
