<template>
	<view class="boothmanagement">
		<!-- 头部 start -->
		<navbar id="navbar">
			<view class="title">
				<text class="text">摊位管理</text>
			</view>
			<view class="pickDate_wrap">
				<div class="content">
					<image style="width:40rpx;height:40rpx;" src="../../static/images/search.png"></image>
					<input class="name uni-input uni-input-placeholder" placeholder-style=" font-size: 24rpx; color: rgba(255, 255, 255, 1);" v-model="stallHolderName" placeholder="搜索摊主姓名" />
					<view>
						<view class="btn" @tap="search()">搜索</view>
					</view>
				</div>
			</view>
		</navbar>
		<!-- 头部 end --> 
		
		<!-- 经营品类 -->
		<view class="container">
			<scroll-view  class='nav_left scroll-Y' :scroll-top="scrollTop"  scroll-y="true" >
				<!-- <block wx:for="{{cateItems}}" wx:key="{{index}}"> -->
				<block v-for="(item,index) in cateItems" :key="item.index">
					<!-- <view class="nav_left_items {{curNav==item.serialNo?'active':''}}" bindtap="switchRightTab" data-index='{{index}}' data-id="{{item.serialNo}}">{{item.cate_name}}</view> -->
					<view class="nav_left_items" :class="[curNav==item.serialNo?'active':'']" @tap="switchRightTab" :data-index='index' :data-id="item.serialNo">{{item.categoryName}}</view>
				</block>
			</scroll-view>
			<scroll-view class="nav_right scroll-Y" :scroll-top="scrollTop" scroll-y="true">
				<!--如果有数据，才遍历项-->
			<!-- 	<view v-if="cateItems[curIndex].manageStallVos.length>0"> -->
				<view v-if="cateItems[curIndex]">
					<!-- <block wx:for="{{cateItems[curIndex].children}}" wx:key="{{index}}"> -->
					<view class="rightTitle">{{cateItems[curIndex].categoryName}}</view>

					<view class="nav_right_items">
						<!--界面跳转 -->
						<view class="flexitem">
							<block v-for="(item1,index) in cateItems[curIndex].manageStallVos" :key="item1.stallId">
								<navigator class="row" :url="'../boothinfor/boothinfor?stallId='+item1.stallId">
									<view class="item">
										<image style="width:78rpx;height: 78rpx;" :src="item1.stallHolderPortrait"></image>
										<view class="label">
											摊主编号：
										</view>
										<view class="value">
											{{item1.stallNo}}
										</view>
										<view class="name">
											摊主姓名：{{item1.stallHolderName}}
										</view>
									</view>
								</navigator>
							</block>
						</view>
					</view>
				</view>
				<!--如果无数据，则显示数据-->
				<view class="nocate" v-else>
					<!-- <image src="../../images/without.png"></image> -->
					<text>该分类暂无数据</text>
				</view>
			</scroll-view>
		</view>

	</view>
</template>

