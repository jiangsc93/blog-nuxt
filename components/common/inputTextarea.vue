<template>
  <div class="page-input-textarea">
    <div class="textarea-warp">
      <div class='input-textarea'
        contenteditable
        :placeholder="type === 'one' ? '不要默默地看了，快快评论下吧' : '写下评论...'"
        :ref="`inputTextarea${type}`"
        v-html="textareaOne"
        @focus="commentFocus"
        @click="onClick"
        @input="inputChange($event)"></div>
    </div>
    <div class="input__foot" v-show="showButton">
      <div class="__lt">
        <span class="emoji" @click="onShowEmoji"><i class="iconfont icon-xiaolian"></i><span>表情</span></span>
      </div>
      <div class="button">
        <el-button class="btn" type="danger" size="small" @click="submitComment">发布</el-button>
        <el-button class="btn" plain size="small" @click="cancelComment">取消</el-button>
      </div>
      <div class="emoji-wrap" v-show="showEmoji">
        <div class="triangle"></div>
        <ul>
          <li class="row" v-for="(item, index) in emojiObject[emojiProperty]" :key="index">
            <ul>
              <li class="list" v-for="(m, n) in item" :key="n" @click.stop="inputChange(m)">{{m}}</li>
            </ul>
          </li>
        </ul>
        <ul class="nextpage">
          <li v-for="(item, index) in ['one', 'two', 'three']"
            :key="index"
            :class="{'active': emojiProperty === item}"
            @click="showEmojiPage(item)">
            <span class="dot"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['type', 'commentId', 'ownerId'],
    data() {
      return {
        emojiObject: {
          'one': [
            ['😃', '😘', '😂', '😳', '😍', '👏', '👍', '👎'],
            ['😉', '😠', '😞', '😥', '😭', '😝', '😡', '❤'],
            ['😣', '😔', '😄', '😷', '😚', '😓', '😊', '😢'],
            ['😨', '😰', '😲', '😏', '😱', '😪', '😖', '😌'],
            ['👻', '🎅', '👧', '👦', '👩', '👨', '🐶', '🐱'],
            ['👊', '✊', '✌', '💪', '👆', '👇', '👉', '👈'],
            ['😁', '💔', '😜', '😒', '💩', '👌', '🤪','🙏'],
          ],
          'two': [
            ['🤗', '😎', '🤓', '👩‍💻', '👨‍💻', '🙄', '😭', '🤮'],
            ['🎉', '🤔', '🐵', '😇', '🤬', '🐈', '😹', '🙀'],
            ['👮', '🐕', '✅', '👋', '🔥', '🐛', '🍉', '👽'],
            ['⌚', '🤝', '🏳️‍🌈', '🚩', '💤', '®', '©', '💯'],
            ['💻', '📅', '📌', '✉', '⌨', '📗', '🤳', '🛌'],
            ['🎨', '🎧', '🎸', '🎤', '🏸', '🏀', '⚽', '🎮'],
            [ '🇨🇳', '🤖', '™', '🎣', '🏊', '👿', '🏆', '🍗'],
          ],
          'three': [
            ['🦄', '🔞', '☀', '🌙', '🌟', '⚡', '☁', '⚽'],
            ['☔', '🍁', '🌻', '🍃', '👗', '🎀', '👄', '🌹'],
            ['🎂', '🕙', '🍺', '🔍', '📱', '🏠', '🚗', '🎁'],
            ['💣', '💎', '💊' , '😨', '☕']
          ]
      },
      textareaOne: '',
      showButton: false,
      emojiProperty: 'one',
      sectionObj: {},
      showEmoji: false,
      }
    },
    mounted() {
      // this.$refs[`inputTextarea${this.type}`].focus();
    },
    methods: {
      // 取消评论
      cancelComment() {
        this.showButton = false;
        this.showEmoji = false;
        this.textareaOne = '';
        this.$refs[`inputTextarea${this.type}`].innerHTML = '';
      },
      submitComment() {
        if (!this.$refs[`inputTextarea${this.type}`].innerHTML) {
          this.$message({
            message: "你还没有写评论呢",
            type: "warning"
          })
          return
        }
        let params = {
          type: this.type,
          content: this.$refs[`inputTextarea${this.type}`].innerHTML,
          ownerId: this.ownerId ? this.ownerId : '',
          commentId: this.commentId ? this.commentId : ''
        }
        this.$emit('submitComment', params);
        // 清空输入框
        this.cancelComment();
      },
      onClick() {
        this.getCursorPosition();
      },
      // 点击表情icon 事件
      onShowEmoji() {
        if (!this.showEmoji) {
          this.emojiProperty = 'one';
        }
        this.showEmoji = !this.showEmoji;
        let inputTextarea = this.$refs[`inputTextarea${this.type}`];
        this.setCursorPosition(inputTextarea);
      },
      // input框输入事件
      inputChange(e) {
        let inputTextarea = this.$refs[`inputTextarea${this.type}`];
        let index = this.sectionObj.anchorOffset;
        let inT = inputTextarea.innerHTML;
        if (typeof e === 'string') {
          inputTextarea.innerHTML = inT.slice(0, index) + e + inT.slice(index);
        }
      },
      // 输入框获取焦点
      commentFocus() {
        if (!this.$store.state.isLogin) {
          this.$store.commit('setVisible', true);
          this.$store.commit('setHandleFlag', 'login');
          return;
        }
        this.getCursorPosition();
        this.showButton = true;
      },
      //获取当前光标位置
      getCursorPosition () {
        let section = window.getSelection();
        this.sectionObj.anchorNode = section.anchorNode;
        this.sectionObj.anchorOffset =section.anchorOffset;
      },

      // 设置光标位置
      setCursorPosition(element){
        var range = document.createRange();
        if (this.sectionObj.anchorNode) { // 存在
          if (this.sectionObj.anchorNode.nodeType === 1) {
              //焦点在图片
              range.setStart(element,Math.min(this.sectionObj.anchorOffset,element.childNodes.length));
          } else {
              //焦点在文本
              let node = this.sectionObj.anchorNode;
              // for(let i=0;i<element.childNodes.length;i++){
              //     if((element.childNodes[i].data&&node.data==element.childNodes[i].data)||i==element.childNodes.length-1){
              //          range.setStart(element.childNodes[i],Math.min(this.sectionObj.anchorOffset,element.childNodes[i].length));
              //          break;
              //     }
              // }
              range.setStart(node,Math.min(this.sectionObj.anchorOffset,node.length));
          }
        } else { // input框里啥都没有
          range.setStart(element, 0);
        }
        range.collapse(true); //设置选中区域为一个点
        var selection = window.getSelection();//获取当前选中区域
        selection.removeAllRanges();//移出所有的选中范围
        selection.addRange(range);//添加新建的范围
      },
      showEmojiPage(val) {
        this.emojiProperty = val;
      },
    }
  } 
