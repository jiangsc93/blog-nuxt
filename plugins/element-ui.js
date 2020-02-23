import Vue from 'vue'
import {Select, Option, Input, Button, Form, FormItem, Pagination} from 'element-ui'

export default () => {
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Pagination);
  Vue.use(Select);
  Vue.use(Option);
}