<script>
var _self;
import navbar from "@/components/navbar/navbar.vue";
export default {
  components: {
    navbar
  },
  data() {
    return {
	  scrollTop: 0,
      cateItems: [ ],
      curNav: 1, //当前激活点击项
      curIndex: 0, //数据当前索引
      merchantId: "", //农贸商家id(路径参数)
      stallHolderName: "" //摊主名称
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
	  console.log("122121")
    _self = this;
    uni.getStorage({
      key: "useinfo",
      success: function(res) {
	
        _self.merchantId = res.data.merchant.merchantId;
        console.log(_self.merchantId);
        _self.getmanageList();		
      }	
    });
	
  },
  onShow(){
	  // console.log(this.cateItems)
	  // this.getmanageList();
	  // console.log(this.cateItems)
  },
  methods: {
    switchRightTab: function(e) {
      let id = e.target.dataset.id,
        index = e.target.dataset.index;
      // this.setData({
      //   curNav:id,
      //   curIndex:index
      // })
      console.log(id);
      console.log(index);
      this.curNav = id;
      this.curIndex = index;
    },
    //点击搜索按钮
    search() {
      // if (!this.stallHolderName) {
      // 	uni.showToast({
      // 		title: '请输入摊主名称',
      // 		// icon: 'none',
      // 		mask: true,
      // 		duration: 1000,
      // 	});
      // 	return false
      // };
      this.getmanageList();
	  
    },
    //按经营品类管理摊位
    getmanageList() {
      var _param = {
        merchantId: this.merchantId, //是	int	农贸商家id(路径参数)
        stallHolderName: this.stallHolderName ,//否	string	摊主名称（普通get请求参数）
      };
      // console.log(this.merchantId)
      this.$util
        .get(
          "/traceability_am/m-stall/manage/am-applet/" +
            _param.merchantId +
            "?stallHolderName=" +
            _param.stallHolderName
        )
        .then(res => {
          // console.log(res);
          if (Number(res.data.code) === 200) {
            this.cateItems = res.data.data;	
			//点击搜索触发
			if(res.data.data.length>0){
				this.curNav = res.data.data[0].serialNo;
				this.curIndex = this.curNav-1;
			}					
			console.log(this.cateItems)
          } else {
            uni.showToast({
              title: res.data.message,
              icon: "none",
              mask: true,
              duration: 1000
            });
          }
        });
    }
	
  }
};
</script>
<style lang="less" scoped>
.boothmanagement {
  .header {
    // position: relative;
    .title {
	 .text{
		  position: absolute !important;
		  top: 64rpx;
		  left: 71rpx;
		 // width:142rpx;
		 height:34rpx;		
		 font-size: 36rpx;
		 font-family: PingFang SC;
		 font-weight: bold;
		 color: rgba(255, 255, 255, 1);
	     }
 
    }

    .pickDate_wrap {
      position: absolute;
      width: 80%;
      bottom: 65rpx;
      padding: 0 71rpx 0 116rpx;
      .content {
       display: flex;
       align-items: center;
        image {
          width: 40rpx;
          height: 40rpx;
		 
        }

        .name {
          font-size: 24rpx;
          flex: 3;
          color: #fff;
          padding: 21rpx 25rpx;
          border-bottom: 1rpx solid #fff;
          margin: 0 23rpx 0 14rpx;
          opacity: 0.9;
        }
        .btn {
		  flex:1;	
          font-size: 24rpx;
          width: 100rpx;
          height: 52rpx;
          background-color: #fff;
          color: #5db793;
          border-radius: 26rpx;
          text-align: center;
          line-height: 52rpx;
        }
      }
    }
  }

  .container {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #fff;
    margin-top: 50rpx;
    .nav_left {
      width: 25%;
      height: 100%;
      // background: #F2F2F2;
      text-align: center;
      position: absolute;
      border-right: 1rpx solid rgba(204, 204, 204, 1);
      top: 0;
      left: 0;
	  // overflow: scroll;
    }

    .nav_left .nav_left_items {
      height: 60rpx;
      line-height: 60rpx;
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
	  word-break: keep-all;
	  overflow: hidden;
	  text-overflow: ellipsis;
    }
    .nav_left .nav_left_items.active {
      position: relative;
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      width: 160rpx;
      height: 60rpx;
      line-height: 60rpx;
      margin: 0 auto;
      background: rgba(93, 183, 147, 1);
      border-radius: 30rpx;
    }

    // .nav_left .nav_left_items.active::before {
    // 	display: inline-block;
    // 	width: 6rpx;
    // 	height: 60rpx;
    // 	background: #FE5723;
    // 	content: '';
    // 	position: absolute;
    // 	top: 20rpx;
    // 	left: 0;
    // }

    .nav_right {
      position: absolute;
      top: 0;
      right: 0;
      width: 75%;
      height: 100%;
      .rightTitle {
        // width:104rpx;
        height: 23rpx;
        margin-left: 40rpx;
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
      .nav_right_items {
        width: 100%;
        height: 100%;
        margin-top: 30rpx;

        .flexitem {
          display: flex;
          flex-wrap: wrap;
          margin: 30rpx;
          // align-content: space-between;
          // width: 800rpx;
          // min-height: 600rpx;
          .row {
            // flex-basis: 100%;
            // display:flex;
            .item {
              flex: 1;
              margin: 7rpx;
              width: 148rpx;
              min-height: 180rpx;
              background: rgba(255, 255, 255, 1);
              border: 1rpx solid rgba(204, 204, 204, 1);
              border-radius: 10rpx;
              text-align: center;
              image {
                margin: 10rpx auto;
              }
              .label,
              .value,
              .name {
                // width:70px;
                // height:16rpx;
                padding: 4rpx;
                font-size: 16rpx;
                font-family: PingFang SC;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
    }

    .nav_right .nav_right_items {
      // float: left;
      // text-align: center;
      // padding: 30rpx 0;
    }

    .nav_right .nav_right_items text {
      // display: block;
      // margin-top: 20rpx;
      // font-size: 28rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .nocate {
      padding: 100rpx;
      text-align: center;
    }

    .nocate image {
      width: 70rpx;
      height: 70rpx;
    }

    .nocate text {
      font-size: 28rpx;
      display: block;
      color: #bbb;
    }

    /*隐藏滚动条*/
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
  }
}
</style>