</script>

<style scoped lang="scss">
.page-input-textarea {
  .textarea-warp {
    position: relative;
    .input-textarea {
      width: 100%;
      min-height: 38px;
      line-height: 24px;
      font-size: 14px;
      padding: 5px 8px;
      border: 1px solid #ddd;
      border-radius: 3px;
      background: #fff;
      &:empty::before {
        content: attr(placeholder);
        color: #999;
      }
    }
    .icon-comment {
      font-size: 13px;
      color: #ccc;
      position: absolute;
      top: 9px;
      left: 6px;
      z-index: 100;
    }
    .textarea {
      textarea {
        margin-top: 10px;
        padding-left: 28px;
        background: #fafafa;
      }
    }
  }
  .input__foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .__lt {
      .emoji {
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        .iconfont {
          font-size: 19px;
          color: #ec7259;
        }
        span {
          display: inline-block;
          font-size: 13px;
          color: #ec7259;
          line-height: 25px;
        }
      }
    }
    .button .el-button {
      margin: 10px 0 0 12px;
      padding: 6px 12px;
      font-size: 14px;
    }
    .emoji-wrap {
      position: absolute;
      top: 48px;
      left: 0;
      height: 258px;
      padding: 10px;
      z-index: 9;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0 5px 18px 0 rgba(0,0,0,.16);
      li {
        padding: 0;
        margin: 0;
      }
      .triangle {
        position: absolute;
        top: -.7rem;
        left: 15%;
        width: 0;
        height: 0;
        transform: translate(-50%,-50%);
        border: .8rem solid transparent;
        border-bottom-color: #fff;
      }
      .row {
        .list {
          display: inline-block;
          width: 30px;
          height: 30px;
          padding: 3px;
          line-height: 24px;
          text-align: center;
          font-size: 20px;
          opacity: 0.8;
          cursor: pointer;
          &:hover {
            font-size: 22px;
          }
        }
      }
      .nextpage {
        text-align: center;
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        li {
          display: inline-block;
          padding: 5px;
          .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #f0f0f0;
            border-radius: 50%;
          }
          &.active .dot {
            background: #d8d8d8;
          }
        }
      }
    }
  }
}
</style>