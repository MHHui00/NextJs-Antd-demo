import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLoginStore = create(persist(
  //参数一；修改state的函数
  (set) => ({
    // 登录状态
    loginStatus: false,
    // 用户名
    userName: '',
    // 用户选择的主题
    userId: -1,
    // 更新状态的方法
    setLogin: (status) => set({ loginStatus: status }),
    setUserName: (name) => set({ userName: name }),
    setUid: (id) => set({ userId: id }),
  }),
  //参数二：定义state的键名 + 一个函数，返回用于存储状态的存储对象（localStorage或sessionStorage）
  {
    name: 'user-settings', // 在localStorage中的唯一键
    getStorage: () => localStorage, // 指定使用localStorage
  }
));

// export const useLoginStore = create((set) => ({
//   loginStatus: false,
//   setLogin: ()=> set(state=>({loginStatus: !(state.loginStatus)})),

//   uid: -1,
//   setUid: (fetchId)=> set({uid: fetchId}),

//   username: 'user',
//   setUsername: (fetchUname)=> set({username: fetchUname}),

// }))