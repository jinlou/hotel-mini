import axios from "./axios.js"
export default {
	// 扫码获取房间信息
	getHotelRoomID (params){
		return axios.httpTokenRequest({
			url: `/hotel/room/${params.roomId}`,
		}, params)
	},
	// 投诉建议类型房间号
	getComplainInfo (params){
		return axios.httpTokenRequest({
			url: '/complain/info',
		}, params)
	},
	
}