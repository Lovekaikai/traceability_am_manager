<template>
	<view class="productsample">
		<navbar class="nav">
			<!-- 插槽 -->
			<view class="navtitle">
				<view class="sample">商品抽检</view>
			</view>
		</navbar>
		
		<!-- 主体内容 start -->
		<view class="main">			
			  <view class="good_item">
			  	<view class="good_batch">商品批次号：{{goodInfo.traceabilityBatchNo}}</view>
			  	<view class="good_info_wrap">
			  		<image :src="goodInfo.productImg[0].url || $util.defaultImg()"></image>
			  		<view class="good_desc">
			  			<view class="good_name"><text class="left">商品名称：</text>  <text class="right">{{goodInfo.productName}}</text></view>
			  			<view class="good_num"><text class="left">商品数量：</text>   <text class="right">{{goodInfo.productReady}} kg</text></view>
			  			<view class="good_source"><text class="left">商品来源：</text><text class="right">{{goodInfo.productOrigin}}</text></view>
			  			<view class="good_class"><text class="left">商品分类：</text><text class="right">{{goodInfo.amClassification.classificationName}}</text></view>
			  		</view>
			  	</view>
			  </view>
			  
			  <view class="uni-form-item uni-column project">
			        <view class="title">抽检项目</view>
			        <input class="uni-input" v-model="checkName" maxlength="11" placeholder="请输入项目名称" />			  	
			   </view>	
			   <view class="uni-form-item uni-column result">
			        <view class="title">抽检结果</view>
		<!-- 	        <input class="uni-input" password type="text" placeholder="下拉选择结果" />	 -->
					<view class="uni-list">
					            <view class="uni-list-cell">
					               <!-- <view class="uni-list-cell-db"> -->
										<!-- <view class="uni-list-cell-left">
										      下拉选择结果
										</view> -->
										
					                    <picker class="uni-list-cell-right" @change="bindPickerChange" :value="index" :range="array">							
					                        <view class="uni-input">{{array[index]}}
											<image style="width: 28rpx; height: 28rpx; float: right;" src="../../static/images/xiala2.png" mode=""></image>
											</view>
											
					                    </picker>
					                <!-- </view> -->
					            </view>
					  </view>					  
			   </view>					 
			   <view class="uni-form-item uni-column save" @tap="goodsSampleConfir()">
			       	<button type="primary">保存</button>			  
			   </view>	
			  
			           
		</view>
	</view>
</template>

