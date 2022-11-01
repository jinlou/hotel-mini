<template>
	<view class="page">
		<image src="@/static/image/bg1.jpg" mode="" class="bg"></image>
		<view class="chargeList" v-if="surplus <= 0">
			<view class="one" @click="connectBLEExp()">
				<image src="@/static/image/charge_free.png" mode=""></image>
				<view class="txt">
					<image src="@/static/image/charge_free1.png" mode=""></image>
					<text class="goodsName black">免费充电</text>
					<text class="title black">新用户可免费充电五分钟</text>
				</view>
				<view class="btn black">立即充电</view>
			</view>
			<view class="one" v-for="(item, index) in chargeList" :key="index" @click="connectBLEPay()">
				<image src="@/static/image/charge_bg_new.png" mode=""></image>
				<view class="txt last">
					<text class="goodsName">付费充电
						<text style="font-size: 12px;">({{chargePrice}}元/小时)</text>
					</text>
					<text class="title black">若中途充电中断，可再次扫码使用</text>
				</view>
				<view class="btn">立即充电</view>
			</view>
			<view class="tips">
				<view class="notice">
					充电说明：
				</view>
				<view class="tip">
					1、若设备无响应请确保手机蓝牙开启，以及设备的电源指示灯亮起。若中途充电中断，可再次扫码使用。。
				</view>
				<view class="tip">
					2、充电价格为{{price}}元/24小时，单价{{(price/5).toFixed(0)}}元/小时。结束充电后，按照实际使用时长计算订单金额并退还剩余金额。
				</view>
				<view class="tip">
					3、使用途中有任何疑问，可拨打400 023 1113咨询客服。
				</view>
			</view>
		</view>
		<view class="chargeList" v-else>
			<view class="has">
				<view class="title">
					剩余充电时间：
				</view>
				<uni-countdown class="time" :minute="surplus" :showDay="false">
				</uni-countdown>
			</view>
			<view class="btns">
				<view class="one1">
					<image src="@/static/image/charge_continue.png" mode="" @click="connectBLECon()"></image>
					<view class="txt blue">继续充电</view>
				</view>
				<view class="one1">
					<image src="@/static/image/charge_end.png" mode="" @click="endCharge()"></image>
					<view class="txt red">结束充电</view>
				</view>
			</view>
			<view class="tips">
				<view class="notice">
					充电说明：
				</view>
				<view class="tip">
					1、若设备无响应请确保手机蓝牙开启，以及设备的电源指示灯亮起。若中途充电中断，可再次扫码使用。。
				</view>
				<view class="tip">
					2、充电价格为{{price}}元/24小时，单价{{(price/5).toFixed(0)}}元/小时。结束充电后，按照实际使用时长计算订单金额并退还剩余金额。
				</view>
				<view class="tip">
					3、使用途中有任何疑问，可拨打400 023 1113咨询客服。
				</view>
			</view>
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog before-close :type="msgType" :confirmText="confirmText" title="通知" :content="dialogContent" @confirm="dialogConfirm"
				@close="closeBluetoothAdapter"></uni-popup-dialog>
		</uni-popup>
		<!-- 立即支付 -->
		<uni-popup ref="alertDialog1" type="dialog">
			<uni-popup-dialog before-close :type="msgType" confirmText="重试" title="连接失败" :content="dialogContent1" @confirm="reConnectPay"
				@close="closeDialog"></uni-popup-dialog>
		</uni-popup>
		<!-- 体验 -->
		<uni-popup ref="alertDialog2" type="dialog">
			<uni-popup-dialog before-close :type="msgType" confirmText="重试" title="连接失败" :content="dialogContent1" @confirm="connectBLEExp"
				@close="closeDialog"></uni-popup-dialog>
		</uni-popup>
		<!-- 重新连接 -->
		<uni-popup ref="alertDialog3" type="dialog">
			<uni-popup-dialog before-close :type="msgType" confirmText="重试" title="连接失败" :content="dialogContent1" @confirm="reConnectCon"
				@close="closeDialog"></uni-popup-dialog>
		</uni-popup>
		<!-- 结束充电 -->
		<uni-popup ref="alertDialog4" type="dialog">
			<uni-popup-dialog before-close :type="msgType" confirmText="重试" title="连接失败" :content="dialogContent1" @confirm="reConnectEnd"
				@close="closeDialog"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {
		baseURL
	} from '@/api/baseURL.js'
	export default {
		data() {
			return {
				baseURL: baseURL + '/',
				chargeList: [],
				experienceRight: false,
				content: '',
				chargePrice: '',
				chargeTime: 'FA0401000A487248060000',
				stopTime: 'FA04010000487248060000',
				connected: false,
				searchValue: '',
				devices: [],
				chs: [],
				name: '',
				connected: false,
				chargeTimeList: [],
				surplus: 0, // 剩余时长
				blueToothName: '',
				command: 'FA0401',
				lastCommand: '0000',
				msg: '',
				deviceId: '',
				serviceId: '',
				characteristicIdR: '',
				characteristicIdW: '',
				characteristicIdN: '',
				onBLECharacteristicValueChanged: false,
				orderId: '',
				orderSn: '',
				selectDevice: {},
				needPay: false,
				needWrite: false,
				dialogContent: '',
				price: 0,
				canConnect: false, // 可以支付了
				dialogContent1: '请确认手机蓝牙是否开启，如是开启状态，请重启手机蓝牙再尝试。如还是无法连接，请检查充电设备电源指示灯是否亮起。',
				endBtn: false, // 点击的是结束充电按钮
				expBtn: false,
				conBtn: false,
				// confirmText: '连接中…',
			}
		},
		onHide() {
			console.log('离开页面了要')
			// if(this.deviceId) {
			// 	wx.offBLECharacteristicValueChange()
			// 	wx.closeBLEConnection({
			// 		deviceId: this.deviceId
			// 	})
			// }
		},
		computed: {
			confirmText() {
				return this.canConnect ? '去支付' : '连接中…'
			}
		},
		mounted() {
			let roomInfo = uni.getStorageSync('roomInfo')
			if (roomInfo && roomInfo.deviceInfo && roomInfo.deviceInfo.deviceCode) {
				this.blueToothName = roomInfo.deviceInfo.deviceCode
				// this.blueToothName = '小智'
				// // this.surplus = 0
				// this.connectBLE()
			} else {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
			// this.getChargeList()
			let hotelBranch = uni.getStorageSync('roomInfo').hotelBranch
			console.log(hotelBranch)
			console.log(hotelBranch.chargePrice)
			this.chargeList.push({
				chargePrice: hotelBranch.chargePrice,
				chargePackage24Hour: hotelBranch.chargePackage24Hour
			})
			this.chargePrice = hotelBranch.chargePrice
			// this.content = `不满一小时按一小时计算，消耗金额不超过${hotelBranch.chargePackage24Hour}元，按实际计费，自动退还未使用金额`
			this.price = hotelBranch.chargePackage24Hour
			this.checkExp()
			this.experience()
			
			let _this = this
			wx.onBLECharacteristicValueChange((characteristic) => {
				console.log('onBLECharacteristicValueChange:')
				console.log('特征值变化了')
				console.log(_this.ab2hex(characteristic.value))
				if (_this.ab2hex(characteristic.value)) {
					console. log('动态命令：' + _this.msg)
					_this.msg = String(parseInt(_this.ab2hex(characteristic.value), 16)).slice(-8)
					if(_this.expBtn) {
						_this.expBtn = false
						_this.surplus = 5
						// _this.writeBLECharacteristicValue()
						return
					}
					
					if(_this.conBtn) {
						_this.conBtn = false
						
					}
					
					if(this.needPay) {
						_this.canConnect = true
					}
					
					uni.hideLoading()
					
					
					// if(t == 0) {
					// 	_this.surplus = 0
					// 	uni.hideLoading()
					// } else if(t == -5) {
					// 	_this.surplus = -5
					// } else {
					// 	console.log('_this.canConnect:', _this.canConnect)
					// 	_this.canConnect = true
					// 	uni.hideLoading()
					// }
				}
			})
		},
		watch: {
			msg(val) {
				console.info('watch msg:', val)
				if(this.needPay) {
					// this.needPay = false
					// this.submit()
				} else {
					if(this.surplus >= 0) {
						this.writeBLECharacteristicValue()
					} else {
						this.experience()
					}
				}
			},
			
		},
		methods: {
			getChargeList() {
				this.$api.getGoodsList({
					hotelId: uni.getStorageSync('roomInfo').hotelId,
					hotelBranchId: uni.getStorageSync('roomInfo').hotelBranchId,
					goodsName: '',
					goodsType: 'charge',
				}).then(res => {
					if (res.code == 0) {
						this.chargeList = res.data.data
					} else {
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			// 点击体验充电
			connectBLEExp() {
				if(this.experienceRight) {
					this.expBtn = true
					this.connectBLE()
				} else {
					uni.showToast({
						icon: 'none',
						title: '您已体验过免费充电，请付费充电'
					})
				}
			},
			experience() {
				this.$api.experience({
					hotelId: uni.getStorageSync('roomInfo').hotelId,
					hotelBranchId: uni.getStorageSync('roomInfo').hotelBranchId,
				}).then(res => {
					console.log(11111)
					console.log(res)
					uni.hideLoading()
					if (res.code == 0) {
						this.experienceRight = res.data.experienceRight
						// if(this.experienceRight) {
						// 	this.surplus = 5
						// 	this.writeBLECharacteristicValue(5)
						// } else {
						// 	this.surplus = 0
						// 	uni.showToast({
						// 		icon: 'none',
						// 		title: '您已体验过免费充电，请付费充电'
						// 	})
						// }
					} else {
						this.surplus = 0
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					uni.hideLoading()
					this.surplus = 0
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			dialogConfirm() {
				if(this.canConnect) {
					if(this.needPay) {
						this.$refs.alertDialog.close()
						this.needPay = false
						this.submit()
					}
				} else {
					console.log('还没连接蓝牙')
				}
			},
			beforClose() {
				console.log('beforeClose')
			},
			checkExp() {
				this.$api.checkExp({
					hotelBranchId: uni.getStorageSync('roomInfo').hotelBranchId,
				}).then(res => {
					if (res.code == 0) {
						let expTime = res.data.expTime,
							now = new Date().getTime() / 1000
						if (expTime) {
							this.surplus = Math.floor((expTime - now) / 60)
							// this.connectBLE()
						}
						this.orderId = res.data.orderId
						this.orderSn = res.data.orderSn
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			endCharge() {
				// this.surplus = 0
				this.needPay = false
				this.endBtn = true
				this.connectBLE()
			},
			connectBLEPay() {
				if(this.surplus) return
				this.needPay = true
				this.connectBLE()
			},
			connectBLECon() {
				if(this.experienceRight) {
					uni.showToast({
						icon: 'none',
						title: '您已体验过免费充电，请付费充电'
					})
					return
				}
				this.conBtn = true
				this.connectBLE()
			},
			reConnectPay() {
				this.$refs.alertDialog1.close()
				this.needPay = true
				this.connectBLE()
			},
			reConnectCon() {
				this.$refs.alertDialog3.close()
				this.conBtn = true
				this.connectBLE()
			},
			reConnectEnd() {
				this.$refs.alertDialog4.close()
				this.endBtn = true
				this.connectBLE()
			},
			submit() {
				let orderGoods = {'11': 1}
				this.$api.submitAccount({
					roomId: uni.getStorageSync('roomInfo').roomId,
					hotelBranchId: uni.getStorageSync('roomInfo').hotelBranchId,
					hotelId: uni.getStorageSync('roomInfo').hotelId,
					remark: '',
					payType: 1,
					orderGoods: JSON.stringify(orderGoods)
				}).then(res => {
					if (res.code == 0) {
						this.orderId = res.data.orderId
						this.orderSn = res.data.orderSn
						this.prepay(res.data)
					} else {
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			prepay(data) {
				this.$api.prepay(data).then(res => {
					if (res.code == 0) {
						console.log(res.data.prepay_id)
						this.wxPay(res.data)
					} else {
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			wxPay(data) {
				console.log(data)
				let _this = this
				uni.requestPayment({
					provider: 'wxpay', // 服务提供商
					timeStamp: data.timestamp,
					nonceStr: data.noncestr,
					package: 'prepay_id=' + data.prepay_id,
					signType: data.signType,
					paySign: data.paySign,
					success: (res) => {
						uni.showToast({
							title: '支付成功',
							icon: 'none'
						})
						_this.connected = false
						this.surplus = 1440
						// _this.connectBLE()
						
						this.writeBLECharacteristicValue()
					},
					fail: (res) => {
						console.log(data)
						console.log(res)
						console.log(res.errMsg)
						this.needPay = false
						uni.hideLoading()
						if (res.errMsg != 'requestPayment:fail cancel') {
							uni.showToast({
								title: '支付失败，请联系管理员或稍后重试',
								icon: 'none',
								mask: true,
								duration: 2000
							})
						} else {
							uni.showToast({
								title: res.msg || '取消支付',
								icon: 'none',
								mask: true,
								duration: 2000
							})
						}
					}
				});
			},
			hexStringToArray(str) {
				var pos = 0;
				var len = str.length;
				if (len % 2 != 0) {
					return null;
				}
				len /= 2;
				var arrBytes = new Array();
				for (var i = 0; i < len; i++) {
					var s = str.substr(pos, 2);
					arrBytes.push(s);
					pos += 2;
				}
				return arrBytes;
			},
			prefixInteger2(num, n) {
		        return (Array(n).join(0) + num).slice(-n);
		    },
			crc16(str) {
				var arr = this.hexStringToArray(str)
				let crc = 0xFFFF; //初值,根据协议修改
				let i, j;
				//计算字节数
				var len = str.length;
				if (len % 2 != 0) {
					return null;
				}
				len /= 2;
				for (j = 0; j < len; j++) {
					crc = crc ^ ('0x' + arr[j]);
					for (i = 0; i < 8; i++) {
						if ((crc & 0x0001) > 0) {
							crc = crc >> 1;
							crc = crc ^ 0x4044; //校验码,根据协议修改
						} else {
							crc = crc >> 1;
						}
					}
				}
				let yu = Math.floor(crc / 256).toString(16);
				let mo = (crc % 256).toString(16);
				let crcRet = this.prefixInteger2(yu, 2) + '' + this.prefixInteger2(mo, 2);
				return crcRet.toUpperCase();
			},
			getNum(hex) {
				// 传入"B7 D4", 翻转去除空格"4D7B", 结果19835
				let str = hex.split('').reverse().join('');
				let decimalism = str.replace(/\s/g, "");
				let res = parseInt(decimalism, 16)
				console.log("16转10的值: ", parseInt(decimalism, 16)); //十六进制转十进制
				return String(res).slice(-8)
			},
			getNum16(num) {
				console.log('num:', num)
				console.log('num:', num.toString(16).toUpperCase())
				let head = ''
				for (let i = 0; i < 4 - num.toString(16).toUpperCase().length; i++) {
					head += '0'
				}
				console.log(head)
				console.log(head + num.toString(16).toUpperCase())
				return head + num.toString(16).toUpperCase()
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
			connectBLE(t) {
				let _this = this
				
				if(this.expBtn || this.conBtn || this.endBtn) {
					uni.showLoading({
						title: '蓝牙连接中…',
					})
				}
				
				wx.openBluetoothAdapter({
					success: res => {
						if(this.needPay) {
							this.dialogContent = '正在测试连接蓝牙，蓝牙连接成功后，支付' + this.price + '元即可开始充电！'
							this.$refs.alertDialog.open()
							
							let i = 0
							let timer = setInterval(() => {
								if(i < 12) {
									i++
								} else {
									console.log(i)
									if(!this.canConnect) {
										this.$refs.alertDialog.close()
										this.$refs.alertDialog1.open()
									}
									clearInterval(timer)
								}
							}, 1000)
						}
						console.log('openBluetoothAdapter success', res)
						
						wx.startBluetoothDevicesDiscovery({
							allowDuplicatesKey: true,
							services: ['0000CFF0-0000-1000-8000-00805F9B34FB'],
							success: res => {
								console.log('startBluetoothDevicesDiscovery success', res)
								wx.onBluetoothDeviceFound(onBluetoothDeviceFound => {
									console.log(onBluetoothDeviceFound)
									if (onBluetoothDeviceFound.devices[0].name == _this.blueToothName || onBluetoothDeviceFound.devices[0].localName == _this.blueToothName) {
										console.log('找到小智了~~~~~~~~~~')
										_this.selectDevice = onBluetoothDeviceFound.devices[0]
										_this.deviceId = onBluetoothDeviceFound.devices[0].deviceId
										wx.createBLEConnection({
											deviceId: _this.deviceId,
											success: createBLEConnection => {
												console.log('连接蓝牙1~~~~~~')
												console.log(createBLEConnection)
												wx.getBLEDeviceServices({
													deviceId: _this.deviceId,
													success: getBLEDeviceServices => {
														console.log('onBLECharacteristicValueChange: deviceId')
														console.log(_this.deviceId)
														for (let i = 0; i < getBLEDeviceServices.services.length; i++) {
															if (getBLEDeviceServices.services[i].isPrimary) {
																console.log('uuid:')
																console.log(getBLEDeviceServices)
																console.log(getBLEDeviceServices.services[i].uuid)
																_this.serviceId = getBLEDeviceServices.services[i].uuid
																
																wx.getBLEDeviceCharacteristics({
																	deviceId: _this.deviceId,
																	serviceId: _this.serviceId,
																	success: (res) => {
																		console.log('getBLEDeviceCharacteristics success', res.characteristics)
																
																		for (let i = 0; i < res.characteristics.length; i++) {
																			let item = res.characteristics[i]
																			console.log(item)
																			if (item.uuid.includes('FFF2') && item.properties.write) {
																				_this.characteristicIdW = item.uuid
																			}
																
																			if (item.uuid.includes('FFF1') && (item.properties.notify || item.properties.indicate)) {
																				wx.notifyBLECharacteristicValueChange({
																					deviceId: _this.deviceId,
																					serviceId: _this.serviceId,
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
																		uni.hideLoading()
																		console.error('getBLEDeviceCharacteristics', res)
																		if(_this.needPay) {
																			_this.needPay = false
																			_this.$refs.alertDialog1.open()
																			return
																		}
																		
																		if(_this.expBtn) {
																			_this.expBtn = false
																			_this.$refs.alertDialog2.open()
																			return
																		}
																		
																		if(_this.conBtn) {
																			_this.conBtn = false
																			_this.$refs.alertDialog3.open()
																			return
																		}
																		
																		if(_this.endBtn) {
																			_this.endBtn = false
																			_this.$refs.alertDialog4.open()
																			return
																		}
																	}
																})
																return
															}
														}
													}
												})
											},
											fail: () => {
												uni.hideLoading()
												if(_this.needPay) {
													_this.needPay = false
													_this.$refs.alertDialog1.open()
													return
												}
												
												if(_this.expBtn) {
													_this.expBtn = false
													_this.$refs.alertDialog2.open()
													return
												}
												
												if(_this.conBtn) {
													_this.conBtn = false
													_this.$refs.alertDialog3.open()
													return
												}
												
												if(_this.endBtn) {
													_this.endBtn = false
													_this.$refs.alertDialog4.open()
													return
												}
												
												// _this.$refs.alertDialog.close()
												// _this.$refs.alertDialog1.open()
											}
										})
										wx.stopBluetoothDevicesDiscovery()
									}
								})
							},
							fail: err => {
								console.log('未找到对应充电牌')
								uni.hideLoading()
								if(_this.needPay) {
									_this.needPay = false
									_this.$refs.alertDialog1.open()
									return
								}
								
								if(_this.expBtn) {
									_this.expBtn = false
									_this.$refs.alertDialog2.open()
									return
								}
								
								if(_this.conBtn) {
									_this.conBtn = false
									_this.$refs.alertDialog3.open()
									return
								}
								
								if(_this.endBtn) {
									_this.endBtn = false
									_this.$refs.alertDialog4.open()
									return
								}
							}
						})
					},
					fail: (res) => {
						console.log('蓝牙未开启')
						uni.hideLoading()
						if(_this.needPay) {
							_this.needPay = false
							_this.$refs.alertDialog1.open()
						}
						
						if(_this.expBtn) {
							_this.expBtn = false
							_this.$refs.alertDialog2.open()
						}
						
						if(_this.conBtn) {
							_this.conBtn = false
							_this.$refs.alertDialog3.open()
						}
						
						if(_this.endBtn) {
							_this.endBtn = false
							_this.$refs.alertDialog4.open()
						}
					}
				})
			},
			string2buffer(str) {
				let val = ""
				if (!str) return ;
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
			writeBLECharacteristicValue() {
				let value
				if(!this.endBtn) {
					value = this.command + this.getNum16(this.surplus) + this.msg + this.crc16(this.command + this.getNum16(this.surplus) + this.msg)
				} else {
					value = this.command + this.getNum16(0) + this.msg + this.crc16(this.command + this.getNum16(0) + this.msg)
				}
			
				let newVal = this.string2buffer(value)

				console.log('characteristicIdW:', this.characteristicIdW)
				console.log('characteristicIdN:', this.characteristicIdN)
				console.log('newVal:', newVal, typeof newVal)
				wx.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					characteristicId: this.characteristicIdW,
					value: newVal,
					success: res => {
						// wx.closeBLEConnection({
						// 	deviceId: this.deviceId
						// })
						uni.hideLoading()
						this.$refs.alertDialog.close()
						this.$refs.alertDialog1.close()
						this.$refs.alertDialog2.close()
						console.log('write success')
						console.log(this.deviceId, this.serviceId, this.surplus)
						if(this.endBtn) {
							this.surplus = 0
							this.endBtn = false
						}
						if (this.surplus == 0) {
							this.$api.endCharge({
								hotelBranchId: uni.getStorageSync('roomInfo').hotelBranchId,
								hotelId: uni.getStorageSync('roomInfo').hotelId,
								orderId: this.orderId,
								orderSn: this.orderSn
							}).then(res => {
								uni.hideLoading()
								this.surplus = 0
								uni.showToast({
									title: '充电结束',
									icon: 'none'
								})
							})
						}
					},
					fail: err => {
						uni.hideLoading()
						console.log('write fail')
						console.log(err)
					}
				})
			},
			stop() {
				wx.writeBLECharacteristicValue({
					deviceId: this.deviceId,
					serviceId: this.serviceId,
					characteristicId: this.characteristicId,
					// value: '(0x)FF-AA-02-A0-02-02',
					value: 'FFAA02A00000',
				})
			},
			closeBluetoothAdapter() {
				this.needPay = false
				this.canConnect = false
				this.$refs.alertDialog.close()
				wx.closeBLEConnection({
					deviceId: this.deviceId
				})
				// wx.closeBLEConnection({
				// 	deviceId: this.deviceId
				// })
				// wx.closeBluetoothAdapter()
				// this._discoveryStarted = false
			},
			closeDialog() {
				wx.closeBLEConnection({
					deviceId: this.deviceId
				})
				this.$refs.alertDialog1.close()
				this.$refs.alertDialog2.close()
				this.$refs.alertDialog3.close()
				this.$refs.alertDialog4.close()
			}
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

			.one {
				height: 200rpx;
				margin-bottom: 20rpx;
				position: relative;
				border-radius: 10rpx;
				// overflow: hidden;
				color: #fff;

				>image {
					width: 100%;
					height: 100%;
					border-radius: 30rpx;
				}

				.txt {
					position: absolute;
					left: 140rpx;
					top: 0;
					height: 100%;
					display: flex;
					justify-content: space-around;
					flex-direction: column;
					padding: 40rpx 0;
					width: calc(100% - 360rpx);

					&.last {
						width: calc(100% - 300rpx);
						left: 80rpx;
					}

					image {
						position: absolute;
						width: 59px;
						height: 76px;
						left: -65px;
						top: -10px;
					}

					.goodsName {
						font-size: 36rpx;
						color: #fff;
					}

					.title {
						font-size: 10px;
						color: #fff;

						&.black {
							font-size: 12px;
						}
					}


				}

				.btn {
					position: absolute;
					right: 50rpx;
					border-top: 1px solid #ebedf2;
					height: 64rpx;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					padding: 0 20rpx;
					top: 50%;
					margin-top: -32rpx;
					border-radius: 32rpx;
					width: 150rpx;
					font-size: 26rpx;
					border: 1rpx solid #fff;
					padding: 8rpx 20rpx;
					border-radius: 26rpx;
					color: #fff;
				}

				.goodsPrice {
					position: absolute;
					width: 150rpx;
					right: 30rpx;
					bottom: 10rpx;
					text-align: center;
				}

			}
		}
	}

	.tips {
		font-size: 12px;
		line-height: 20px;
		padding: 0 16px;
		
		.notice {
			color: #808080;
			font-weight: bold;
		}
		
		.tip {
			color: #808080;
			text-indent: 2em;
		}
	}

	.btns {
		margin: 27px 30px 40px;
		display: flex;
		justify-content: space-around;

		.one1 {
			width: 50%;
			text-align: center;
			
			image {
				width: 80px;
				height: 80px;
				margin-bottom: 5px;
				
				.txt {
					font-size: 14px;
					
					&.blue {
						color: #72E17C;
					}
					
					&.red {
						color:#E77869;
					}
				}
			}
		}
	}

	.has {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		
		.title {
			font-size: 12px;
			margin-bottom: 9px;
			font-family: PingFang SC-Regular, PingFang SC;
			color: #000;
		}
		
		.time {
			font-size: 20px;
			color: #333;
			
			.uni-countdown__number {
				font-size: 20px;
				color: #333;
			}
		}
	}
	/deep/ {
		.uni-countdown__number {
			font-size: 20px;
			color: #333;
		}
	}
</style>
