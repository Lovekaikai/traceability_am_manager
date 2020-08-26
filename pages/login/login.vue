<template>
	<view class="login">
		<navbar class="nav">
			<!-- 插槽 -->
			<view class="navtitle">
				<view class="hello">您好！</view>
				<view class="welcome">欢迎使用农贸市场管理员小程序</view>
			</view>
		</navbar>
		<view class="input">
			<view class="uni-form-item uni-column phone">
				<view class="title">账号</view>
				<input class="uni-input"  v-model="loginParams.accountName" placeholder="请填写账号" />
			</view>

			<view class="uni-form-item uni-column pwd">
				<view class="title">密码</view>
				
				<view class="loginpwd">
					<input class="uni-input" type="text" v-show="isShowEye" v-model="loginParams.password"  placeholder="请输入登录密码" />
					<input class="uni-input" type="password" v-show="!isShowEye" v-model="loginParams.password" placeholder="请输入登录密码" />
					<view class="uni-icon uni-icon-eye" @tap="passwordClick">
						<image style="width: 42rpx; height: 42rpx;" v-show="!isShowEye" src="../../static/images/eye2.png" mode=""></image>
						<image style="width: 42rpx; height: 42rpx;" v-show="isShowEye" src="../../static/images/eyesopen2.png" mode=""></image>
					</view>
				</view>
			
			</view>
			<view class="text">
				登陆说明：请使用在中追溯农贸市场后台注册的档口账号（手机号码）登陆  
			</view>
			<view class="uni-form-item uni-column forget">
				<view class="forgetpwd" @tap="forgetPwd()">忘记密码</view>
				<!--  <navigator url="" hover-class="navigator-hover">
			     	      <button type="default">忘记密码</button>
			     	</navigator>	 -->
			</view>
			<view class="uni-form-item uni-column loginbtn">
				<button type="primary" @tap="login()">登录</button>
			</view>

		</view>



	</view>

</template>

<script>
	import navbar from '@/components/navbar/navbar.vue'
	export default {
		components: {
			navbar
		},

		data() {
			return {
				title: 'input',
				focus: false,
				//登录参数
				loginParams: {
					accountName: '',
					password: ''
				},
				isShowEye: false, //是否显示密码
			}
		},
		methods: {

			//验证方法
			checkDatalogin() {
				if (!this.loginParams.accountName) {
					uni.showToast({
						title: '账户名不能为空',
						icon: 'none',
						mask: true,
						duration: 1000,
					});
					return false
				};
				if (!this.loginParams.password) {
					uni.showToast({
						title: '密码不能为空',
						icon: 'none',
						mask: true,
						duration: 1000,
					});
					return false
				};
				return true
			},
			//登录方法
			login( ) {
				if(this.checkDatalogin() ){
					let _param = {
						accountName: this.loginParams.accountName,
						password: this.loginParams.password,
					};
					
					this.$util.httpPost("/accountCenter/account/login/" + "zs", _param).then(res => {
						if (Number(res.data.statusCode) === 200) {
							uni.showToast({
								title: '登录成功',
								icon: 'success',
								mask: true,
								duration: 1000,
							});
							//把用户信息进行存储
							uni.setStorage({
							    key: 'useinfo',
							    data: res.data.data,
							    success: function () {
							        console.log('success');
							    }
							});
						
							// 把登录状态存储到 本地
							// uni.setStorage({
							//     key: 'isLogin',
							//     data: true,
							//     success: function () {
							//         // console.log('success');
							//     }
							// });
							//登陆成功后2s后跳转首页
							setTimeout(() => {
							  uni.redirectTo({
							  	url: "../index/index"
							  })
							 },2000)   
							
						} else {
							uni.showToast({
								title: res.data.statusMsg,
								icon: 'none',
								mask: true,
								duration: 1000,
							})
						}
					});
					
				}
	
			},
			//忘记密码
			forgetPwd() {
				uni.navigateTo({
					url: "../changepwd/changepwd"
				})
			},

			/**
			 * @desc 密码显隐操作
			 */
			passwordClick() {
				this.isShowEye = !this.isShowEye;
			},

		}


	}
</script>

<style lang="less" scoped>
	.login {	
		.navtitle {
			font-family: PingFang SC;
			color: rgba(255, 255, 255, 1);

			.hello {
				width: 200rpx;
				height: 100rpx;
				font-size: 36rpx;
				font-weight: bold;
				padding-left: 100rpx;
				padding-top: 50rpx;
			}

			.welcome {
				// width: 390rpx;
				height: 27rpx;
				font-size: 28rpx;
				font-weight: 500;
				padding-left: 100rpx;
			}
		}
		.text{
				padding: 20upx 102rpx;
				font-size: 24upx;
				color: red;
		}
		.input {
			margin-top: 80rpx;
			min-height: 600rpx;

			.phone,
			.pwd,
			.forget,
			.loginbtn {
				padding: 0 102rpx;

				.title {
					margin: 40rpx 0;
					font-size: 42rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(0, 0, 0, 1);
				}				
				.uni-input {
					border-bottom: 1rpx solid rgba(128, 128, 128, 1);
                    font-size:32rpx;
					font-family:PingFang SC;
					font-weight:400;
					color:rgba(128,128,128,1);
				}
				.loginpwd{
					display: flex;
					flex-wrap: nowrap;
					.uni-input {
						flex:3;
					}
					.uni-icon {
						flex:1;
						border-bottom: 1rpx solid rgba(128, 128, 128, 1);
						image{
							float: right;
						}
					}
				}

				
			}

			.forget {
				.forgetpwd {
					float: right;
					// width:10rpx;
					height: 30rpx;
					font-size: 30rpx;
					font-family: PingFang SC;
					font-weight: 500;
					text-decoration: underline;
					color: rgba(63, 121, 251, 1);
				}
			}

			.loginbtn {
				margin-top: 100rpx;

				button {
					background: rgba(93, 183, 147, 1);
					border-radius: 40px;
				}
			}
		}


	}
</style>
