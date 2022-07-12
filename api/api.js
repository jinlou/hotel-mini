import axios from "./axios.js"
export default {
	// 小程序登录
	adminAuthLogin (params){
	  return axios.httpRequest({
	    url: `/api/auth/miniprogramLogin`,
	    method: 'post'
	  }, params)
	},
	// 小程序注册
	miniprogramRegister (params){
	  return axios.httpRequest({
	    url: `/api/auth/miniprogramRegister`,
	    method: 'post'
	  }, params)
	},
	// 上传图片
	uploadImg (params){
	  return axios.httpTokenRequest({
	    url: `/upload/file/image`,
	    method: 'post'
	  }, params)
	},
	// 批量上传图片
	bathImage (params){
	  return axios.httpTokenRequest({
	    url: `/upload/file/bathImage`,
	    method: 'post'
	  }, params)
	},
	// 扫码获取房间信息
	getHotelRoomID (params){
		return axios.httpTokenRequest({
			url: `/api/v1/device/${params.roomId}`,
		}, params)
	},
	// 获取用户服务列表 
	getServeiceList (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/service/list`,
		}, params)
	},
	// 投诉建议类型
	getComplainTypes (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/room/complain/${params.roomId}`,
		}, params)
	},
	// 投诉建议提交
	postComplain (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/room/complainAdd`,
			method: 'post'
		}, params)
	},
	// 在线续住
	hotelStay (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/room/hotelStay/${params.roomId}`,
		}, params)
	},
	// 在线续住申请
	applyHotelStay (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/room/applyHotelStay`,
			method: 'post'
		}, params)
	},
	// 可送物品
	roomItems (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/room/items`,
		}, params)
	},
	// 房间送物
	roomSendItems (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/room/sendItems`,
			method: 'post'
		}, params)
	},
	// 客房清扫
	roomClean (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/room/clean`,
			method: 'post'
		}, params)
	},
	// 叫醒服务
	roomWakeUpCall (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/room/wakeUpCall`,
			method: 'post'
		}, params)
	},
	// 叫醒服务
	roomWakeUpCall (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/room/wakeUpCall`,
			method: 'post'
		}, params)
	},
	// 个人发票
	personageInvoice (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/room/bookingInvoice/personage`,
			method: 'post'
		}, params)
	},
	// 企业发票
	companyInvoice (params){
		return axios.httpTokenRequest({
			url: `/api/v1/hotel/room/bookingInvoice/company`,
			method: 'post'
		}, params)
	},
	// 商品列表
	getGoodsList (params){
		return axios.httpTokenRequest({
			url: `/api/v1/goods/list`,
		}, params)
	},
	// 订单列表
	getOrderList (params){
		return axios.httpTokenRequest({
			url: `/api/v1/order/list`,
		}, params)
	},
	// 订单详情
	getOrderInfo (params){
		return axios.httpTokenRequest({
			url: `/api/v1/order/info`,
		}, params)
	},
	// 提交订单
	submitAccount (params){
		return axios.httpTokenRequest({
			url: `/api/v1/order/create`,
			method: 'post'
		}, params)
	},
	// 取消订单
	cancelOrder (params){
		return axios.httpTokenRequest({
			url: `/api/v1/order/cancel`,
			method: 'post'
		}, params)
	},
	// 确认订单
	confirmReceipt (params){
		return axios.httpTokenRequest({
			url: `/api/v1/order/confirmReceipt`,
			method: 'post'
		}, params)
	},
	// 预支付
	prepay (params){
		return axios.httpTokenRequest({
			url: `/api/pay/weChat/jsapi`,
			method: 'post'
		}, params)
	},
	// 充电时长
	checkExp (params){
		return axios.httpTokenRequest({
			url: `/api/v1/charge/checkExp`
		}, params)
	},
	// 提前结束充电
	endCharge (params){
		return axios.httpTokenRequest({
			url: `/api/v1/charge/end`,
			method: 'post'
		}, params)
	},
	// 关于我们
	aboutUs (params){
		return axios.httpRequest({
			url: `/api/article/aboutUs`,
		}, params)
	},
	// 用户协议
	userAgreement (params){
		return axios.httpRequest({
			url: `/api/article/userAgreement`,
		}, params)
	},
	// 常见问答
	QandA (params){
		return axios.httpRequest({
			url: `/api/article/QandA`,
		}, params)
	},
	// 问答详情
	answer (params){
		return axios.httpRequest({
			url: `/api/article/answer`,
		}, params)
	},
	
}