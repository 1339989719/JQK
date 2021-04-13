// app.js
import {login_wx,addUserInfo} from 'utils/api/user';
// import {getSetting} from 'utils/api/setting';
// import {setS,getS} from 'utils/util';

App({
  onLaunch: function() {
    const me=this;
    const tokenData=wx.getStorageSync("token");
    const userId=wx.getStorageSync("userId");
    console.log(tokenData);
    if(tokenData==null||tokenData==undefined||tokenData==''||tokenData.expiresTime<=new Date().getTime()||userId==null||userId==undefined||userId==''){
      //如果token的有效期小于当前的时间,就需要去重新登录
      wx.login({
        success: res => {
          login_wx(res.code).then(res=>{
            //已经在request里保存了
            me.globalData.userId=res.data.data;
            wx.setStorage({
              key: 'userId',
              data: res.data.data,
            })
          }).catch(err=>{
            wx.showToast({
              title: '登录失败,请稍后再试',
              icon: 'none',
              duration: 2000
            })
          })
        }
      })
    }else{
      //无需登录
      me.globalData.token=tokenData.token;
      me.globalData.userId=userId;
    }
    //不管如何都去请求用户获取它的昵称和头像
    // me.getUserDetail();//里面有判断拦截
  },
  getUserDetail: function(){
    // 获取用户信息
    if(wx.getStorageSync('userInfoFlag'))
      return;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.getUserInfo();
        }else{
          this.getUserInfo();
        }
      }
    })
  },
  getUserInfo: function(){
    wx.getUserInfo({
      success: function(res) {
        addUserInfo(res.userInfo).then(res=>{
          console.log("用户信息添加成功");
          wx.setStorageSync('userInfo', res.userInfo);
          wx.setStorageSync('userInfoFlag',true);
        }).catch(err=>{
          console.log("用户信息添加失败");
        })
      }
    })
  },
  globalData: {
    userId: null,
    isConnected: true,
    token: null,
    nums: [],
    post: [],//公告
    _can: [],//优惠券
    _already: [],
    _no: [],
    fav: [],//收藏
    address: null,//地址
    historyProduct:[],//浏览记录
  }
})