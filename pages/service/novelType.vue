<template>
	<view class="page" :style="{background: channelId == 1 ? '#DFEEFF' : '#FFF5F5', paddingTop: hideChannel ? '126px' : '168px'}">
		<view class="types">
			<view class="top">
				<view @click="changeStatus(item, index)" :class="['one', active == index ? 'active' : '' ]" v-for="(item,index) in categoryList" :key="item.cid">
					{{item.catName}}
				</view>
			</view>
			<view class="top" v-if="!hideChannel">
				<view @click="changeStatus3(item, index)" :class="['one', active3 == index ? 'active' : '' ]" v-for="(item,index) in channelList" :key="item.id">
					{{item.name}}
				</view>
			</view>
			<view class="top">
				<view @click="changeStatus1(item, index)" :class="['one', active1 == index ? 'active' : '' ]" v-for="(item,index) in completeList" :key="item.id">
					{{item.name}}
				</view>
			</view>
			<view class="top">
				<view @click="changeStatus2(item, index)" :class="['one', active2 == index ? 'active' : '' ]" v-for="(item,index) in otherList" :key="item.id">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="lists">
			<view class="bookList" v-for="(item, index) in bookList" :key="index">
				<view class="one" @click="detail(item)">
					<image class="cover" :src="item.cover">
					<view class="info">
						<view class="name ellipsis">{{item.bookName}}</view>
						<view class="desc">{{item.description.length > 50 ? (item.description.slice(0, 50) + '…'): item.description}}</view>
						<view class="author ellipsis">{{item.author}}/{{item.status == 2 ? '完结' : '连载中'}}</view>
					</view>
				</view>
			</view>
			<Nothing v-if="!bookList.length" style="margin-top: 156rpx;" title="暂无小说"></Nothing>
			<uni-load-more v-if="bookList.length || status == 'loading'" :status="status"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import Nothing from '@/components/nothing.vue'
	export default {
		data() {
			return {
				bookList: [],
				categoryList: [{
					catName: '全部',
					cid: ''
				}],
				channelList: [
					{
						name: '男频',
						id: '1'
					},
					{
						name: '女频',
						id: '2'
					}
				],
				completeList: [
					{
						name: '全部',
						id: ''
					},
					{
						name: '连载中',
						id: '1'
					},
					{
						name: '完结',
						id: '2'
					},
				],
				otherList: [
					{
						name: '全部',
						id: ''
					},
					{
						name: '人气最高',
						id: 'hot'
					},
					{
						name: '最近更新',
						id: 'new'
					},
					{
						name: '最新上架',
						id: 'is_new'
					},
				],
				loading: true,
				status: 'more',
				page: 1,
				perPage: 20,
				active: 0,
				active1: 0,
				active2: 0,
				active3: 0,
				channelId: 1,
				cid: '',
				isComplete: '',
				isOther: '',
				hideChannel: false,
			}
		},
		components: {
			Nothing
		},
		onLoad(options) {
			console.log(options)
			if(options.type == 'channelId') {
				this.channelId = options.key
				this.hideChannel = true
				uni.setNavigationBarTitle({
					title: options.key == 1 ? '男频' : '女频'
				});
			} else if(options.type == 'flag') {
				this.isOther = options.key
				this.active2 = 1
				uni.setNavigationBarTitle({
					title: '分类'
				});
			} else if(options.type == 'status') {
				this.isComplete = options.key
				this.active1 = 2
				uni.setNavigationBarTitle({
					title: '分类'
				});
			}
			this.categorys()
		},
		mounted() {
			this.getBookList()
		},
		onReachBottom() {
			console.log('onReachBottom')
			this.getBookList()
		},
		onPullDownRefresh() {
			console.log('onPullDownRefresh')
			this.getBookList('mark')
		},
		methods: {
			changeStatus(item, index) {
				this.active = index
				this.cid = item.cid
				this.getBookList('mark')
			},
			changeStatus1(item, index) {
				this.active1 = index
				this.isComplete = item.id
				this.getBookList('mark')
			},
			changeStatus2(item, index) {
				this.active2 = index
				this.isOther = item.id
				this.getBookList('mark')
			},
			changeStatus3(item, index) {
				this.active3 = index
				this.channelId = item.id
				this.getBookList('mark')
			},
			categorys() {
				this.$api.categorys({
					channelId: this.channelId
				}).then(res => {
					console.log(res)
					this.categoryList = [...this.categoryList, ...res.data]
				}).catch(err => {
					console.log(err)
				})
			},
			getBookList(mark = '') {
				if(mark) {
					this.status = 'loading'
					this.page = 1
					this.bookList = []
				}
				if(this.status == 'noMore') return
				this.loading = true
				this.$api.categoryList({
					page: this.page,
					per_page: this.perPage,
					cid: this.cid,
					channelId: this.channelId,
					status: this.isComplete,
					flag: this.isOther
				}).then(res => {
					console.log(res)
					this.loading = false
					if(res.code == 0) {
						this.bookList = [...this.bookList, ...res.data.data]
						if(res.data.length < this.perPage) {
							this.status = 'noMore'
						} else {
							this.page++
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					console.log(err)
					this.loading = false
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			detail(item) {
				uni.navigateTo({
					url: '/pages/service/novelDesc?id=' + item.bookId
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		padding-top: 126px;
	}
	
	.types {
		position: fixed;
		top: 0;
		width: 100%;
		left: 0;
	}
	
	.top {
		height: 42px;
		display: flex;
		overflow-y: auto;
		width: 100%;
		background: #fff;
		padding: 6px;
		
		.one {
			width: auto;
			padding: 4px 6px 6px;
			margin-right: 8px;
			border-bottom: 1px solid transparent;
			flex: 0 0 auto;
			font-size: 14px;
			
			&.active {
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				background: #ABCFFF;
				border-radius: 13px;
			}
		}
	}
	
	.bookList {
		.one {
			display: flex;
			margin: 15px 20px;
			height: 100px;
			
			.cover {
				width: 75px;
				height: 100px;
				margin-right: 8px;
				flex-grow: 0;
				flex-shrink: 0;
			}
			
			.info {
				display: flex;
				justify-content: space-between;							
				font-family: PingFang SC-Bold, PingFang SC;
				font-weight: bold;
				color: #000000;
				flex-direction: column;
				
				.name {
					font-size: 18px;
				}
				
				.desc {
					font-size: 12px;
				}
				
				.author {
					font-size: 10px;
				}
			}
		}
	}
</style>