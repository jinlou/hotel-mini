<template>
	<view class="page1" :style="{background: background,color: background == '#232323' ? '#fff' : '#333'}">
		<view class="content" :style="{fontSize: fontSize + 'px', lineHeight: fontSize * 1.5 + 'px'}">
			<view v-for="(item, index) in content" :key="index" class="one">
				<view class="title" :style="{fontSize: fontSize * 1.2 + 'px', lineHeight: fontSize * 1.5 + 'px'}">{{item.title}}</view>
				<text :style="{fontSize: fontSize + 'px', lineHeight: fontSize * 2 + 'px'}">{{item.content}}</text>
			</view>
		</view>
		<view class="centerArea" @click="showMore"></view>
		<uni-popup ref="popup" background-color="#fff">
			<view class="popupContent">
				<view class="one" @click="getChapterList">
					<image src="@/static/image/novel/list.png" />
					<text>目录</text>
				</view>
				<view class="one" @click="set">
					<image src="@/static/image/novel/setting.png" />
					<text>设置</text>
				</view>
				<view class="one" @click="goTo()">
					<image src="@/static/image/novel/storeSmall.png" />
					<text>书架</text>
				</view>
				<view class="one" @click="back()">
					<image src="@/static/image/novel/close.png" />
					<text>退出</text>
				</view>
			</view>
			<view class="to">
				<view class="left" @click="next(-1)" >
					<image src="@/static/image/novel/back.png"/>
					<text>上一章</text>
				</view>
				<view class="center">{{chapterInfo.chapterTitle}}</view>
				<view class="right" @click="next(1)">
					<text>下一章</text>
					<image src="@/static/image/novel/forward.png"/>
				</view>
			</view>
			<view class="addStore" @click="addStore">加入书架</view>
		</uni-popup>
		<uni-popup ref="popup1" background-color="#fff">
			<view class="popupContent1">
				<view class="bookInfo">
					<image :src="bookInfo.cover"/>
					<view class="right">
						<view class="name">{{bookInfo.bookName}}</view>
						<view class="author">{{bookInfo.author}}</view>
						<view class="chapter">{{bookInfo.totalChapters}}章</view>
					</view>
				</view>
				<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" style="padding-top: 10px;">
					<view :id="'chapterID' + item.chapterId" v-for="(item, index) in chapterList" :class="['one', 'ellpsis', item.chapterId == chapterId ? 'active' : '']" @click="scan(item)">
						{{item.chapterTitle}}
						<text style="color: gold;margin-left: 6px;">{{item.isVip ? 'VIP' : ''}}</text>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		<uni-popup ref="popup2" :background-color="background">
			<view class="popupContent2">
				<view class="light">
					<image src="@/static/image/novel/light.png"/>
					<slider :value="light" @change="sliderChange" activeColor="#007DF8" block-color="#007DF8" block-size="18"/>
					<image src="@/static/image/novel/light.png"/>
				</view>
				<view class="light">
					<text>A-</text>
					<slider :value="fontSize" @change="sliderChange1" activeColor="#007DF8" block-color="#007DF8" block-size="18" :min="10" :max="36"/>
					<text>A+</text>
				</view>
				<view class="background">
					<view @click="chooseBg(item)" class="one" v-for="(item, index) in bgList" :key="index" :style="{background: item, border: item == background ? '1px solid #C4C4C4' : 'none'}"></view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="狠心放弃" confirmText="立即重置" title="通知" content="该章节是会员章节,成为会员免费观看站内所有书籍!" @confirm="dialogConfirm"
				@close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: [],
				bookId: '',
				chapterId: '',
				chapterList: [],
				chapterInfo: {},
				bookInfo: {},
				fontSize: 16,
				light: 20,
				bgList: ['#fff', '#FFEED1', '#E2FFCC', '#232323'],
				background: '#fff',
				index: 1,
				scrollTop: 0,
			}
		},
		onLoad(options) {
			console.log(options)
			this.bookId = options.id
			this.chapters(options.chapterId)
			this.novelInfo()
		},
		mounted() {
			// this.set()
			this.getScreenBrightness()
		},
		onReachBottom() {
			console.log('onReachBottom')
			this.index += 1
			this.chapterList.forEach(v => {
				if(v.displayOrder == this.index) {
					this.chapterId = v.chapterId
					this.chapterInfo = v
					this.getDetail()
				}
			})
		},
		onPullDownRefresh() {
			console.log('onPullDownRefresh')
			console.log(this.index)
			if(this.index > 1) {
				this.index -= 1
				this.chapterList.forEach(v => {
					if(v.displayOrder == this.index) {
						this.chapterId = v.chapterId
						this.chapterInfo = v
						this.getDetail('unshift')
					}
				})
			} else {
				uni.stopPullDownRefresh()
			}
		},
		methods: {
			getScreenBrightness() {
				uni.getScreenBrightness({
					success: res => {
						console.log('屏幕亮度值：' + res.value);
						this.light = res.value * 100
					}
				});
			},
			chapters(chapterId = '') {
				this.$api.chapters({
					bookId: this.bookId,
				}).then(res => {
					console.log(res)
					this.chapterList = res.data.data
					if(chapterId) {
						this.chapterList.forEach((v,i) => {
							console.log(v)
							if(v.chapterId == chapterId) {
								this.chapterInfo = v
								this.chapterId = v.chapterId
								this.index = v.displayOrder
							}
						})
					} else {
						this.chapterInfo = res.data.data[0]
						this.chapterId = res.data.data[0].chapterId
						this.index = res.data.data[0].displayOrder
					}
					
					if(!this.chapterId){
						this.chapterInfo = res.data.data[0]
						this.chapterId = res.data.data[0].chapterId
						this.index = res.data.data[0].displayOrder
					}
					
					this.getDetail()
				}).catch(err => {
					console.log(err)
				})
			},
			novelInfo() {
				this.$api.novelInfo({
					bookId: this.bookId,
				}).then(res => {
					console.log(res)
					this.bookInfo = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			getDetail(mark = '') {
				this.$api.chapterInfo({
					bookId: this.bookId,
					chapterId: this.chapterId,
				}).then(res => {
					console.log(res)
					if(res.code == 0) {
						res.data.content.replace(/\\n/g, "\n");
						if(mark) {
							if(mark == 'mark') {
								
								this.content = [{
									content: res.data.content,
									title: this.chapterInfo.chapterTitle
								}]
								this.$nextTick(() => {
									wx.pageScrollTo({
										scrollTop: 0, // 滚动到的位置（距离顶部 px）
										duration: 0, //滚动所需时间 如果不需要滚动过渡动画，设为0（ms）
										success: res => {
											console.log('滚')
											console.log(res)
										},
										fail: err => {
											consol.elog(err)
										}
									})
								})
							} else {
								// 上拉加载上一章
								this.content.unshift({
									content: res.data.content,
									title: this.chapterInfo.chapterTitle
								})
							}
						} else {
							this.content.push({
								content: res.data.content,
								title: this.chapterInfo.chapterTitle
							})
						}
					} else if (res.code == 'account_not_VIP') {
						this.$refs.alertDialog.open()
					} else {
						uni.showToast({
							title: res.msg || '网络错误',
							icon: 'none'
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
			showMore() {
				this.$refs.popup.open('bottom')
			},
			getChapterList() {
				this.$refs.popup.close()
				this.$refs.popup1.open('left')
				this.scrollTo()
			},
			set() {
				this.$refs.popup.close()
				this.$refs.popup2.open('bottom')
			},
			sliderChange(e) {
				uni.setScreenBrightness({
					value: e.detail.value / 100,
					success: function () {
						console.log('success');
					}
				});
			},
			sliderChange1(e) {
				this.fontSize = e.target.value
			},
			chooseBg(item) {
				this.background = item
			},
			back() {
				uni.navigateBack()
			},
			scan(item) {
				this.chapterInfo = item
				this.chapterId = item.chapterId
				this.index = item.displayOrder
				this.$refs.popup1.close()
				this.getDetail('mark')
			},
			next(i) {
				if(this.index == 1 && i == -1) return
				this.index += i
				this.chapterList.forEach(v => {
					if(v.displayOrder == this.index) {
						this.chapterId = v.chapterId
						this.chapterInfo = v
						this.$refs.popup.close()
						this.getDetail('mark')
					}
				})
			},
			addStore() {
				this.$api.userNovelShelfAdd({
					bookId: this.bookId
				}).then(res => {
					console.log(res)
					this.$refs.popup.close()
					uni.showToast({
						title: '添加成功',
						icon: 'none'
					})
				}).catch(err => {
					console.log(err)
				})
			},
			goTo() {
				uni.navigateTo({
					url: '/pages/service/store'
				})
			},
			dialogConfirm() {
				uni.navigateTo({
					url: '/pages/service/novelVIP'
				})
			},
			dialogClose() {},
			scrollTo() {
				let id = this.chapterId, _this = this
				// 1.使用wx.createSelectorQuery()查询到需要滚动到的元素位置
				wx.createSelectorQuery().select('#chapterID' + id).boundingClientRect(res => {
				  // 到这里，我们可以从res中读到class为bb4的top，即离顶部的距离（px）
				  // 2使用wx.pageScrollTo()将页面滚动到对应位置
				  console.log(res)
				  _this.scrollTop = res.top
				  // wx.pageScrollTo({
				  //   scrollTop: res.top, // 滚动到的位置（距离顶部 px）
				  //   duration: 0 //滚动所需时间 如果不需要滚动过渡动画，设为0（ms）
				  // })
				}).exec()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page1 {
		background: #fff;
		padding: 15px;

		.content {
			min-height: 100vh;
			
			.one {
				margin-bottom: 15px;      
			}
			.title {
				margin-bottom: 8px;
				text-align: center;
				font-weight: bold;
			}
		}
	}

	.centerArea {
		height: 100px;
		position: fixed;
		top: calc(50% - 75px);
		left: 0;
		width: 100%;
	}

	.popupContent {
		display: flex;
		justify-content: space-around;
		padding: 10px 12px;

		.one {
			display: flex;
			flex-direction: column;
			align-items: center;

			image {
				width: 20px;
				height: 20px;
			}

			text {
				font-size: 12px;
			}
		}
	}

	.to {
		position: fixed;
		bottom: 100px;
		background: #fff;
		width: 80%;
		left: 10%;
		display: flex;
		height: 40px;
		align-items: center;
		padding: 0 15px;
		justify-content: space-between;
		font-size: 12px;
		border-radius: 10px;
		
		.left,
		.right {
			font-size: 10px;
			height: 100%;
			display: flex;
			align-items: center;
			
			image {
				width: 7px;
				height: 7px;
			}
		}
	}
	
	.addStore {
		position: fixed;
		right: 0;
		background: #fff;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		height: 30px;
		padding: 0 12px;
		font-size: 14px;
		text-align: center;
		bottom: 200px;
		line-height: 30px;
	}
	
	.popupContent1 {
		height: 100vh;
		width: 620rpx;
		
		.bookInfo {
			display: flex;
			padding: 15px;
			background: #DFEEFF;
			
			image {
				width: 75px;
				height: 100px;
				flex-grow: 0;
				flex-shrinl: 0;
				margin-right: 8px;
			}
			
			.right {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				
				.name {
					font-size: 18px;
					font-weight: bold;
				}
				
				.author {
					font-size: 12px;
				}
				
				.chapter {
					font-size: 10px;
				}
			}
		}
		
		.scroll-Y {
			width: 100%;
			height: calc(100vh - 130px);
		}
		
		.one {
			margin-bottom: 15px;
			font-size: 14px;
			padding-left: 15px;
			
			&.active {
				color: #007DF8;
			}
		}
	}
	
	.popupContent2 {
		padding: 10px 15px 30px;
		
		.light {
			display: flex;
			height: 40px;
			align-items: center;
			margin-bottom: 10px;
			
			image {
				width: 20px;
				height: 20px;
			}
			
			slider {
				flex:1;
			}
		}
		
		.background {
			display: flex;
			justify-content: space-between;
			
			.one {
				width: 20%;
				height: 20px;
				border-radius: 5px;
			}
		}
	}
</style>
