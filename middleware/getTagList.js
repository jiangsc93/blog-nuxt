// import { isMobile } from '~/utils/utils'
export default function ({ req, store }) {

  store.dispatch("getTagList");

  // // 判断是否是移动端 储存在store里
  // let userAgent = req.headers['user-agent'].toLowerCase();
  // if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent)) {
  //   store.commit("setDeviceType", true);
  // }
  // else {
  // }

}