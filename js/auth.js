/* ==========================================================================
   auth.js — 登录态与角色权限
   角色：student（学生）、teacher（教师）、admin（管理员）
   --------------------------------------------------------------------------
   页面守卫用法（放在页面脚本最前面）：
     Auth.guard(['student', 'teacher', 'admin']);   // 需要登录
     Auth.guard(['admin']);                          // 需要管理员
   ========================================================================== */
(function (global) {
  'use strict';

  var FLASH_KEY = 'njtech_flash';

  /* 各角色登录后的默认落地页 */
  var HOME_BY_ROLE = {
    student: 'courses.html',
    teacher: 'courses.html',
    admin: 'admin.html'
  };

  /* 受限路径 → 允许访问的角色（仅用于提示，实际守卫由页面自行声明） */
  var RESTRICTED = {
    'courses.html': ['student', 'teacher', 'admin'],
    'grades.html': ['student', 'teacher', 'admin'],
    'admin.html': ['admin']
  };

  function currentUser() {
    return global.Store.session.currentUser();
  }

  function isLoggedIn() {
    return !!global.Store.session.get();
  }

  function hasRole(roles) {
    var user = currentUser();
    if (!user) return false;
    if (!roles || !roles.length) return true;
    return roles.indexOf(user.role) >= 0;
  }

  function homeFor(user) {
    if (!user) return 'index.html';
    return HOME_BY_ROLE[user.role] || 'index.html';
  }

  /* ------------------------------------------------------------------------
     一次性提示（跨页面跳转后展示）
     ------------------------------------------------------------------------ */
  function flash(message, type) {
    try {
      global.sessionStorage.setItem(FLASH_KEY, JSON.stringify({
        message: message, type: type || 'info'
      }));
    } catch (e) { /* 忽略 */ }
  }

  function consumeFlash() {
    try {
      var raw = global.sessionStorage.getItem(FLASH_KEY);
      if (!raw) return null;
      global.sessionStorage.removeItem(FLASH_KEY);
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  /* ------------------------------------------------------------------------
     登录 / 登出
     ------------------------------------------------------------------------ */
  /** 返回 { ok:true, user } 或 { ok:false, error:'userNotFound'|'wrongPassword'|'accountDisabled' } */
  function login(username, password) {
    var result = global.Store.users.authenticate(username, password);
    if (!result.ok) return result;
    global.Store.session.set(result.user.id);
    return { ok: true, user: result.user };
  }

  function logout(options) {
    var opts = options || {};
    global.Store.session.clear();
    if (opts.silent) return;
    flash(I18N.t('nav.logout'), 'info');
    global.location.replace(opts.redirect || 'index.html');
  }

  /* ------------------------------------------------------------------------
     跳转工具
     ------------------------------------------------------------------------ */
  /** 只允许跳回本站的 html 页面，防止开放重定向 */
  function safeRedirect(value, fallback) {
    /* 注意：fallback 允许传空字符串，表示“没有可跳转目标”。
       不能用 `fallback || 'index.html'`，否则空字符串会被当成未传值。 */
    var fb = (fallback === undefined || fallback === null) ? 'index.html' : fallback;
    if (!value) return fb;
    var str = String(value).trim();
    if (/^[\w.-]+\.html(\?[\w=&%.+-]*)?$/.test(str) && str.indexOf('//') < 0) {
      return str;
    }
    return fb;
  }

  function redirectParam() {
    try {
      var params = new URLSearchParams(global.location.search);
      return safeRedirect(params.get('redirect'), '');
    } catch (e) {
      return '';
    }
  }

  function goLogin(why) {
    var target = global.location.pathname.split('/').pop() + global.location.search;
    var url = 'login.html?redirect=' + encodeURIComponent(safeRedirect(target, 'index.html'));
    if (why) url += '&why=' + encodeURIComponent(why);
    global.location.replace(url);
  }

  /**
   * 页面守卫。
   * @param {string[]} roles 允许访问的角色；不传表示只需登录
   * @returns {object|null} 当前用户；无权访问时会跳转并返回 null
   */
  function guard(roles, options) {
    var opts = options || {};
    var user = currentUser();

    if (!user) {
      if (!opts.silent) {
        flash(I18N.t('login.needLogin'), 'warn');
        goLogin('auth');
      }
      return null;
    }

    if (roles && roles.length && roles.indexOf(user.role) < 0) {
      if (!opts.silent) {
        flash(I18N.t('login.noPermission'), 'error');
        global.location.replace('index.html?denied=1');
      }
      return null;
    }

    return user;
  }

  /** 已登录用户访问登录页时：直接送去对应首页 */
  function redirectIfLoggedIn() {
    var user = currentUser();
    if (!user) return false;
    var target = redirectParam();
    global.location.replace(target || homeFor(user));
    return true;
  }

  /* ------------------------------------------------------------------------
     渲染辅助
     ------------------------------------------------------------------------ */
  /** 给带 data-role-only="student,teacher" 的元素按角色显示 / 隐藏 */
  function applyRoleVisibility(root) {
    var scope = root || document;
    var user = currentUser();
    Array.prototype.forEach.call(scope.querySelectorAll('[data-role-only]'), function (el) {
      var allowed = String(el.getAttribute('data-role-only'))
        .split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      var visible = !!user && allowed.indexOf(user.role) >= 0;
      el.classList.toggle('hidden', !visible);
    });
    Array.prototype.forEach.call(scope.querySelectorAll('[data-role-hide]'), function (el) {
      var hidden = String(el.getAttribute('data-role-hide'))
        .split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      var shouldHide = !!user && hidden.indexOf(user.role) >= 0;
      el.classList.toggle('hidden', shouldHide);
    });
  }

  /** 展示跨页面传递过来的一次性提示 */
  function showFlash() {
    var pending = consumeFlash();
    if (pending && pending.message) {
      global.UI.toast(pending.message, pending.type);
    }
  }

  function init() {
    showFlash();
    applyRoleVisibility(document);
  }

  global.Auth = {
    HOME_BY_ROLE: HOME_BY_ROLE,
    RESTRICTED: RESTRICTED,
    currentUser: currentUser,
    isLoggedIn: isLoggedIn,
    hasRole: hasRole,
    homeFor: homeFor,
    login: login,
    logout: logout,
    guard: guard,
    goLogin: goLogin,
    safeRedirect: safeRedirect,
    redirectParam: redirectParam,
    redirectIfLoggedIn: redirectIfLoggedIn,
    flash: flash,
    consumeFlash: consumeFlash,
    applyRoleVisibility: applyRoleVisibility,
    showFlash: showFlash,
    init: init
  };
})(window);
