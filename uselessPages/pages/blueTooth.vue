<template>
	<view class="page">
		<image src="@/static/image/bg1.jpg" mode="" class="bg"></image>
		<view class="chargeList">
			<!-- <uni-search-bar @confirm="search" :focus="true" v-model="searchValue"
				@cancel="cancel" @clear="clear">
			</uni-search-bar> -->
			<scroll-view class="device_list" scroll-y scroll-with-animation style="height: calc(100% - 60px);">
				<view v-for="(item, index) in devices" :key="index" :data-device-id="item.deviceId"
					:data-name="item.name || item.localName" class="device_item" hover-class="device_item_hover">
					<view class="">
						<view style="font-size: 16px; color: #333;">{{item.name}}</view>
						<view style="font-size: 10px">信号强度: {{item.RSSI}}dBm
							({{(item.RSSI + 100) > 0 ?(item.RSSI + 100) : 0}}%)</view>
						<!-- <view style="font-size: 10px">信号强度: {{item.RSSI}}dBm ({{max(0, item.RSSI + 100)}}%)</view> -->
						<view style="font-size: 10px">UUID: {{item.deviceId}}</view>
						<!-- <view style="font-size: 10px">Service数量: {{item.advertisServiceUUIDs}}</view> -->
						<!-- <view style="font-size: 10px">Service数量: {{len(item.advertisServiceUUIDs)}}</view> -->
					</view>
					<view>
						<view class="btn" @click="stop(item)">结束充电</view>
						<!-- <view class="btn" @click="createBLEConnection(item)">一键连接</view> -->
						<view class="btn" @click="createBLEConnection(item)">一键连接</view>
					</view>
				</view>
			</scroll-view>
			<Button v-if="connected" @click="stop()">结束充电</Button>
			<Button @click="init()">重新搜索</Button>
		</view>
	</view>
</template>

