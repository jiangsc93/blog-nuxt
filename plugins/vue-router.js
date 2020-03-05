import Vue from 'vue'
import Router from 'vue-router'
import routes from './router.js'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)