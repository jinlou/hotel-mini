let url
if (process.env.NODE_ENV === 'development') {
	console.log('开发环境')
	url = 'http://development.hyperfshop.com/api/v1'
} else {
	console.log('生产环境')
	url = 'https://data.mipsyun.com'
}

export const baseURL = url
