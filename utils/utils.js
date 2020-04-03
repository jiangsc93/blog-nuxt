//判断是移动端还是 pc 端 ，true 表示是移动端，false 表示是 pc 端
export function isMobile() {
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent)) {
      return true;
  }
  else {
      return false;
  }
}

export function Throttle () {
  let timer = null
  let start = new Date()
  return function (func, wait) {
    let now = new Date()
    // console.log(wait, 'wait');
    // console.log(now, 'now');
    // let remaining = wait - (now - start)
    // console.log(remaining, 'remaining')
    // 拦截：延迟时间>多次点击间隔时间，执行：多次点击间隔时间>延迟时间
    // console.log(now - start, 'now-start');
    if ((now - start) >= wait) {
      // console.log('进来');
        // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔
        // 但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
        timer && clearTimeout(timer)
        timer = null
        start = now
        // console.log('非频繁操作，点击间隔为：',remaining)
        return func()
    } else if (!timer) {
        // trailing有值时，延时执行func函数
        // 频繁操作，第一次设置定时器之后，之后的不会再走到这里创建定时器
        // 清除问题，只能在第二有效点击的时候才会清除
        timer = setTimeout(() => {
            timer = null
            // console.log('频繁操作，定时器延时执行')
            return func()
        }, wait)
    }
  }
}