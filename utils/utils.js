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

export function deepCompare(x, y) {
  let i, l, leftChain, rightChain;

  function compare2Objects(x, y) {
      let p;

      // remember that NaN === NaN returns false
      // and isNaN(undefined) returns true
      if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
          return true;
      }

      // Compare primitives and functions.     
      // Check if both arguments link to the same object.
      // Especially useful on the step where we compare prototypes
      if (x === y) {
          return true;
      }

      // Works in case when functions are created in constructor.
      // Comparing dates is a common scenario. Another built-ins?
      // We can even handle functions passed across iframes
      if ((typeof x === 'function' && typeof y === 'function') ||
          (x instanceof Date && y instanceof Date) ||
          (x instanceof RegExp && y instanceof RegExp) ||
          (x instanceof String && y instanceof String) ||
          (x instanceof Number && y instanceof Number)) {
          return x.toString() === y.toString();
      }

      // At last checking prototypes as good as we can
      if (!(x instanceof Object && y instanceof Object)) {
          return false;
      }

      if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
          return false;
      }

      if (x.constructor !== y.constructor) {
          return false;
      }

      if (x.prototype !== y.prototype) {
          return false;
      }

      // Check for infinitive linking loops
      if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
          return false;
      }

      // Quick checking of one object being a subset of another.
      // todo: cache the structure of arguments[0] for performance
      for (p in y) {
          if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
              return false;
          } else if (typeof y[p] !== typeof x[p]) {
              return false;
          }
      }

      for (p in x) {
          if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
              return false;
          } else if (typeof y[p] !== typeof x[p]) {
              return false;
          }

          switch (typeof(x[p])) {
              case 'object':
              case 'function':

                  leftChain.push(x);
                  rightChain.push(y);

                  if (!compare2Objects(x[p], y[p])) {
                      return false;
                  }

                  leftChain.pop();
                  rightChain.pop();
                  break;

              default:
                  if (x[p] !== y[p]) {
                      return false;
                  }
                  break;
          }
      }

      return true;
  }

  if (arguments.length < 1) {
      return true; //Die silently? Don't know how to handle such case, please help...
      // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

      leftChain = []; //Todo: this can be cached
      rightChain = [];

      if (!compare2Objects(arguments[0], arguments[i])) {
          return false;
      }
  }

  return true;
}