<template> 
	<view class="flowTraceEnter">
		<!-- 头部 start -->
		<navbar>
			<view class="title">流通追溯录入</view>
			<view class="add_btn" @tap="handleAdd">添加环节</view>
		</navbar>
		<!-- 头部 end -->
		
		<!-- 主体 start -->
		<view class="main">
			<view class="form">
				<view class="form_item" v-for="(item,index) in flowForm" :key="index">
					<view  class="item_title">
						<view class="left">流通环节<text>{{index + 1}}</text></view>
						<view class="right" v-if="index !==0" @click="delinfor(index)">删除环节<text>{{index + 1}}</text></view>
					</view>
					
					<view class="subform">
						<view class="subform_item">
							<view class="subitem_title">经营商户</view>
							<input type="text" maxlength="50" v-model="item.merchantManagement" placeholder="请输入" />
						</view>
						<view class="subform_item">
							<view class="subitem_title">详细地址</view>
							<input type="text" maxlength="80" v-model="item.detailAddress" placeholder="请输入" />
						</view>
						<view class="subform_item">
							<view class="subitem_title">时间段</view>
							 <view class="uni-list">
							            <view class="uni-list-cell">
							               <!-- <view class="uni-list-cell-left">
							                    当前选择
							                </view> -->
							                <view class="uni-list-cell-db" @tap="getIndex(index)">
							                    <picker mode="date" :value="item.date" :start="startDate" :end="endDate" @change="bindDateChange">
							                        <view class="uni-input">{{item.date}}</view>
							                    </picker>
							                </view>
							            </view>
							   </view>
							<!-- <input type="text" v-model="item.tracebilityDate" placeholder="请输入" /> -->
						</view>
					</view>
				</view>
			</view>
			
			<view class="next_btn_wrap">
				<view class="btn" @tap="handleNext">下一步</view>
			</view>
		</view>
		<!-- 主体 end -->
	</view>
</template>

<script>
	import navbar from '@/components/navbar/navbar.vue';
	export default {
		components: {
			navbar
		},
		data() {
			const currentDate = this.getDate({
			            format: true
			})
			return {
				flowForm : [
					{merchantManagement : '',detailAddress : '',tracebilityDate : '',date: "请选择时间",},
				],
				date: "请选择时间",
				selectIndex:'',//当前时间选择的索引
			}
		},
		computed: {
		        startDate() {
		            return this.getDate('start');
		        },
		        endDate() {
		            return this.getDate('end');
		        }
		    },
		methods: {
			//获取当前选择日期的索引
			getIndex(index){
				this.selectIndex = index
				console.log(this.selectIndex)
			},
			//年月日时间选择
			bindDateChange: function(e) {
				        console.log(e) 
						// console.log(index) 
						// this.date = e.target.value
			            this.flowForm[this.selectIndex].date = e.target.value
						//获取到秒级时间戳
						if(e.target.value.length>0){
							var time = Date.parse(e.target.value)/1000
						}											
						console.log(this.flowForm[this.selectIndex].date)
						console.log(time)
						this.flowForm[this.selectIndex].tracebilityDate = time
			},
			//删除环节按钮
			delinfor(tok) {
			      this.flowForm.splice(tok, 1);
			 },
			getDate(type) {
			            const date = new Date();
			            let year = date.getFullYear();
			            let month = date.getMonth() + 1;
			            let day = date.getDate();
			
			            if (type === 'start') {
			                year = year - 60;
			            } else if (type === 'end') {
			                year = year + 2;
			            }
			            month = month > 9 ? month : '0' + month;;
			            day = day > 9 ? day : '0' + day;
			            return `${year}-${month}-${day}`;
			},
			handleAdd() {
				this.flowForm.push({merchantManagement : '',detailAddress : '',tracebilityDate : '',date: "请选择时间"});
			},
			handleNext() {
				// console.log(this.flowForm)
				let tracebilityNodes = this.flowForm.map(function(item,index, array) {	
					// console.log(item) 
					// console.log(index) 	
					// console.log(array) 	
		              delete item.date;
                     // console.log(item) 
					 return item
				})
				// console.log(tracebilityNodes)
				
				//把新建商品参数进行存储 	追溯节点对象数组
				uni.setStorage({
					key: 'tracebilityNodes',
					data: tracebilityNodes,
					success: function() {
						console.log("跳转流通追溯录入")
						uni.redirectTo({
						  url:"../productTraceEnter/productTraceEnter"
						})							
					}
				});
			  			
			}
		},
		mounted() {
			// #ifdef H5
			var u = navigator.userAgent;
			    var flag;
			    var myFunction;
			    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
			    if(isIOS){
			        document.body.addEventListener('focusin', () => {  //软键盘弹起事件
			            flag=true;
			            clearTimeout(myFunction);
			        })
			        document.body.addEventListener('focusout', () => { //软键盘关闭事件
			            flag=false;
			            if(!flag){
			                myFunction = setTimeout(function(){  
			                    window.scrollTo({top:window.scrollY,left:0,behavior:"smooth"})//重点  =======当键盘收起的时候让页面回到原始位置(这里的top可以根据你们个人的需求改变，并不一定要回到页面顶部)
			                    
			                },200);
			            }else{
			                return
			            }
			        })
			    }else{
			        return
			    }
			// #endif
		}
	}
</script>

<style lang="less" scoped>
	@import './flowTraceEnter.less';
</style>
,