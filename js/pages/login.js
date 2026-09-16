/* ==========================================================================
   pages/login.js — 用户登录
   ========================================================================== */
(function () {
  'use strict';

  /* 登录页展示的演示账号 */
  var DEMO_USERNAMES = ['admin', 'teacher', 'student'];

  function el(id) { return document.getElementById(id); }

  /* ------------------------------------------------------------------------
     演示账号卡片
     ------------------------------------------------------------------------ */
  function renderDemoAccounts() {
    var host = el('demo-accounts');
    if (!host) return;

    host.innerHTML = DEMO_USERNAMES.map(function (username) {
      var user = Store.users.byUsername(username);
      if (!user) return '';
      var initial = String(user.name || username).trim().charAt(0);
      var sub = [I18N.label('role', user.role), user.college, user.className]
        .filter(Boolean).join(' · ');

      return '' +
        '<button type="button" class="demo-account" data-demo-user="' +
          UI.escapeHtml(user.username) + '" data-demo-pass="' + UI.escapeHtml(user.password) + '">' +
          '<span class="demo-avatar" aria-hidden="true">' + UI.escapeHtml(initial) + '</span>' +
          '<span class="demo-info">' +
            '<strong>' + UI.escapeHtml(user.name) + '</strong>' +
            '<span>' + UI.escapeHtml(sub) + '</span>' +
          '</span>' +
          '<span class="demo-cred">' + UI.escapeHtml(user.username) + ' / ' +
            UI.escapeHtml(user.password) + '</span>' +
        '</button>';
    }).join('');

    host.onclick = function (event) {
      var btn = event.target.closest('[data-demo-user]');
      if (!btn) return;
      el('username').value = btn.getAttribute('data-demo-user');
      el('password').value = btn.getAttribute('data-demo-pass');
      clearErrors();
      UI.toast(I18N.t('login.demo.click') + '：' + btn.getAttribute('data-demo-user'), 'info');
      el('login-submit').focus();
    };
  }

  /* ------------------------------------------------------------------------
     校验与错误提示
     ------------------------------------------------------------------------ */
  function clearErrors() {
    var box = el('login-error');
    box.classList.add('hidden');
    box.textContent = '';
    ['username', 'password'].forEach(function (field) {
      el(field).classList.remove('input-invalid');
      el(field + '-error').textContent = '';
    });
  }

  function showError(message, fields) {
    var box = el('login-error');
    box.textContent = message;
    box.classList.remove('hidden');
    (fields || []).forEach(function (field) {
      el(field).classList.add('input-invalid');
      el(field + '-error').textContent = message;
    });
  }

  /* ------------------------------------------------------------------------
     提交
     ------------------------------------------------------------------------ */
  function handleSubmit(event) {
    event.preventDefault();
    clearErrors();

    var username = el('username').value.trim();
    var password = el('password').value;

    if (!username || !password) {
      showError(I18N.t('login.error.required'),
        [!username && 'username', !password && 'password'].filter(Boolean));
      return;
    }

    var result = Auth.login(username, password);
    if (!result.ok) {
      var key = 'login.error.' + result.error;
      var message = I18N.t(key);
      if (message === key) message = I18N.t('login.error.wrongPassword');
      /* 用户不存在时重点标记用户名，密码错误时标记密码 */
      var fields = result.error === 'userNotFound' ? ['username'] : ['password'];
      showError(message, fields);
      return;
    }

    var button = el('login-submit');
    button.disabled = true;
    button.textContent = I18N.t('login.success');

    var target = Auth.redirectParam() || Auth.homeFor(result.user);
    setTimeout(function () {
      location.replace(target);
    }, 420);
  }

  /* ------------------------------------------------------------------------
     初始化
     ------------------------------------------------------------------------ */
  UI.init();
  Auth.init();

  /* 已登录用户直接跳转 */
  if (!Auth.redirectIfLoggedIn()) {
    renderDemoAccounts();

    if (Store.isMemoryOnly()) {
      var box = el('storage-warning');
      if (box) {
        box.innerHTML = '<div class="alert alert-warn mt-3" style="font-size:12.5px">' +
          UI.escapeHtml(I18N.t('admin.storageWarning')) + '</div>';
      }
    }

    el('login-form').addEventListener('submit', handleSubmit);

    Array.prototype.forEach.call(
      document.querySelectorAll('#username, #password'),
      function (input) {
        input.addEventListener('input', function () {
          input.classList.remove('input-invalid');
          el(input.id + '-error').textContent = '';
          el('login-error').classList.add('hidden');
        });
      }
    );

    var why = null;
    try {
      why = new URLSearchParams(location.search).get('why');
    } catch (e) { /* 忽略 */ }
    if (why === 'auth') {
      var box2 = el('login-error');
      box2.textContent = I18N.t('login.needLogin');
      box2.classList.remove('hidden');
    }
  }

  document.addEventListener('langchange', function () {
    if (!Auth.isLoggedIn()) renderDemoAccounts();
  });
})();
