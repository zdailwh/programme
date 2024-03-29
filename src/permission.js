import router from './router'
import store from './store'
import { Message } from 'element-ui'
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        if (to.name === null) {
          // 找不到路由 跳转到默认页面
          next(`/my/admin/edit`)
        } else {
          if (to.name === 'ProgramAdd' && to.path !== from.path && from.path !== '/') {
            // 上载页面 在新窗口打开
            var newHash = to.path
            var oldHash = window.location.hash
            var url = window.location.href.replace(oldHash, '#' + newHash)
            window.open(url, '_blank')
            next(false)
          } else {
            next()
          }
        }
      } else {
        try {
          // const roles = ['admin']
          // const accessRoutes1 = await store.dispatch('permission/generateRoutes', roles)
          // await store.dispatch('user/setRole', roles)
          // console.log(accessRoutes1)
          // router.addRoutes(accessRoutes1)
          var roles = []
          if (JSON.parse(hasToken).role && JSON.parse(hasToken).role.level > 3) {
            roles = ['admin']
          } else {
            roles = ['editor']
          }
          await store.dispatch('user/setRole', roles)
          const permsarr = JSON.parse(hasToken).permission || []
          permsarr.map(item => {
            var a = item.menu.split(',')
            item.menu = a.map(name => {
              if (name.indexOf('_') !== -1) {
                return name.substr(0, name.indexOf('_'))
              } else {
                return name
              }
            })
          })
          var perms = []
          permsarr.map(item => {
            perms = perms.concat(item.menu)
          })
          perms = unique(perms)
          const accessRoutes = await store.dispatch('mypermission/generateRoutes', { roles: roles, perms: perms })
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
          // // get user info
          // // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // const { roles } = await store.dispatch('user/getInfo')

          // // generate accessible routes map based on roles
          // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // // dynamically add accessible routes
          // router.addRoutes(accessRoutes)

          // // hack method to ensure that addRoutes is complete
          // // set the replace: true, so the navigation will not leave a history record
          // next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
})

function unique(arr) {
  var result = []; var hash = {}
  for (var i = 0, elem; (elem = arr[i]) != null; i++) {
    if (!hash[elem]) {
      result.push(elem)
      hash[elem] = true
    }
  }
  return result
}
