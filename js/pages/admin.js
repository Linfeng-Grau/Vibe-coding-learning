/* ==========================================================================
   pages/admin.js — 后台管理（仅管理员）
   功能：数据概览、新闻公告 CRUD、用户账号 CRUD、重置演示数据
   ========================================================================== */
(function () {
  'use strict';

  var user = null;

  var newsState = { keyword: '', page: 1, pageSize: 8 };
  var usersState = { keyword: '', page: 1, pageSize: 8 };

  function el(id) { return document.getElementById(id); }

  /* ------------------------------------------------------------------------
     工具
     ------------------------------------------------------------------------ */
  function fillIcons(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll('[data-icon]'), function (node) {
      var name = node.getAttribute('data-icon');
      if (UI.ICONS[name] && !node.firstElementChild) {
        node.innerHTML = UI.ICONS[name];
        node.style.display = 'inline-flex';
      }
    });
  }

  /** 把存储的 HTML 正文转回便于编辑的纯文本 */
  function htmlToText(html) {
    var str = String(html || '');
    str = str.replace(/<\/(p|h2|h3|li|ul|ol|div)>/gi, '\n\n');
    str = str.replace(/<br\s*\/?>/gi, '\n');
    str = str.replace(/<[^>]+>/g, '');
    str = str.replace(/\n{3,}/g, '\n\n');
    return str.trim();
  }

  function option(value, label, selected) {
    return '<option value="' + UI.escapeHtml(value) + '"' +
      (selected ? ' selected' : '') + '>' + UI.escapeHtml(label) + '</option>';
  }

  /* ------------------------------------------------------------------------
     标签页切换
     ------------------------------------------------------------------------ */
  function showTab(name) {
    Array.prototype.forEach.call(document.querySelectorAll('.admin-panel'), function (panel) {
      panel.classList.toggle('hidden', panel.id !== 'panel-' + name);
    });
    Array.prototype.forEach.call(document.querySelectorAll('#admin-nav [data-tab]'), function (btn) {
      btn.setAttribute('aria-current',
        btn.getAttribute('data-tab') === name ? 'true' : 'false');
    });
    try {
      history.replaceState(null, '', 'admin.html?tab=' + name);
    } catch (e) { /* 忽略 */ }
  }

  /* ------------------------------------------------------------------------
     概览
     ------------------------------------------------------------------------ */
  function renderOverview() {
    var stats = {
      news: Store.news.all().length,
      users: Store.users.all().length,
      students: Store.users.byRole('student').length,
      teachers: Store.users.byRole('teacher').length
    };

    el('overview-stats').innerHTML = [
      [I18N.t('admin.stat.news'), stats.news, 'news'],
      [I18N.t('admin.stat.users'), stats.users, 'users'],
      [I18N.t('admin.stat.students'), stats.students, 'users'],
      [I18N.t('admin.stat.teachers'), stats.teachers, 'shield']
    ].map(function (item) {
      return '<div class="admin-stat">' +
        '<div class="admin-stat-label"><span>' + UI.escapeHtml(item[0]) + '</span>' +
          (UI.ICONS[item[2]] || '') + '</div>' +
        '<div class="admin-stat-value">' + item[1] + '</div>' +
        '</div>';
    }).join('');

    var recent = Store.news.sorted().slice(0, 5);
    var body = el('overview-recent');
    if (!recent.length) {
      body.innerHTML = '<tr><td colspan="4">' + UI.escapeHtml(I18N.t('admin.news.empty')) + '</td></tr>';
      return;
    }
    body.innerHTML = recent.map(function (item) {
      return '<tr>' +
        '<td><span class="badge">' +
          UI.escapeHtml(I18N.label('category', item.category)) + '</span></td>' +
        '<td class="col-title"><a href="news-detail.html?id=' + encodeURIComponent(item.id) +
          '" target="_blank" rel="noopener">' +
          UI.escapeHtml(I18N.pick(item, 'title')) + '</a></td>' +
        '<td>' + I18N.formatDate(item.date) + '</td>' +
        '<td class="num">' + UI.escapeHtml(item.views || 0) + '</td>' +
        '</tr>';
    }).join('');
  }

  /* ------------------------------------------------------------------------
     新闻管理
     ------------------------------------------------------------------------ */
  function filteredNews() {
    var kw = newsState.keyword.trim().toLowerCase();
    return Store.news.sorted().filter(function (item) {
      if (!kw) return true;
      return [item.titleZh, item.titleEn, item.author, item.summaryZh]
        .join(' ').toLowerCase().indexOf(kw) >= 0;
    });
  }

  function renderNewsTable() {
    var all = filteredNews();
    var totalPages = Math.max(1, Math.ceil(all.length / newsState.pageSize));
    if (newsState.page > totalPages) newsState.page = totalPages;
    var start = (newsState.page - 1) * newsState.pageSize;
    var rows = all.slice(start, start + newsState.pageSize);

    el('news-count').textContent = I18N.t('common.resultCount', { n: all.length });

    var body = el('news-body');
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="7">' +
        UI.escapeHtml(I18N.t('admin.news.empty')) + '</td></tr>';
    } else {
      body.innerHTML = rows.map(function (item) {
        var title = I18N.pick(item, 'title') ||
          (I18N.getLang() === 'en' ? item.titleZh : item.titleEn) || '-';
        return '<tr>' +
          '<td>' + item.id + '</td>' +
          '<td class="col-title">' +
            (item.pinned
              ? '<span class="badge badge-gold" style="margin-right:6px">' +
                UI.escapeHtml(I18N.t('common.pinned')) + '</span>'
              : '') +
            '<a href="news-detail.html?id=' + encodeURIComponent(item.id) +
              '" target="_blank" rel="noopener">' +
              UI.escapeHtml(title) + '</a>' +
          '</td>' +
          '<td><span class="badge">' +
            UI.escapeHtml(I18N.label('category', item.category)) + '</span></td>' +
          '<td>' + I18N.formatDate(item.date) + '</td>' +
          '<td>' + UI.escapeHtml(item.author || '-') + '</td>' +
          '<td class="num">' + UI.escapeHtml(item.views || 0) + '</td>' +
          '<td class="col-actions"><span class="row-actions">' +
            '<button type="button" class="btn btn-outline btn-sm" data-edit-news="' +
              item.id + '">' + UI.escapeHtml(I18N.t('common.edit')) + '</button>' +
            '<button type="button" class="btn btn-outline btn-sm" data-delete-news="' +
              item.id + '">' + UI.escapeHtml(I18N.t('common.delete')) + '</button>' +
          '</span></td>' +
          '</tr>';
      }).join('');
    }

    UI.renderPagination(el('news-pagination'), newsState.page, totalPages, function (next) {
      newsState.page = next;
      renderNewsTable();
    });
  }

  /** 新闻编辑表单 */
  function newsFormHtml(item) {
    var data = item || {
      titleZh: '', titleEn: '', summaryZh: '', summaryEn: '',
      contentZh: '', contentEn: '', author: user.name || '',
      category: 'ngyw', date: Store.todayISO(), pinned: false
    };

    var categories = Object.keys(Store.CATEGORIES).map(function (code) {
      return option(code, I18N.label('category', code), data.category === code);
    }).join('');

    return '' +
      '<form class="form modal-form" novalidate>' +
        '<div class="form-row">' +
          '<div class="field">' +
            '<label for="f-titleZh">' + UI.escapeHtml(I18N.t('admin.news.form.titleZh')) + ' *</label>' +
            '<input class="input" id="f-titleZh" value="' + UI.escapeHtml(data.titleZh) + '">' +
            '<p class="field-error" id="f-titleZh-error"></p>' +
          '</div>' +
          '<div class="field">' +
            '<label for="f-titleEn">' + UI.escapeHtml(I18N.t('admin.news.form.titleEn')) + '</label>' +
            '<input class="input" id="f-titleEn" value="' + UI.escapeHtml(data.titleEn) + '">' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field">' +
            '<label for="f-category">' + UI.escapeHtml(I18N.t('admin.news.form.category')) + '</label>' +
            '<select class="select" id="f-category">' + categories + '</select>' +
          '</div>' +
          '<div class="field">' +
            '<label for="f-date">' + UI.escapeHtml(I18N.t('admin.news.form.date')) + '</label>' +
            '<input class="input" type="date" id="f-date" value="' + UI.escapeHtml(data.date) + '">' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field">' +
            '<label for="f-author">' + UI.escapeHtml(I18N.t('admin.news.form.author')) + '</label>' +
            '<input class="input" id="f-author" value="' + UI.escapeHtml(data.author) + '">' +
          '</div>' +
          '<div class="field" style="justify-content:center">' +
            '<label class="checkbox">' +
              '<input type="checkbox" id="f-pinned"' + (data.pinned ? ' checked' : '') + '>' +
              '<span>' + UI.escapeHtml(I18N.t('admin.news.form.pinned')) + '</span>' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<div class="field">' +
          '<label for="f-summaryZh">' + UI.escapeHtml(I18N.t('admin.news.form.summaryZh')) + '</label>' +
          '<textarea class="textarea" id="f-summaryZh">' + UI.escapeHtml(data.summaryZh) + '</textarea>' +
        '</div>' +
        '<div class="field">' +
          '<label for="f-summaryEn">' + UI.escapeHtml(I18N.t('admin.news.form.summaryEn')) + '</label>' +
          '<textarea class="textarea" id="f-summaryEn">' + UI.escapeHtml(data.summaryEn) + '</textarea>' +
        '</div>' +
        '<div class="field">' +
          '<label for="f-contentZh">' + UI.escapeHtml(I18N.t('admin.news.form.contentZh')) + '</label>' +
          '<textarea class="textarea textarea-lg" id="f-contentZh">' +
            UI.escapeHtml(htmlToText(data.contentZh)) + '</textarea>' +
          '<p class="field-hint">' + UI.escapeHtml(I18N.t('admin.news.form.contentHint')) + '</p>' +
        '</div>' +
        '<div class="field">' +
          '<label for="f-contentEn">' + UI.escapeHtml(I18N.t('admin.news.form.contentEn')) + '</label>' +
          '<textarea class="textarea textarea-lg" id="f-contentEn">' +
            UI.escapeHtml(htmlToText(data.contentEn)) + '</textarea>' +
        '</div>' +
      '</form>';
  }

  function openNewsModal(item) {
    var editing = !!item;

    UI.modal.open({
      title: I18N.t(editing ? 'admin.news.form.edit' : 'admin.news.form.add'),
      bodyHtml: newsFormHtml(item),
      confirmText: I18N.t('common.save'),
      onConfirm: function (backdrop) {
        var titleZh = backdrop.querySelector('#f-titleZh');
        var errorHost = backdrop.querySelector('#f-titleZh-error');

        if (!titleZh.value.trim()) {
          titleZh.classList.add('input-invalid');
          errorHost.textContent = I18N.t('common.required');
          titleZh.focus();
          UI.toast(I18N.t('admin.toast.formInvalid'), 'error');
          return false;
        }

        var payload = {
          titleZh: titleZh.value.trim(),
          titleEn: backdrop.querySelector('#f-titleEn').value.trim(),
          category: backdrop.querySelector('#f-category').value,
          date: backdrop.querySelector('#f-date').value || Store.todayISO(),
          author: backdrop.querySelector('#f-author').value.trim() || user.name,
          pinned: backdrop.querySelector('#f-pinned').checked,
          summaryZh: backdrop.querySelector('#f-summaryZh').value.trim(),
          summaryEn: backdrop.querySelector('#f-summaryEn').value.trim(),
          contentZh: backdrop.querySelector('#f-contentZh').value.trim(),
          contentEn: backdrop.querySelector('#f-contentEn').value.trim()
        };

        if (editing) {
          Store.news.update(item.id, payload);
          UI.toast(I18N.t('admin.toast.newsUpdated'), 'success');
        } else {
          Store.news.create(payload);
          UI.toast(I18N.t('admin.toast.newsCreated'), 'success');
        }

        renderNewsTable();
        renderOverview();
        return true;
      },
      onMount: function (backdrop) {
        var input = backdrop.querySelector('#f-titleZh');
        if (input) {
          input.addEventListener('input', function () {
            input.classList.remove('input-invalid');
            backdrop.querySelector('#f-titleZh-error').textContent = '';
          });
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     用户管理
     ------------------------------------------------------------------------ */
  function filteredUsers() {
    var kw = usersState.keyword.trim().toLowerCase();
    var list = Store.users.all().slice().sort(function (a, b) {
      var order = { admin: 0, teacher: 1, student: 2 };
      var diff = (order[a.role] || 9) - (order[b.role] || 9);
      if (diff !== 0) return diff;
      return String(a.name).localeCompare(String(b.name));
    });
    if (!kw) return list;
    return list.filter(function (u) {
      return [u.username, u.name, u.college, u.className, u.studentNo, u.major]
        .join(' ').toLowerCase().indexOf(kw) >= 0;
    });
  }

  function roleTag(role) {
    return '<span class="role-tag role-' + UI.escapeHtml(role) + '">' +
      UI.escapeHtml(I18N.label('role', role)) + '</span>';
  }

  function renderUsersTable() {
    var all = filteredUsers();
    var totalPages = Math.max(1, Math.ceil(all.length / usersState.pageSize));
    if (usersState.page > totalPages) usersState.page = totalPages;
    var start = (usersState.page - 1) * usersState.pageSize;
    var rows = all.slice(start, start + usersState.pageSize);

    el('user-count').textContent = I18N.t('common.resultCount', { n: all.length });

    var body = el('users-body');
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="7">' +
        UI.escapeHtml(I18N.t('admin.users.empty')) + '</td></tr>';
    } else {
      body.innerHTML = rows.map(function (u) {
        var isSelf = Number(u.id) === Number(user.id);
        return '<tr>' +
          '<td><code style="font-size:13px">' + UI.escapeHtml(u.username) + '</code></td>' +
          '<td><strong>' + UI.escapeHtml(u.name) + '</strong>' +
            (isSelf ? '<span class="badge badge-muted" style="margin-left:6px">' +
              UI.escapeHtml(I18N.t('login.loggedInAs')) + '</span>' : '') + '</td>' +
          '<td>' + roleTag(u.role) + '</td>' +
          '<td>' + UI.escapeHtml((u.college || '-').replace(/\s*·\s*/g, ' / ')) + '</td>' +
          '<td>' + UI.escapeHtml(u.className || '-') + '</td>' +
          '<td><span class="status-pill ' +
            (u.active === false ? 'is-disabled' : 'is-active') + '">' +
            UI.escapeHtml(I18N.t(u.active === false
              ? 'admin.users.status.disabled' : 'admin.users.status.active')) +
          '</span></td>' +
          '<td class="col-actions"><span class="row-actions">' +
            '<button type="button" class="btn btn-outline btn-sm" data-edit-user="' +
              u.id + '">' + UI.escapeHtml(I18N.t('common.edit')) + '</button>' +
            '<button type="button" class="btn btn-outline btn-sm" data-delete-user="' +
              u.id + '"' + (isSelf ? ' disabled' : '') + '>' +
              UI.escapeHtml(I18N.t('common.delete')) + '</button>' +
          '</span></td>' +
          '</tr>';
      }).join('');
    }

    UI.renderPagination(el('users-pagination'), usersState.page, totalPages, function (next) {
      usersState.page = next;
      renderUsersTable();
    });
  }

  function userFormHtml(target) {
    var isNew = !target;
    var data = target || {
      username: '', password: '', name: '', role: 'student',
      college: '', major: '', className: '', studentNo: '', title: '', active: true
    };

    var roles = Object.keys(Store.ROLES).map(function (code) {
      return option(code, I18N.label('role', code), data.role === code);
    }).join('');

    return '' +
      '<form class="form modal-form" novalidate>' +
        '<div class="form-row">' +
          '<div class="field">' +
            '<label for="u-username">' + UI.escapeHtml(I18N.t('admin.users.form.username')) + ' *</label>' +
            '<input class="input" id="u-username" autocomplete="off" value="' +
              UI.escapeHtml(data.username) + '">' +
            '<p class="field-error" id="u-username-error"></p>' +
          '</div>' +
          '<div class="field">' +
            '<label for="u-password">' + UI.escapeHtml(I18N.t('admin.users.form.password')) +
              (isNew ? ' *' : '') + '</label>' +
            '<input class="input" id="u-password" type="text" autocomplete="off" value="' +
              UI.escapeHtml(isNew ? '' : '') + '" placeholder="' +
              UI.escapeHtml(isNew ? '123456' : I18N.t('admin.users.form.passwordEditHint')) + '">' +
            (isNew ? '' : '<p class="field-hint">' +
              UI.escapeHtml(I18N.t('admin.users.form.passwordEditHint')) + '</p>') +
            '<p class="field-error" id="u-password-error"></p>' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field">' +
            '<label for="u-name">' + UI.escapeHtml(I18N.t('admin.users.form.name')) + ' *</label>' +
            '<input class="input" id="u-name" value="' + UI.escapeHtml(data.name) + '">' +
            '<p class="field-error" id="u-name-error"></p>' +
          '</div>' +
          '<div class="field">' +
            '<label for="u-role">' + UI.escapeHtml(I18N.t('admin.users.form.role')) + '</label>' +
            '<select class="select" id="u-role">' + roles + '</select>' +
          '</div>' +
        '</div>' +
        '<div class="field">' +
          '<label for="u-college">' + UI.escapeHtml(I18N.t('admin.users.form.college')) + '</label>' +
          '<input class="input" id="u-college" value="' + UI.escapeHtml(data.college) + '">' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field">' +
            '<label for="u-major">' + UI.escapeHtml(I18N.t('admin.users.form.major')) + '</label>' +
            '<input class="input" id="u-major" value="' + UI.escapeHtml(data.major || '') + '">' +
          '</div>' +
          '<div class="field">' +
            '<label for="u-className">' + UI.escapeHtml(I18N.t('admin.users.form.class')) + '</label>' +
            '<input class="input" id="u-className" value="' + UI.escapeHtml(data.className || '') + '">' +
          '</div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field">' +
            '<label for="u-studentNo">' + UI.escapeHtml(I18N.t('admin.users.form.no')) + '</label>' +
            '<input class="input" id="u-studentNo" value="' + UI.escapeHtml(data.studentNo || '') + '">' +
          '</div>' +
          '<div class="field">' +
            '<label for="u-title">' + UI.escapeHtml(I18N.t('admin.users.form.title')) + '</label>' +
            '<input class="input" id="u-title" value="' + UI.escapeHtml(data.title || '') + '">' +
          '</div>' +
        '</div>' +
        '<label class="checkbox">' +
          '<input type="checkbox" id="u-active"' + (data.active === false ? '' : ' checked') + '>' +
          '<span>' + UI.escapeHtml(I18N.t('admin.users.form.active')) + '</span>' +
        '</label>' +
      '</form>';
  }

  function openUserModal(target) {
    var editing = !!target;

    UI.modal.open({
      title: I18N.t(editing ? 'admin.users.form.edit' : 'admin.users.form.add'),
      bodyHtml: userFormHtml(target),
      confirmText: I18N.t('common.save'),
      onConfirm: function (backdrop) {
        var usernameEl = backdrop.querySelector('#u-username');
        var nameEl = backdrop.querySelector('#u-name');
        var passwordEl = backdrop.querySelector('#u-password');
        var valid = true;

        function flag(input, errorId, condition) {
          var errorHost = backdrop.querySelector('#' + errorId);
          if (condition) {
            input.classList.add('input-invalid');
            errorHost.textContent = I18N.t('common.required');
            valid = false;
          } else {
            input.classList.remove('input-invalid');
            errorHost.textContent = '';
          }
        }

        flag(usernameEl, 'u-username-error', !usernameEl.value.trim());
        flag(nameEl, 'u-name-error', !nameEl.value.trim());
        flag(passwordEl, 'u-password-error', !editing && !passwordEl.value.trim());

        if (!valid) {
          UI.toast(I18N.t('admin.toast.formInvalid'), 'error');
          return false;
        }

        var payload = {
          username: usernameEl.value.trim(),
          name: nameEl.value.trim(),
          role: backdrop.querySelector('#u-role').value,
          college: backdrop.querySelector('#u-college').value.trim(),
          major: backdrop.querySelector('#u-major').value.trim(),
          className: backdrop.querySelector('#u-className').value.trim(),
          studentNo: backdrop.querySelector('#u-studentNo').value.trim(),
          title: backdrop.querySelector('#u-title').value.trim(),
          active: backdrop.querySelector('#u-active').checked
        };
        var password = passwordEl.value.trim();
        if (password) payload.password = password;

        var result = editing
          ? Store.users.update(target.id, payload)
          : Store.users.create(payload);

        if (!result.ok) {
          var message = result.error === 'usernameTaken'
            ? I18N.t('admin.toast.usernameTaken')
            : I18N.t('admin.toast.formInvalid');
          UI.toast(message, 'error');
          usernameEl.classList.add('input-invalid');
          backdrop.querySelector('#u-username-error').textContent = message;
          return false;
        }

        UI.toast(I18N.t(editing
          ? 'admin.toast.userUpdated' : 'admin.toast.userCreated'), 'success');
        renderUsersTable();
        renderOverview();
        return true;
      },
      onMount: function (backdrop) {
        Array.prototype.forEach.call(
          backdrop.querySelectorAll('#u-username, #u-name, #u-password'),
          function (input) {
            input.addEventListener('input', function () {
              input.classList.remove('input-invalid');
              var host = backdrop.querySelector('#' + input.id + '-error');
              if (host) host.textContent = '';
            });
          }
        );
      }
    });
  }

  /* ------------------------------------------------------------------------
     删除操作
     ------------------------------------------------------------------------ */
  function handleDeleteNews(id) {
    var item = Store.news.byId(id);
    if (!item) return;
    var title = I18N.pick(item, 'title') || item.titleZh || '';
    UI.confirm(I18N.t('admin.news.deleteConfirm', { title: title }), {
      title: I18N.t('admin.news.title'),
      confirmText: I18N.t('common.delete')
    }).then(function (ok) {
      if (!ok) return;
      Store.news.remove(id);
      UI.toast(I18N.t('admin.toast.newsDeleted'), 'success');
      renderNewsTable();
      renderOverview();
    });
  }

  function handleDeleteUser(id) {
    if (Number(id) === Number(user.id)) {
      UI.toast(I18N.t('admin.users.selfDelete'), 'warn');
      return;
    }
    var target = Store.users.byId(id);
    if (!target) return;
    UI.confirm(I18N.t('admin.users.deleteConfirm', { name: target.name }), {
      title: I18N.t('admin.users.title'),
      confirmText: I18N.t('common.delete')
    }).then(function (ok) {
      if (!ok) return;
      Store.users.remove(id);
      UI.toast(I18N.t('admin.toast.userDeleted'), 'success');
      renderUsersTable();
      renderOverview();
    });
  }

  /* ------------------------------------------------------------------------
     事件绑定
     ------------------------------------------------------------------------ */
  function bind() {
    el('admin-nav').addEventListener('click', function (event) {
      var btn = event.target.closest('[data-tab]');
      if (btn) showTab(btn.getAttribute('data-tab'));
    });

    el('btn-add-news').addEventListener('click', function () {
      openNewsModal(null);
    });

    el('btn-add-user').addEventListener('click', function () {
      openUserModal(null);
    });

    el('btn-reset').addEventListener('click', function () {
      UI.confirm(I18N.t('admin.toast.resetConfirm'), {
        title: I18N.t('admin.nav.reset'),
        confirmText: I18N.t('common.confirm')
      }).then(function (ok) {
        if (!ok) return;
        Store.resetAll();
        UI.toast(I18N.t('admin.toast.resetDone'), 'success');
        /* 重置会清空会话，需要重新登录 */
        setTimeout(function () {
          Auth.logout({ redirect: 'login.html' });
        }, 700);
      });
    });

    /* 新闻表事件委托 */
    el('news-body').addEventListener('click', function (event) {
      var editBtn = event.target.closest('[data-edit-news]');
      if (editBtn) {
        var item = Store.news.byId(editBtn.getAttribute('data-edit-news'));
        if (item) openNewsModal(item);
        return;
      }
      var delBtn = event.target.closest('[data-delete-news]');
      if (delBtn) handleDeleteNews(delBtn.getAttribute('data-delete-news'));
    });

    /* 用户表事件委托 */
    el('users-body').addEventListener('click', function (event) {
      var editBtn = event.target.closest('[data-edit-user]');
      if (editBtn) {
        var target = Store.users.byId(editBtn.getAttribute('data-edit-user'));
        if (target) openUserModal(target);
        return;
      }
      var delBtn = event.target.closest('[data-delete-user]');
      if (delBtn && !delBtn.disabled) {
        handleDeleteUser(delBtn.getAttribute('data-delete-user'));
      }
    });

    /* 搜索 */
    var newsFilter = el('news-filter');
    var newsTimer = null;
    newsFilter.addEventListener('input', function () {
      clearTimeout(newsTimer);
      newsTimer = setTimeout(function () {
        newsState.keyword = newsFilter.value.trim();
        newsState.page = 1;
        renderNewsTable();
      }, 220);
    });

    var userFilter = el('user-filter');
    var userTimer = null;
    userFilter.addEventListener('input', function () {
      clearTimeout(userTimer);
      userTimer = setTimeout(function () {
        usersState.keyword = userFilter.value.trim();
        usersState.page = 1;
        renderUsersTable();
      }, 220);
    });
  }

  /* ------------------------------------------------------------------------
     初始化
     ------------------------------------------------------------------------ */
  UI.init();
  Auth.init();

  user = Auth.guard(['admin']);

  if (user) {
    el('side-user').innerHTML =
      '<strong style="display:block;color:var(--ink-900);font-size:14px;letter-spacing:0">' +
        UI.escapeHtml(user.name) + '</strong>' +
      '<span style="font-size:12px">' + UI.escapeHtml(user.college || '') + '</span>';

    if (Store.isMemoryOnly()) {
      el('storage-warning').innerHTML =
        '<div class="alert alert-warn" style="margin-bottom:18px">' +
        UI.escapeHtml(I18N.t('admin.storageWarning')) + '</div>';
    } else {
      el('storage-warning').innerHTML =
        '<div class="admin-tip" style="margin-bottom:18px">' + UI.ICONS.info +
        '<span>' + UI.escapeHtml(I18N.t('admin.desc')) + '</span></div>';
    }

    fillIcons(document);
    bind();

    var initialTab = 'overview';
    try {
      var tab = new URLSearchParams(location.search).get('tab');
      if (tab && document.getElementById('panel-' + tab)) initialTab = tab;
    } catch (e) { /* 忽略 */ }

    renderOverview();
    renderNewsTable();
    renderUsersTable();
    showTab(initialTab);
    I18N.apply(document);

    document.addEventListener('langchange', function () {
      renderOverview();
      renderNewsTable();
      renderUsersTable();
      el('storage-warning').innerHTML =
        '<div class="admin-tip" style="margin-bottom:18px">' + UI.ICONS.info +
        '<span>' + UI.escapeHtml(I18N.t('admin.desc')) + '</span></div>';
      fillIcons(document);
      I18N.apply(document);
    });
  }
})();
