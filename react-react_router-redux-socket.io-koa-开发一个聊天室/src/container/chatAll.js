
// container文件夹当中则是将通用组件取出，定义store中的数据同组件如何映射，
// 以及组件中的事件如何dispatch action，从而引起store数据的改变。
// 而在container当中，只需要将store中的nameList赋值到该组件的props上面即可。其他组件也是类似的写法。


import { connect } from 'react-redux'
import ChatAll from '../components/chatall'
import { message_update, guest_update, nickname_get, nickname_forget } from '../action'
import { hashHistory } from 'react-router'

var mapStateToProps = (state, ownProps) => {
  return {
    nickName: state.nickName,
    nameList: state.nameList,
    msgList: state.msgList
  }
}

var mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleClick: function(e) {
      fetch('/api/logout', {
        method: 'POST',
        body: '',
        credentials: 'include'
      }).then(function(res) {
        if (res.ok) {
          hashHistory.push('/login');
          dispatch(nickname_forget());
        }
      });
    },
    handleSubmit: function(value, nickName) {
      dispatch(message_update({
        nickName: nickName,
        msg: value
      }));
    },
    checkLogin: function() {
      // dispatch(nickname_get(''));
      fetch('/api/auth', {
        method: 'GET',
        credentials: 'include'
      }).then(function(res) {
        return res.json()
      }).then(function(data) {
        //如果没有cookie，则证明没有登录过，重定向到昵称页面
        if (!data.permit) {
          hashHistory.push('/login');
        } else {
          dispatch(nickname_get(data.nickname));
        }
      })
    }
  }
}

var ChatAllContainer = connect(mapStateToProps, mapDispatchToProps)(ChatAll);
export default ChatAllContainer
