var t = getApp(), e = t.requirejs("core"), i = t.requirejs("foxui"), a = t.requirejs("jquery");

Page({
    data: {
        route: "cart",
        icons: t.requirejs("icons"),
        merch_list: !1,
        list: !1,
        edit_list: [],
        modelShow: !1,
        delBtnWidth: 180,
        cartcount:0,
        count:0,
        totalprice:0
    },
    onLoad: function(i) {
        var a = this;
        e.get("black", {}, function(t) {
            t.isblack && wx.showModal({
                title: "无法访问",
                content: "您在商城的黑名单中，无权访问！",
                success: function(t) {
                    t.confirm && a.close(), t.cancel && a.close();
                }
            });
        }), console.log(i), t.url(i);
        wx.getSystemInfo({
          success: function (res) {
            a.setData({
              windowHeight: res.windowHeight
            });
          }
        });
      // this.initEleWidth();
    },
    onShow: function() {
        this.get_cart();
        var t = this;
        wx.getSetting({
            success: function(e) {
                var i = e.authSetting["scope.userInfo"];
                t.setData({
                    limits: i
                }), console.log(i), i || t.setData({
                    modelShow: !0
                });
            }
        });
    },
    get_cart: function() {
        var t, i = this;
        e.get("member/cart/get_cart", {}, function(e) {
            console.log(e), t = {
                show: !0,
                ismerch: !1,
                ischeckall: e.ischeckall,
                total: e.total,
                cartcount: e.total,
                totalprice: e.totalprice,
                empty: e.empty || !1
            }, void 0 === e.merch_list ? (t.list = e.list || [], i.setData(t)) : (t.merch_list = e.merch_list || [], 
            t.ismerch = !0, i.setData(t));
        });
    },
    edit: function(t) {
        if ((s = this).data.limits) {
            var i, s = this;
            switch (e.data(t).action) {
              case "edit":
                this.setData({
                    edit: !0
                });
                break;

              case "complete":
                this.allgoods(!1), this.setData({
                    edit: !1
                });
                break;

              case "move":
                i = this.checked_allgoods().data, a.isEmptyObject(i) || e.post("member/cart/tofavorite", {
                    ids: i
                }, function(t) {
                    s.get_cart();
                });
                break;

              case "delete":
                i = this.checked_allgoods().data, a.isEmptyObject(i) || e.confirm("是否确认删除该商品?", function() {
                    e.post("member/cart/remove", {
                        ids: i
                    }, function(t) {
                        s.get_cart();
                    });
                });
                break;

              // case "pay":
                console.log(this.data);
                // this.data.total > 0 && wx.navigateTo({
                //     url: "/pages/order/create/index"
                // });
            }
        } else s.setData({
            modelShow: !0
        });
    },
    checkall: function(t) {
        e.loading();
        var i = this, a = this.data.ischeckall ? 0 : 1;
        e.post("member/cart/select", {
            id: "all",
            select: a
        }, function(t) {
            i.get_cart(), e.hideLoading();
        });
    },
    update: function(t) {
        var i = this, a = this.data.ischeckall ? 0 : 1;
        e.post("member/cart/select", {
            id: "all",
            select: a
        }, function(t) {
            i.get_cart();
        });
    },
    number: function(t) {
        var a = this, s = e.pdata(t), c = i.number(this, t), o = s.id, l = s.optionid;
      console.log("o"+o);
      console.log("l"+s.value);
      console.log("c"+c);
        1 == c && 1 == s.value && "minus" == t.target.dataset.action || s.value == s.max && "plus" == t.target.dataset.action || e.post("member/cart/update", {
            id: o,
            optionid: l,
            total: c
        }, function(t) {
            a.get_cart();
        });
    },
    selected: function(t) {
        e.loading(), console.log(t.target);
        var i = this, a = e.pdata(t), s = a.id, c = 1 == a.select ? 0 : 1;
        e.post("member/cart/select", {
            id: s,
            select: c
        }, function(t) {
            i.get_cart(), e.hideLoading();
        });
    },
    allgoods: function(t) {
        var e = this.data.edit_list;
        if (!a.isEmptyObject(e) && void 0 === t) return e;
        if (t = void 0 !== t && t, this.data.ismerch) for (var i in this.data.merch_list) for (var s in this.data.merch_list[i].list) e[this.data.merch_list[i].list[s].id] = t; else for (var i in this.data.list) e[this.data.list[i].id] = t;
        return e;
    },
    checked_allgoods: function() {
        var t = this.allgoods(), e = [], i = 0;
        for (var a in t) t[a] && (e.push(a), i++);
        return {
            data: e,
            cartcount: i
        };
    },
    editcheckall: function(t) {
        var i = e.pdata(t).check, a = this.allgoods(!i);
        this.setData({
            edit_list: a,
            editcheckall: !i
        }), this.editischecked();
    },
    editischecked: function() {
        var t = !1, e = !0, i = this.allgoods();
        for (var a in this.data.edit_list) if (this.data.edit_list[a]) {
            t = !0;
            break;
        }
        for (var s in i) if (!i[s]) {
            e = !1;
            break;
        }
        this.setData({
            editischecked: t,
            editcheckall: e
        });
    },
    edit_list: function(t) {
        var i = e.pdata(t), a = this.data.edit_list;
        void 0 !== a[i.id] && 1 == a[i.id] ? a[i.id] = !1 : a[i.id] = !0, this.setData({
            edit_list: a
        }), this.editischecked();
    },
    url: function(t) {
        var i = e.pdata(t);
        wx.navigateTo({
            url: i.url
        });
    },
    onShareAppMessage: function() {
        return e.onShareAppMessage();
    },
    cancelclick: function() {
        this.setData({
            modelShow: !1
        }), wx.switchTab({
            url: "/pages/index/index"
        });
    },
    confirmclick: function() {
        this.setData({
            modelShow: !1
        }), wx.openSetting({
            success: function(t) {}
        });
    },
    close: function() {
        t.globalDataClose.flag = !0, wx.reLaunch({
            url: "/pages/index/index"
        });
    },
    gopay: function (e) {
    var merchid = e.currentTarget.dataset.merhcid;
      console.log(111111111111111111);
      console.log(merchid);
      wx.navigateTo({
        url: "/pages/order/create/index?merchid=" + merchid
      });
    } 
  // touchS: function (e) {
  //   if (e.touches.length == 1) {
  //     this.setData({
  //       //设置触摸起始点水平方向位置
  //       startX: e.touches[0].clientX
  //     });
  //   }
  // },
  // touchM: function (e) {
  //   if (e.touches.length == 1) {
  //     //手指移动时水平方向位置
  //     var moveX = e.touches[0].clientX;
  //     //手指起始点位置与移动期间的差值
  //     var disX = this.data.startX - moveX;
  //     var delBtnWidth = this.data.delBtnWidth;
  //     var txtStyle = "";
  //     if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
  //       txtStyle = "left:0px";
  //     } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
  //       txtStyle = "left:-" + disX + "px";
  //       if (disX >= delBtnWidth) {
  //         //控制手指移动距离最大值为删除按钮的宽度
  //         txtStyle = "left:-" + delBtnWidth + "px";
  //       }
  //     }
  //     //获取手指触摸的是哪一项
  //     this.data.merch_list[e.currentTarget.dataset.index].list[e.currentTarget.dataset.itemIndex]
  //     .txtStyle = txtStyle;
  //     //更新列表的状态
  //     this.setData({
  //       merch_list: this.data.merch_list
  //     });
  //   }
  // },

  // touchE: function (e) {
  //   if (e.changedTouches.length == 1) {
  //     //手指移动结束后水平位置
  //     var endX = e.changedTouches[0].clientX;
  //     //触摸开始与结束，手指移动的距离
  //     var disX = this.data.startX - endX;
  //     var delBtnWidth = this.data.delBtnWidth;
  //     //如果距离小于删除按钮的1/2，不显示删除按钮
  //     var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
  //     //获取手指触摸的是哪一项
  //     this.data.merch_list[e.currentTarget.dataset.index].list[e.currentTarget.dataset.itemIndex]
  //       .txtStyle = txtStyle;
  //     //更新列表的状态
  //     this.setData({
  //       merch_list: this.data.merch_list
  //     });
  //   }
  // },
  // //获取元素自适应后的实际宽度
  // getEleWidth: function (w) {
  //   var real = 0;
  //   try {
  //     var res = wx.getSystemInfoSync().windowWidth;
  //     var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
  //     // console.log(scale);
  //     real = Math.floor(res / scale);
  //     return real;
  //   } catch (e) {
  //     return false;
  //     // Do something when catch error
  //   }
  // },
  // initEleWidth: function () {
  //   var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
  //   this.setData({
  //     delBtnWidth: delBtnWidth
  //   });
  // },
  // //点击删除按钮事件
  // delItem: function (e) {
  //   //获取列表中要删除项的下标
  //   var itemIndex = e.currentTarget.dataset.itemIndex;
  //   //移除列表中下标为index的项
  //   var index = e.currentTarget.dataset.index;
  //   var merch_list_item = this.data.merch_list[index].list;


  //   merch_list_item.splice(itemIndex, 1);
  //   //更新列表的状态
  //   this.setData({
  //     merch_list: this.data.merch_list
  //   });
  // }
});