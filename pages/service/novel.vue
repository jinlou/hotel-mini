<template>
	<view class="page">
		<uni-search-bar placeholder="搜索小说名称或者作者" @confirm="search" v-model="searchValue" radius="20"
			@focus="focus" @clear="clear">
		</uni-search-bar>
		<view class="swiper-wrap">
			<swiper class="swiper" 
				:display-multiple-items="3"
				previous-margin="10px"
				next-margin="10px"
				:autoplay="false" 
				:interval="3000" :duration="500" :current="swiperCurrent" @change="changeSwiper" @animationfinish="animationfinish"
			 circular>
				<swiper-item class="swiper-item" style="width:25%" v-for="(item, index) in swiperImg" :key="index" @click="read(item)">
					<!-- <image style="height: 250rpx;border-radius: 8rpx;" 
					@click="toDetail('/pages/information/infoDetail?url=' + item.url)" 
					class="swiper-img" :src="item.logo_url" mode="contain"></image> -->
					<view class="bgSwiper" :style="{backgroundImage: `url(${item.cover})`}" @click="toDetail('/pages/information/infoDetail?url=' + item.url)">
					</view>
				</swiper-item>
			</swiper>
			<!-- <view class="dots">
				<block v-for="(item,index) in swiperImg.length" :key="index">
					<view class="dot" :class="index==swiperCurrentDot ? 'active' : ''"></view>
				</block>
			</view> -->
		</view>
		<view class="type">
			<view class="one" @click="goTo('channelId',1)">
				<image src="@/static/image/novel/man.png"/>
			</view>
			<view class="one" @click="goTo('channelId', 2)">
				<image src="@/static/image/novel/woman.png"/>
			</view>
		</view>
		
		<view class="kinds">
			<view class="one" @click="goTo('flag', 'hot')">
				<image src="@/static/image/novel/hot.png"/>
				<text>最热</text>
			</view>
			<view class="one" @click="goTo('status', '2')">
				<image src="@/static/image/novel/complete.png"/>
				<text>完本</text>
			</view>
			<view class="one" @click="goTo('store')">
				<image src="@/static/image/novel/store.png"/>
				<text>书架</text>
			</view>
			<view class="one" @click="goTo()">
				<image src="@/static/image/novel/kindOf.png"/>
				<text>分类</text>
			</view>
		</view>
		
		<view class="like">
			<view class="title">
				<view class="left">
					<view class="line"></view>
					<text>猜你喜欢</text>
				</view>
				<view class="right" @click="recommendGuess">换一批<uni-icons type="refreshempty" size="16"></uni-icons></view>
			</view>
			<view class="books">
				<view class="one" v-for="(item, index) in guessLike" :key="index" @click="read(item)">
					<!-- <image :src="item.cover"/> -->
					<view class="cover" :style="{backgroundImage: `url(${item.cover})`}"></view>
					<view class="name ellipsis">{{item.bookName}}</view>
					<view class="author ellipsis">{{item.author}}</view>
				</view>
			</view>
		</view>
		
		<view class="like" style="margin-bottom: 20px;">
			<view class="title">
				<view class="left">
					<view class="line"></view>
					<text>今日热推</text>
				</view>
				<!-- <view class="right">换一批<uni-icons type="refreshempty" size="16"></uni-icons></view> -->
			</view>
			<view class="books">
				<view class="one" v-for="(item, index) in hots" :key="index" @click="read(item)">
					<!-- <image :src="item.cover"/> -->
					<view class="cover" :style="{backgroundImage: `url(${item.cover})`}"></view>
					<view class="name ellipsis">{{item.bookName}}</view>
					<view class="author ellipsis">{{item.author}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Nothing from '@/components/nothing.vue'
	export default {
		data() {
			return {
				searchValue: '',
				swiperImg: [],
				swiperCurrent: 0,
				swiperCurrentDot: 0,
				guessLike: [
					
				],
				hots: [
					
				],
			}
		},
		components: {
			Nothing
		},
		mounted() {
			// this.getBookList()
			// this.getCategoryList()
			this.recommendBanner()
			this.recommendGuess()
			this.recommendToday()
		},
		methods: {
			focus(e) {
				console.log('focus')
				console.log(e)
				uni.navigateTo({
					url: '/pages/service/novelList'
				})
			},
			changeSwiper(e) {
				this.swiperCurrentDot = e.detail.current;
			},
			animationfinish(e) {
				console.log(e)
				this.swiperCurrent = e.detail.current;
			},
			goTo(item = '', i = '') {
				if(item == 'store') {
					uni.navigateTo({
						url: '/pages/service/store'
					})
				} else {
					uni.navigateTo({
						url: '/pages/service/novelType?type=' + item + '&key=' + i
					})
				}
			},
			read(item) {
				uni.navigateTo({
					url: '/pages/service/novelDesc?id=' + item.bookId
				})
			},
			recommendBanner() {
				this.$api.recommendBanner().then(res => {
					console.log(res)
					this.swiperImg = res.data
				})
			},
			recommendGuess() {
				this.$api.recommendGuess().then(res => {
					console.log(res)
					this.guessLike = res.data
				})
			},
			recommendToday() {
				this.$api.recommendToday().then(res => {
					console.log(res)
					this.hots = res.data
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		display: flex;
		overflow-y: auto;
		width: 100%;
		// flex-wrap: wrap;
		font-size: 14px;
		padding: 6px;
		
		.one {
			width: auto;
			padding: 4px 8px 6px 8px;
			border-bottom: 1px solid transparent;
			flex: 0 0 auto;
			
			&.active {
				color: #0077dd;
				border-bottom: 1px solid #0077dd;
			}
		}
	}
	
	.swiper-wrap {
		position: relative;
		padding: 0 20rpx;
		border-radius: 8rpx;
		overflow: hidden;
		
		.dots {
			position: absolute;
			bottom: 27rpx;
			z-index: 4;
			display: flex;
			justify-content: center;
			width: 750rpx;
			
			.swiper {
				height: 300rpx;
			
				.swiper-item {
					overflow: hidden;
					width: 25%;
					height: 100%;
					
					.bgSwiper {
						width: 100%;
						height: 100%;
					}
				}
			
				.swiper-img {
					background-size: 750rpx 350rpx;
					
					
				}
			}
		
			.dot {
				width: 34rpx;
				height: 4rpx;
				transition: all .6s;
				margin-right: 10rpx;
				background-color: #535a70;
		
				&.active {
					background-color: #f25022;
				}
			}
		}
	}
	
	.bgSwiper {
		width: 100%;
		height: 100%;
		background-size: contain;
		margin: 0 10px;
	}
	
	.type {
		display: flex;
		padding: 10px 12px 8px;
		
		.one {
			width: 50%;
			height: 65px;
			background: #ABCFFF;
			border-radius: 5px;
			margin: 0 8px;
			display: flex;
			align-items: center;
			justify-content: center;
			
			&:last-child {
				background: #FFCCCC;
			}
			
			image {
				width: 76px;
				height: 50px;
			}
		}
	}
	
	.kinds {
		display: flex;
		justify-content: space-around;
		padding: 0 12px;
		
		.one {
			display: flex;
			flex-direction: column;
			align-items: center;
			
			image {
				width: 50px;
				height: 50px;
			}
			
			text {
				font-size: 12px;
			}
		}
	}
	
	.like {
		margin-top: 10px;
		
		.title {
			width: 100%;
			height: 36px;
			background: #F4FBFF;
			padding: 0 15px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 6px;
			
			.left {
				display: flex;
				.line {
					width: 5px;
					height: 22px;
					background: #ABCFFF;
					border-radius: 6px;
					margin-right: 8px;
				}
				
				text {
					color: #4EA1FF;
					font-size: 16px;
				}
			}
			
			.right {
				display: flex;
				align-items: center;
				font-size: 12px;
			}
		}
		
		.books {
			display: flex;
			padding: 0 15px;
			justify-content: space-between;
			
			.one {
				width: calc(25% - 10px);
				// width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				
				.cover {
					width: 100%;
					height: 100px;
					background-size: contain;
				}
				
				.name {
					font-size: 13px;
					font-weight: bold;
				}
				
				.author {
					font-size: 11px;
				}
			}
		}
		
	}
	
	
</style>