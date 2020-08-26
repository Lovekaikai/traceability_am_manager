<template>
	<view class="changepwd">
		<navbar class="nav">
			<!-- 插槽 -->
			<view class="navtitle">
				<view class="pwd">修改密码</view>
			</view>
		</navbar>
		
		<view class="input">
			<view class="uni-form-item uni-column phone">
			      <view class="title">手机号码</view>
				  <view class="send" >
					  <input class="uni-input" v-model="codeParams.mobile" type="text"  placeholder="请填写手机号码" />
					  <view class="getcode">
					  	<view class="again" @tap="sendCode()" v-show="isCaptcha">发送验证码</view>
					  	<view class="again" v-show="!isCaptcha">(<text>{{second}}</text>)秒后重新获取</view>
					  </view>
	
				  </view>		  	
			 </view>	
			   
			 <view class="uni-form-item uni-column code">
			      <view class="title" >验证码</view>
			      <input class="uni-input" v-model="codeParams.code"  type="text" placeholder="请输入短信验证码" />
			 	   		  
			 </view>					 
			 <view class="uni-form-item uni-column pwd">
			      <view class="title" >密码</view>
				  <view class="loginpwd">
					  <input class="uni-input" v-model="codeParams.tag" type="text" v-show="isShowEye" placeholder="请输入新的登录密码" />
					  <input class="uni-input" v-model="codeParams.tag" type="password" v-show="!isShowEye"   placeholder="请输入新的登录密码" />
					  <view class="uni-icon uni-icon-eye" @tap="passwordClick">
					  	  <image style="width: 42rpx; height: 42rpx;" v-show="!isShowEye" src="../../static/images/eye2.png" mode=""></image>
					  	  <image style="width: 42rpx; height: 42rpx;" v-show="isShowEye" src="../../static/images/eyesopen2.png" mode=""></image>
					  </view>	
				  </view> 	  

			 </view>	
			 <view class="uni-form-item uni-column confirm">
			     	<button type="primary" @tap="verificationCode()">确认</button>			  
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
			  //验证短信验证码接口参数
               codeParams:{
				   mobile:"",
				   code:"",
				   tag:""
			   },
			   isShowEye:false,//是否显示密码
			   isCaptcha:true,
			   second:120,
			}
		},
		methods:{
			//验证方法
			checkDatalogin() {
				if (!this.codeParams.mobile) {
					uni.showToast({
						title: '手机号码不能为空',
						icon: 'none',
						mask: true,
						duration: 1000,
					});
					return false
				};
				if (!this.codeParams.code) {
					uni.showToast({
						title: '验证码不能为空',
						icon: 'none',
						mask: true,
						duration: 1000,
					});
					return false
				};
				if (!this.codeParams.tag) {
					uni.showToast({
						title: '新密码不能为空',
						icon: 'none',
						mask: true,
						duration: 1000,
					});
					return false
				};
				return true
			},
			//发送验证码
			sendCode(){
				// console.log(666)
				if(!(/^(\+\d{2,3}-)?(\d{2,3}-)?(\d{2,16})$/).test(this.codeParams.mobile) || this.codeParams.mobile.length<0){
					uni.showToast({
					       title: "请输入正确的手机号码",
						   icon: 'none',
					       mask: true,
					       duration: 1000,
					});
					return;
				} 
				// else	{
					
					this.$util.get("/baseService/sms/smsCaptcha/"+this.codeParams.mobile+"/trace",).then(res => {
						console.log(666)
						if (Number(res.data.statusCode) === 200) {
							
						  this.isCaptcha = false;
						    // 设计倒计时
						   let timerId = setInterval(() => {
						         --this.second;
						   },1000)
						         //清除倒计时
						  setTimeout(() => {
						                 clearInterval(timerId);
						                 this.isCaptcha = true;
						                 this.second = 120;  // 重新变成120s
						   },120000)  
							
					      uni.showToast({
					            title: res.data.statusMsg,
					            icon: 'none',
					            mask: true,
					            duration: 1000,
					     });
						 
						} else {
					       uni.showToast({
					                        title: res.data.statusMsg,
					                        icon: 'none',
					                        mask: true,
					                        duration: 1000,
					       })  
						}
					});
					
					
				// }
				   
					 
									

			},
			/**
			 * @desc 密码显隐操作
			 */
			passwordClick() {
				this.isShowEye = !this.isShowEye;
			},
			verificationCode(){
				if(this.checkDatalogin() ){
					let _param =  {
					         mobile: this.codeParams.mobile,
					         code: this.codeParams.code,
							 tag:"trace"
					  };
					  // 验证短信验证码接口
					 this.$util.get("/baseService/sms/smsCaptcha/"+_param.mobile+"/"+_param.code+"/"+_param.tag,).then(res => {
						if (Number(res.data.statusCode) === 200) {
						let param =  {
						         accountName: this.codeParams.mobile,
						         password: this.codeParams.tag,
						 };	
							
						this.$util.httpPost("/accountCenter/account/resetAccountPassword" , param).then(res => {
							if (Number(res.data.statusCode) === 200) {
								uni.showToast({
									title: '修改密码成功',
									icon: 'success',
									mask: true,
									duration: 1000,
								});
								//修改密码成功后三秒跳转登录页
								setTimeout(() => {
								  uni.navigateTo({
								  	url:"../login/login"
								  })
								 },3000)   

							} else {
								uni.showToast({
									title: res.data.statusMsg,
									icon: 'none',
									mask: true,
									duration: 1000,
								})
							}
						});	
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
								
				
			}
		}

	}
</script>

<style lang="less" scoped>
	.changepwd {
		.navtitle {
			.pwd {
				width: 200rpx;
				height: 34rpx;
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
				padding-left: 100rpx;
				padding-top: 120rpx;
			}
		}
		
		.input{
			margin-top: 80rpx;
			min-height: 600rpx;
			.phone,.pwd,.code,.confirm{
				padding: 0 102rpx;				
				.title{
					margin: 40rpx 0;
					font-size:42rpx;
					font-family:PingFang SC;
					font-weight:500;
					color:rgba(0,0,0,1);
				}
				.uni-input{
					border-bottom: 1rpx solid rgba(128,128,128,1);
					font-size:32rpx;
					font-family:PingFang SC;
					font-weight:400;
					color:rgba(128,128,128,1);
				}								
				.send{
					// width:130rpx;
				/* 	padding-bottom: 9rpx;
					height:30rpx; */					
					display: flex;
					flex-wrap: nowrap;
					.uni-input{
						flex:3;
						border-bottom: 1rpx solid rgba(128,128,128,1);
					}
					.getcode{
						flex:2;
						font-size:24rpx;
						font-family:PingFang SC;
						font-weight:400;
						color:rgba(93,183,147,1);
						border-bottom: 1rpx solid rgba(128, 128, 128, 1);
						.again{
							float: right;
						}
					}
					
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
			.confirm{
				margin-top: 100rpx;
				button{
					background:rgba(93,183,147,1);
					border-radius:40px;
				}
			}	
		}	
			
		
	}
</style>
