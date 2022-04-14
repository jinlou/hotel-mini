<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			userInfo: {},
			text: 1
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import '/static/css/common.css'
</style>
