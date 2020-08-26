<template>
	<view class="createProduct">
		<!-- 头部 start -->
		<navbar><view class="title">新建商品</view></navbar>
		<!-- 头部 end -->

		<!-- 主体  strat -->
		<view class="main">
			<view class="form">
				<view class="form_item">
					<view class="item_title">商品名称</view>
					<input type="text" placeholder="请输入项目名称" />
				</view>
				<view class="form_item">
					<view class="item_title">商品分类</view>
					<input type="text" placeholder="请输入商品分类" />
				</view>
				<view class="form_item">
					<view class="item_title">商品数量</view>
					<input type="text" placeholder="请输入商品数量" />
				</view>
				<view class="form_item">
					<view class="item_title">商品来源地</view>
					<input type="text" placeholder="请输入商品来源地" />
				</view>
				<view class="good_img_wrap">
					<view class="item_title">商品图片<text class="require">*</text></view>
					<robby-image-upload
						v-model="imageData"
						@delete="deleteImage"
						@add="addImage"
						:enable-drag="true"
						:enable-del="true"
						:enable-add="true"
					><view class="text">点击上传</view></robby-image-upload>
				</view>
				<view class="good_img_wrap inspection">
					<view class="item_title">检疫合格证明<text class="require">*</text></view>
					<robby-image-upload
						v-model="imageData"
						@delete="deleteImage"
						@add="addImage"
						:enable-drag="true"
						:enable-del="true"
						:enable-add="true"
					><view class="text">点击上传</view></robby-image-upload>
				</view>
			</view>
			
			<view class="next_wrap">
				<view class="btn" @tap="toflowTraceEnter()">下一步</view>
			</view>
		</view>
		<!-- 主体  end -->
	</view>
</template>

<script>
import navbar from '@/components/navbar/navbar.vue';
import robbyImageUpload from '@/components/robby-image-upload/robby-image-upload.vue';
export default {
	components: {
		navbar,
		robbyImageUpload
	},
	data() {
		return {
			imageData : ''
		};
	},
	methods: {
		deleteImage: function(e) {
			console.log(e);
		},
		addImage: function(e) {
			console.log(e);
		},
		toflowTraceEnter:function(){
			uni.navigateTo({
				url:"../flowTraceEnter/flowTraceEnter"
			})
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
};
</script>

<style lang="less" scoped>
	@import './createProduct_choose.less';
</style>
