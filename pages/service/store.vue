<template>
	<view class="page1">
		<view class="content">
			<view v-for="(item, index) in storeList" :key="index" class="one" @click="goTo(item)" @longpress="deleteOne(item)">
				<image :src="item.bookInfo.cover" />
				<view class="name ellipsis">{{item.bookInfo.author}}</view>
				<view class="last ellipsis">{{item.lastChapter.chapterName}}</view>
			</view>
		</view>
		<Nothing v-if="!storeList.length" title="快去添加书籍到书架吧!">
			<!-- <view style="padding: 15px; color: #00a4ef;">阅读小说</view> -->
		</Nothing>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="取消" confirmText="删除" title="通知" content="确定删除该小说吗？" @confirm="dialogConfirm"
				@close="dialogClose"></uni-popup-dialog>
		</uni-popup>
		<view class="toNovel" @click="goTo()">
			<image	src="/static/image/story.png"></image>
			<!-- 小说首页 -->
		</view>
	</view>
</template>

<script>
	import Nothing from '@/components/nothing.vue'
	export default {
		data() {
			return {
				storeList: [],
				modifyInfo: {},
			}
		},
		onLoad(options) {
			console.log(options)
		},
		components: {
			Nothing
		},
		mounted() {
		},
		onShow() {
			this.userNovelShelfPage()
		},
		methods: {
			userNovelShelfPage() {
				this.$api.userNovelShelfPage({
					page: 1,
					per_page: 3000
				}).then(res => {
					console.log(res)
					this.storeList = res.data.data
				}).catch(err => {
					console.log(err)
				})
			},
			goTo(item) {
				if(item) {
					uni.navigateTo({
						url: '/pages/service/novelDesc?id='+ item.bookId + '&chapterId=' +item.lastChapter.chapterId
					})
				} else {
					uni.navigateTo({
						url: '/pages/service/novel'
					})
				}
				
			},
			deleteOne(item) {
				console.log(item)
				this.modifyInfo = item
				this.$refs.alertDialog.open()
			},
			dialogConfirm() {
				this.$api.userNovelShelfDel({
					ids: this.modifyInfo.id
				}).then(res => {
					this.userNovelShelfPage()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page1 {
		background: #DFEEFF;
		min-height: 100vh;
		
		.content {
			display: flex;
			flex-wrap: wrap;
			
			.one {
				width: 33.3%;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 15px 15px 10px;
				
				image {
					width: 75px;
					height: 100px;
				}
				
				.name {
					text-align: center;
					font-size: 12px;
				}
				
				.last {
					font-size: 10px;
				}
			}
		}
	}
	
	.toNovel {
		position: fixed;
		bottom: 100px;
		right: 20px;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
		font-size: 10px;
		
		image {
			width: 40px;
			height: 40px;
		}
	}
</style>