<script>
	var _self;
	import navbar from '@/components/navbar/navbar.vue'
	export default {
		components: {
			navbar
		},
		data() {
			return {
	            title: 'picker',
	            array: ['请下拉选择结果','不合格', '合格' ],
	            index: 0,//检疫结果(0:不合格，1：合格)
				checkName:"",//检疫项目名称
				productId:"",//商品id
				accountId:"",//	登录账号id
	            // 商品信息
				goodInfo:{}
			}
		},
		onLoad(e) {
			// console.log(e);
			this.getGoodsDetail(e.id);
			this.productId = e.id;
            _self = this;
			// console.log(this.productId);
			uni.getStorage({
			    key: 'useinfo',
			    success: function (res) {
			        console.log(res.data);
					_self.accountId = res.data.id
					// console.log(_self.accountId);
			    }
			});
		},
		methods:{			
			 bindPickerChange: function(e) {
			            console.log('picker发送选择改变，携带值为', e.target.value)
			            this.index = e.target.value
			 },
			 // 获取商品详情
			 async getGoodsDetail(id) {
			 	try{
			 		const res = await this.$util.request({ url: `/traceability_am/goods/detail?productId=${id}` });
			 		if(res.code === 200) {
			 			this.goodInfo = res.data.goodsInfo;
			 		}else {
			 			this.$util.showToast({title : res.message,icon : 'none'});
			 		}
			 	}catch(err){
			 		console.log(err);
			 		this.$util.showToast({title : '网络超时,请重试',icon : 'none'});
			 	}
			 },
			 //验证方法
			 checkDatalogin() {
			 	if (!this.checkName) {
			 		uni.showToast({
			 			title: '检疫项目名称不能为空',
			 			icon: 'none',
			 			mask: true,
			 			duration: 1000,
			 		});
			 		return false
			 	};	
				if (this.index == 0) {
					uni.showToast({
						title: '请下拉选择',
						icon: 'none',
						mask: true,
						duration: 1000,
					});
					return false
				};				
			 	return true
			 },
			 //商品抽样保存按钮
			 goodsSampleConfir(){
				 if(this.checkDatalogin()){
					 let _param = {
					 	checkName: this.checkName,
					 	checkResult: this.index-1,
						accountId:this.accountId,
						productId:this.productId,
					 };
					 console.log(_param)
					 this.$util.httpPost("/traceability_am/checkLog/add", _param).then(res => {
						
					 	if (Number(res.data.code) === 200) {
					 		uni.showToast({
					 			title: res.data.message,
					 			icon: 'success',
					 			mask: true,
					 			duration: 1000,
					 		});	
							//抽检保存成功后1s后返回原页面						
					 		setTimeout(() => {
							  uni.navigateBack()
					 		 },1000)   
					 		
					 	} else {
					 		uni.showToast({
					 			title: res.data.message,
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
	.productsample{
		.navtitle {
			.sample {
				// width: 141rpx;
				height: 34rpx;
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
				padding-left: 100rpx;
				padding-top: 120rpx;
			}
		}
		.main {
			// margin: 32rpx;
			.good_item {
				border: 1rpx solid #ccc;
				border-left: 4rpx solid #5DB793;
				margin:  32rpx;			
				.good_batch {				
					padding-top:30rpx;
					padding-left:40rpx;
					// width:531rpx;
					height:27rpx;
					font-size:28rpx;
					font-family:PingFang SC;					
					font-weight:bold;
					color:rgba(93,183,147,1);
					margin-bottom: 34rpx;
				}
				.good_info_wrap {
					display: flex;
					image {
						width:200rpx;
						height: 200rpx;
						padding-left: 40rpx;
					}
					.good_desc {
						padding-left: 38rpx;
						.good_name,.good_num ,.good_source,.good_class{	
							display: flex;
							margin-bottom: 20rpx;
							.left{
								// flex:1;
								width: 150rpx;
								font-size:28rpx;
								font-family:PingFang SC;
								font-weight:400;
								color:rgba(128,128,128,1);
							}		
							.right{		
								flex:2;
								font-size:28rpx;
								font-family:PingFang SC;
								font-weight:500;
								color:rgba(51,51,51,1);								
								text-align: left;
							}
						}					
					}
				}
			}
			.project,.result,.save{
				padding: 0 102rpx;
				.title{
					margin: 40rpx 0;
					font-size:38rpx;
					font-family:PingFang SC;
					font-weight:500;
					color:rgba(0,0,0,1);
				}
				.uni-input{
					border-bottom: 1rpx solid rgba(128,128,128,1);
					font-size:18px;
					font-family:PingFang SC;
					font-weight:400;
					color:rgba(128,128,128,1);
				}	
				// .uni-list-cell{
				// 	 width: 100%;
				// 	 height: 100%;
				// 	 display: flex;
				// 	 // align-items: center;
				// 	 flex-wrap: nowrap;
				// 	 .uni-list-cell-left {
				// 	    font-size:28rpx;
				// 		font-family:PingFang SC;
				// 		font-weight:400;
				// 		color:rgba(128,128,128,1);
				// 	    // padding: 0 15px;
				// 		flex: 1;
				// 		border-bottom: 1rpx solid rgba(128,128,128,1);
				// 	 }
				// 	 .uni-list-cell-right {
				// 	     flex: 2;
				// 	 }
				// }			
			}
			.save{
				margin-top: 100rpx;
				button{
					background:rgba(93,183,147,1);
					border-radius:40px;
				}
			}		
		}
	}
</style>