<script>
	// ArrayBuffer转16进度字符串示例
	function ab2hex(buffer) {
		var hexArr = Array.prototype.map.call(
			new Uint8Array(buffer),
			function(bit) {
				return ('00' + bit.toString(16)).slice(-2)
			}
		)
		return hexArr.join('');
	}

	function max(n1, n2) {
		return Math.max(n1, n2)
	}

	function len(arr) {
		arr = arr || []
		return arr.length
	}


	function inArray(arr, key, val) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i][key] === val) {
				return i;
			}
		}
		return -1;
	}
	export default {
		data() {
			return {
				blueToothName: '小智',
				command: 'FA0401',
				lastCommand: '0000',
				msg: '',
				stopTime: 'FA04010000487248060000',
				searchValue: '',
				devices: [{
					name: '11'
				}],
				connected: false,
				chs: [],
				name: '',
				deviceId: '',
				serviceId: '',
				characteristicIdR: '',
				characteristicIdW: '',
				characteristicIdN: '',
				onBLECharacteristicValueChanged: false,
				charges: [{
						type: '0H',
						value: '0xFF 0xAA 0x02 0xA0 0x00 0xA2'
					},
					{
						type: '1H',
						value: '0xFF 0xAA 0x02 0xA0 0x01 0xA3'
					},
					{
						type: '2H',
						value: '0xFF 0xAA 0x02 0xA0 0x02 0xA4'
					},
					{
						type: '3H',
						value: '0xFF 0xAA 0x02 0xA0 0x03 0xA5'
					},
					{
						type: '4H',
						value: '0xFF 0xAA 0x02 0xA0 0x04 0xA6'
					},
					{
						type: '5H',
						value: '0xFF 0xAA 0x02 0xA0 0x05 0xA7'
					},
					{
						type: '6H',
						value: '0xFF 0xAA 0x02 0xA0 0x06 0xA8'
					},
					{
						type: '7H',
						value: '0xFF 0xAA 0x02 0xA0 0x07 0xA'
					},
					{
						type: '8H',
						value: '0xFF 0xAA 0x02 0xA0 0x08 0xA2'
					},
				]
			}
		},
		onLoad() {

		},
		mounted() {
			this.init()
		},
		methods: {
			getNum(hex) {
				// 传入"B7 D4", 翻转去除空格"4D7B", 结果19835
				let str = hex.split('').reverse().join('');
				let decimalism = str.replace(/\s/g, "");
				let res = parseInt(decimalism, 16)
				console.log("16转10的值: ", parseInt(decimalism, 16)); //十六进制转十进制
				return String(res).slice(-8)
			},
			getNum16(num) {
				console.log('num:', num.toString(16).toUpperCase())
				let head = ''
				for (let i = 0; i < 4 - num.toString(16).toUpperCase().length; i++) {
					head += '0'
				}
				console.log(head)
				console.log(head + num.toString(16).toUpperCase())
				return head + num.toString(16).toUpperCase()
			},
			search() {
				
				this.devices = []
				this.connected = false
				this.name = ''
				this.init()
			},
			clear(res) {
				console.log(res)
				uni.showToast({
					title: 'clear事件，清除值为：' + res.value,
					icon: 'none'
				})
				this.searchValue = ''
			},
			cancel(res) {
				console.log(res)
			},
			getBluetoothAdapterState() {
				let _this = this
				wx.getBluetoothAdapterState({
					success: (res) => {
						console.log('getBluetoothAdapterState', res)
						if (res.discovering) {
							this.onBluetoothDeviceFound()
						} else if (res.available) {
							this.startBluetoothDevicesDiscovery()
						}
					}
				})
			},
			ab2hex(buffer) {
				var hexArr = Array.prototype.map.call(
					new Uint8Array(buffer),
					function(bit) {
						return ('00' + bit.toString(16)).slice(-2)
					}
				)
				return hexArr.join('');
			},
			init() {
				let _this = this
				wx.openBluetoothAdapter({
					success: (res) => {
						console.log('openBluetoothAdapter success', res)
						_this.startBluetoothDevicesDiscovery()
					},
					fail: (res) => {
						console.log(res)
						uni.showToast({
							title: '请检查蓝牙是否开启',
							icon: 'none'
						})
						if (res.errCode === 10001) {
							wx.onBluetoothAdapterStateChange(function(res) {
								console.log('onBluetoothAdapterStateChange', res)
								if (res.available) {
									_this.startBluetoothDevicesDiscovery()
								}
							})
						}
					}
				})
			},
			startBluetoothDevicesDiscovery() {
				if (this._discoveryStarted) {
					return
				}
				this._discoveryStarted = true
				wx.startBluetoothDevicesDiscovery({
					allowDuplicatesKey: true,
					success: (res) => {
						console.log('startBluetoothDevicesDiscovery success', res)
						this.onBluetoothDeviceFound()
					},
				})
			},
			onBluetoothDeviceFound() {
				let _this = this
				wx.onBluetoothDeviceFound((res) => {
					let devicesIdArr = []
					this.devices.forEach(v => {
						devicesIdArr.push(v.deviceId)
					})
					if (devicesIdArr.indexOf(res.devices[0].deviceId) == -1) {
						if (!res.devices[0].name && !res.devices[0].localName) {
							return
						}
						this.devices.push(res.devices[0])
					}
					if (res.devices[0].name == _this.blueToothName || res.devices[0].localName == _this
						.blueToothName) {
						console.log('找到小智了~~~~~~~~~~')
						this.createBLEConnection(res.devices[0])
					}
				})
			},
			createBLEConnection(e) {
				console.log(e)
				const deviceId = e.deviceId
				const name = e.name
				uni.showLoading({
					title: '正在连接中'
				})
				wx.createBLEConnection({
					deviceId,
					success: (res) => {
						console.log('连接蓝牙1~~~~~~')
						console.log(res)
						this.connected = true
						this.name = name
						this.deviceId = deviceId
						uni.hideLoading()
						uni.showToast({
							title: '已连接到' + name,
							icon: 'none'
						})

						this.getBLEDeviceServices(deviceId)
					},
					fail: () => {
						uni.hideLoading()
						uni.showToast({
							title: '连接失败',
							icon: 'none'
						})
					}
				})
				wx.stopBluetoothDevicesDiscovery()
			},
			closeBLEConnection() {
				wx.closeBLEConnection({
					deviceId: this.data.deviceId
				})

				this.connected = false
				this.chs = []
				this.canWrite = false
			},
			getBLEDeviceServices() {
				wx.getBLEDeviceServices({
					deviceId: this.deviceId,
					success: (res) => {
						console.log('onBLECharacteristicValueChange: deviceId')
						console.log(this.deviceId)
						for (let i = 0; i < res.services.length; i++) {
							if (res.services[i].isPrimary) {
								console.log('uuid:')
								console.log(res)
								console.log(res.services[i].uuid)
								this.serviceId = res.services[i].uuid
								this.getBLEDeviceCharacteristics(this.deviceId, res.services[i].uuid)
								return
							}
						}
					}
				})
			},
			getBLEDeviceCharacteristics(deviceId, serviceId) {
				let _this = this
				wx.getBLEDeviceCharacteristics({
					deviceId,
					serviceId,
					success: (res) => {
						console.log('getBLEDeviceCharacteristics success', res.characteristics)
						
						for (let i = 0; i < res.characteristics.length; i++) {
							let item = res.characteristics[i]
							console.log(item)
							if(item.uuid.includes('FFF2') && item.properties.write) {
								_this.characteristicIdW = item.uuid
							}
							
							if(item.uuid.includes('FFF1') && (item.properties.notify || item.properties.indicate)) {
								wx.notifyBLECharacteristicValueChange({
									deviceId,
									serviceId,
									characteristicId: item.uuid,
									state: true,
									success: function(res1) {
										console.log('订阅成功 success', res1.errMsg)
										console.log(res1)
										_this.characteristicIdN = item.uuid
									},
									fail: err => {
										console.log('notifyBLECharacteristicValueChange fail')
										console.log(err)
									}
								})
							}
						}
					},
					fail(res) {
						console.error('getBLEDeviceCharacteristics', res)
					}
				})
				
				wx.onBLECharacteristicValueChange((characteristic) => {
					console.log('onBLECharacteristicValueChange:')
					console.log(characteristic.value)
					console.log(this.ab2hex(characteristic.value))
					if(this.ab2hex(characteristic.value)) {
						console.log(this.getNum(this.ab2hex(characteristic.value)))
						console.log(parseInt(this.ab2hex(characteristic.value), 16))
						let msg = String(parseInt(this.ab2hex(characteristic.value), 16)).slice(-8)
						console.log('动态命令：' + msg)
						this.writeBLECharacteristicValue(msg,deviceId,serviceId)
					}
					// this.getBLEDeviceServices()
					
				})
			},
			onBLECharacteristicValueChange(deviceId,serviceId,characteristicId) {
				// if(this.onBLECharacteristicValueChanged) return
				// this.onBLECharacteristicValueChanged = true
				// 操作之前先监听，保证第一时间获取数据
				wx.onBLECharacteristicValueChange((characteristic) => {
					console.log('onBLECharacteristicValueChange:')
					console.log(characteristic.value)
					console.log(this.ab2hex(characteristic.value))
					console.log(this.getNum(this.ab2hex(characteristic.value)))
					console.log(parseInt(this.ab2hex(characteristic.value), 16))
					// this.getBLEDeviceServices()
					// this.writeBLECharacteristicValue(String(parseInt(this.ab2hex(characteristic.value), 16)).slice(
					// 	-8),deviceId,serviceId,characteristicId)
				})
			},
			string2buffer(str) {
				let val = ""
				if (!str) return;
				let length = str.length;
				let index = 0;
				let array = []
				while (index < length) {
					array.push(str.substring(index, index + 2));
					index = index + 2;
				}
				val = array.join(",");
				// 将16进制转化为ArrayBuffer
				return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function(h) {
					return parseInt(h, 16)
				})).buffer
			},
			writeBLECharacteristicValue(num,deviceId,serviceId) {
				let _this = this
				console.log('write')
				console.log(num)
				// 向蓝牙设备发送一个0x00的16进制数据
				// let buffer = new ArrayBuffer(1)
				// let buffer = new ArrayBuffer('0xFF 0xAA 0x02 0xA0 0x02 0xA4')
				// console.log(buffer)
				// let dataView = new DataView(buffer)
				// dataView.setUint(0, Math.random() * 255 | 0)
				let value = this.connected ? (this.command + this.getNum16(2) + num + this.lastCommand) : (this.command +
					this.getNum16(0) + num + this.lastCommand)
				console.log('this.connected:', this.connected)
				console.log('value:', value)
				let newVal = this.string2buffer(value)
				// console.log('newVal:', newVal)
				// let b = []
				// for (let i = 0; i < value.length; i += 2) {
				// 	b.push('0x' + value[i] + value[i + 1])
				// }
				// console.log(b)

				// let buffer = new ArrayBuffer(11)
				// let dataView = new DataView(buffer)
				// // dataView.setUint8(0, value)
				// for (let i = 0; i < b.length; i++) {
				// 	dataView.setUint8(i, b[i])
				// }
				// console.log('buffer:', buffer)
				// console.log('deviceId:', this.deviceId)
				// console.log('serviceId:', this.serviceId)
				// console.log('characteristicId:', this.characteristicId)
				console.log('deviceId:', deviceId)
				console.log('serviceId:', serviceId)
				console.log('characteristicIdW:',  _this.characteristicIdW)
				console.log('characteristicIdR:',  _this.characteristicIdR)
				console.log('characteristicIdN:',  _this.characteristicIdN)
				console.log('newVal:',  newVal, typeof newVal)
				
				// let hex = value
				// var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
				//             return parseInt(h, 16)
				//         }))
				// console.log(typedArray)
				// var buffer1 = typedArray.buffer
				// console.log(buffer1)
				wx.writeBLECharacteristicValue({
					// deviceId: this.deviceId,
					// serviceId: this.serviceId,
					// characteristicId: this.characteristicId,
					deviceId,
					serviceId,
					characteristicId: _this.characteristicIdW,
					value: newVal,
					// value: '(0x)FF-AA-02-A0-02-02',
					// value: '(0x)FF-AA-02-A0-00-00',
					success: res => {
						console.log('write success')
						console.log(res)
					},
					fail: err => {
						console.log('write fail')
						console.log(err)
					}
				})
				console.log(this.devices)
			},
			stop() {
				wx.writeBLECharacteristicValue({
					deviceId: this._deviceId,
					serviceId: this._serviceId,
					characteristicId: this._characteristicId,
					// value: '(0x)FF-AA-02-A0-02-02',
					value: 'FA04010000487248060000',
				})
			},
			closeBluetoothAdapter() {
				wx.closeBLEConnection({
				  deviceId: this.deviceId
				})
				wx.closeBluetoothAdapter()
				this._discoveryStarted = false
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		position: relative;
		background: #bcbcbc;
		min-height: 100vh;

		.bg {
			width: 100%;
			height: 220rpx;
		}

		.chargeList {
			position: fixed;
			height: calc(100% - 156rpx);
			width: 100%;
			top: 156rpx;
			z-index: 2;
			border-top-left-radius: 60rpx;
			border-top-right-radius: 60rpx;
			background: #fff;
			padding: 40rpx 30rpx;
		}

		.device_item {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.btn {
			height: 60rpx;
			padding: 0 30rpx;
			line-height: 60rpx;
			font-size: 24rpx;
			color: #fff;
			background: #44A2FF;
			border-radius: 40rpx;
		}

	}
</style>
