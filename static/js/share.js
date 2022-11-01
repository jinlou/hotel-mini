export default {
	data() {
		return {
		   //这个share可以在每个页面的data中设置相应的转发内容
			share:{
				title: '久电科技',
				path: '/pages/index/index',
			}
		}
	},
	onShareAppMessage(res) {
		return {
			title: this.share.title,
			path: this.share.path,
			imageUrl: 'https://jdguanjia.jdkeji.top/static/favorable_reception/share.jpg',
			desc: '为酒店创新赋能，让客房不止于客房',
			// content: this.share.content,
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		}

	}
}

