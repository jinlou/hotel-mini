import {baseURL} from './baseURL.js'
console.log(baseURL)

const httpRequest = (opts, data) => {
	// 如果是在接口后面加上参数的话，使用query字段
	if (opts.query) {
		opts.url = opts.url + '/' + opts.query
	}

	let httpDefaultOpts = {
		url: baseURL + opts.url,
		data: data,
		method: opts.method || 'get',
		header: opts.method == 'get' ? {
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		} : {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		dataType: 'json',
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request(httpDefaultOpts).then(
			(res) => {
				if (res[1] && (res[1].statusCode == 200 || res[1].statusCode == 201)) {
					resolve(res[1].data)
				} else {
					reject(res)
				}
			}
		).catch(
			(response) => {
				reject(response)
			}
		)
	})
	return promise
};

//带Token请求
const httpTokenRequest = (opts, data) => {
	// 如果是在接口后面加上参数的话，使用query字段
	if (opts.query) {
		opts.url = opts.url + '/' + opts.query
	}
	let token = uni.getStorageSync('token')

	if (token) {
		let httpDefaultOpts = {
			url: baseURL + opts.url,
			data: data,
			method: opts.method,
			header: opts.method == 'get' ? {
				'Cookie': token,
				'X-Requested-With': 'XMLHttpRequest',
				"Accept": "application/json",
				"Content-Type": "application/json; charset=UTF-8"
			} : {
				'Cookie': token,
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': opts.payload ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			dataType: 'json',
		}
		let promise = new Promise(function(resolve, reject) {
			uni.request(httpDefaultOpts).then(
				(res) => {
					if (res[1].header.hasOwnProperty('expired') && res[1].header['expired'] === 'true') {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					} else {
						if (res[1] && (res[1].statusCode == 200 || res[1].statusCode == 201)) {
							resolve(res[1].data)
						} else {
							reject(res)
						}
					}
				}
			).catch(
				(response) => {
					reject(response)
				}
			)
		})
		return promise
	} else {
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}
};

// 上传图片（意见反馈）
const uploadImage = (files) => {
	let token = uni.getStorageSync('token')
	if (token) {
		let httpDefaultOpts = {
			url: baseURL + '/wxapp/fdu/wx-upload',
			filePath: files,
			name: 'file',
			formData: {
				group_id: 0,
				wxapp: 'wxapp'
			},
			header: {
				'Cookie': token,
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'multipart/form-data',
			},
		}
		let promise = new Promise(function(resolve, reject) {
			uni.uploadFile(httpDefaultOpts).then(
				(res) => {
					if (res[1].header.hasOwnProperty('expired') && res[1].header['expired'] === 'true') {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					} else {
						if (res[1] && (res[1].statusCode == 200 || res[1].statusCode == 201)) {
							resolve(res[1].data)
						} else {
							reject(res)
						}
					}
				}
			).catch(
				(response) => {
					reject(response)
				}
			)
		})
		return promise
	} else {
		uni.navigateTo({
			url: '/pages/login/login'
		})
	}
};

export default {
	baseURL,
	httpRequest,
	httpTokenRequest,
	uploadImage
}
