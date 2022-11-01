<template>
	<view class="content">
		
	</view>
</template>

<script>
	import {baseURL} from '@/api/baseURL.js'
	export default {
		data() {
			return {
			}
		},
		components: {
			Room
		},
		onLoad(options) {
			console.log(options)
		},
		mounted() {
			this.getComplainTypes()
		},
		methods: {
			scanCode() {
				uni.scanCode({
					scanType: ['qrCode'],
					success: res => {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					},
					fail: err => {
						console.log(err)
						uni.showToast({
							icon: 'none',
							title: '扫码失败'
						})
					}
				})
			},
			chooseType(item) {
				this.type = item.id
			},
			chooseImage() {
				uni.chooseImage({
					count: 4, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: res => {
						console.log(res);
						console.log(JSON.stringify(res.tempFilePaths));
						res.tempFiles.forEach(v => {
							if(v.size < 10*1024*1024) {
								this.imgsList.push(v.path)
							} else {
								uni.showToast({
									icon: 'none',
									title: '已过滤掉大于10M的图片'
								})
							}
						})
					}
				});
			},
			deleteOne(i) {
				this.imgsList.splice(i, 1)
			},
			getComplainTypes() {
				this.$api.getComplainTypes({
					roomId: uni.getStorageSync('roomInfo').roomId
				}).then(res => {
					if (res.code == 0) {
						this.typeList = res.data.complainType
						this.type = this.typeList[0].id
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			bathImage() {
				if (!this.content.trim()) {
					uni.showToast({
						icon: 'none',
						title: '请描述问题'
					})
					return
				}

				let _this = this,
					promiseArr = []
				for (let i = 0; i < this.imgsList.length; i++) {
					let promise = new Promise((resolve, reject) => {
						wx.uploadFile({
							url: baseURL + '/upload/file/image',
							filePath: _this.imgsList[i],
							name: 'image',
							success(res) {
								console.log(res)
								console.log(JSON.parse(res.data))
								console.log(JSON.parse(res.data).data.url)
								resolve(JSON.parse(res.data).data.url)
							},
							fail(err) {
								console.log(err)
								reject(err)
							}
						})
					})
					promiseArr.push(promise)
				}

				Promise.all(promiseArr).then(res => {
					console.log(res)
					_this.submit(res)
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			submit(res) {
				this.$api.postComplain({
					hotelRoomId: uni.getStorageSync('roomInfo').roomId,
					contactNumber: uni.getStorageSync('userInfo').phone,
					content: this.content,
					type: this.type,
					images: res,
				}).then(res => {
					if (res.code == 0) {
						uni.showToast({
							icon: 'none',
							title: '服务已提交，请稍后…'
						})
						wx.requestSubscribeMessage({
							tmplIds: this.$serviceIDs,
							success(res) {
								console.log(res)
							},
							complete() {
								uni.navigateBack()
							}
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
