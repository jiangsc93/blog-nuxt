import Vue from 'vue'
import {
  Dialog,
  Form,
  FormItem,
  Input,
  Button,
  Timeline,
  TimelineItem,
  Message,
  MessageBox,
  Menu,
  MenuItem,
  Row,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Submenu,
  MenuItemGroup,
  Table,
  TableColumn,
  DatePicker,
  // Loading,
  Card,
  Select,
  Option,
  Tag,
  Checkbox,
  CheckboxGroup,
  Pagination,
  Upload,
  Notification
} from "element-ui";
import '../assets/css/element-variables.scss'
import 'element-ui/lib/theme-chalk/base.css';
import jscPlugin from 'jsc-plugin';
// import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
export default () => {
  Vue.use(Dialog);
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Timeline);
  Vue.use(TimelineItem);
  Vue.use(Button);
  Vue.component(Message);
  Vue.component(MessageBox);
  Vue.use(Menu);
  Vue.use(MenuItem);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Dropdown);
  Vue.use(DropdownItem);
  Vue.use(DropdownMenu);
  Vue.use(Submenu);
  Vue.use(MenuItemGroup);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(DatePicker);
  // Vue.use(Loading);
  Vue.use(Card);
  Vue.use(Select);
  Vue.use(Option);
  Vue.use(Tag);
  Vue.use(Checkbox);
  Vue.use(CheckboxGroup);
  Vue.use(Pagination);
  Vue.use(Upload);
  Vue.use(jscPlugin);
  Vue.prototype.$notify = Notification;
}
