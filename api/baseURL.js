let url
if (process.env.NODE_ENV === 'development') {
	console.log('开发环境')
	url = 'https://dev.qyqycp.com'
} else {
	console.log('生产环境')
	url = 'https://dev.qyqycp.com'
}

export const baseURL = url
