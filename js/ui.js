/* ==========================================================================
   ui.js — 共享界面模块
   负责：导航栏 / 页脚注入、语言切换按钮、移动端菜单、Toast、模态框、图标
   ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------------
     图标（内联 SVG，随 currentColor 变色）
     ------------------------------------------------------------------------ */
  function svg(path, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' + path + (extra || '') + '</svg>';
  }

  var ICONS = {
    home: svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>'),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7.6h.01"/>'),
    grid: svg('<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>'),
    news: svg('<path d="M4 5.5h11v13H4z"/><path d="M15 9h5v7.5a2 2 0 0 1-2 2h-3"/><path d="M7 9h5M7 12h5M7 15h3"/>'),
    calendar: svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17"/><path d="M8 3.5V6M16 3.5V6"/>'),
    chart: svg('<path d="M4 20h16"/><path d="M7 20V10M12 20V5M17 20v-7"/>'),
    shield: svg('<path d="M12 3.2 19 6v5.6c0 4.3-2.9 8-7 9.2-4.1-1.2-7-4.9-7-9.2V6z"/><path d="M9.3 12.2l2 2 3.4-3.6"/>'),
    login: svg('<path d="M10 4.5H6.5A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5H10"/><path d="M15 8.5 18.5 12 15 15.5"/><path d="M18 12H9.5"/>'),
    logout: svg('<path d="M14 4.5h3.5A1.5 1.5 0 0 1 19 6v12a1.5 1.5 0 0 1-1.5 1.5H14"/><path d="M9 8.5 5.5 12 9 15.5"/><path d="M6 12h8.5"/>'),
    lab: svg('<path d="M9 3.5h6"/><path d="M10.5 3.5v6L5.8 17a2.4 2.4 0 0 0 2.1 3.5h8.2a2.4 2.4 0 0 0 2.1-3.5l-4.7-7.5v-6"/><path d="M7.6 14.5h8.8"/>'),
    medal: svg('<circle cx="12" cy="14.5" r="5"/><path d="M8.5 9.5 6 3.5h12l-2.5 6"/><path d="M12 12.2l.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3z"/>'),
    globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3.2 9.5h17.6M3.2 14.5h17.6"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>'),
    star: svg('<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.7l5.8-.8z"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    edit: svg('<path d="M4.5 19.5h4l9.2-9.2a2.1 2.1 0 0 0 0-3l-1-1a2.1 2.1 0 0 0-3 0L4.5 15.5z"/><path d="M14.5 6.8 17.2 9.5"/>'),
    trash: svg('<path d="M4.5 6.5h15"/><path d="M9 6.5V4.8h6v1.7"/><path d="M6.5 6.5 7.5 20h9l1-13.5"/><path d="M10.5 10v6M13.5 10v6"/>'),
    refresh: svg('<path d="M20 11.5A8 8 0 1 0 18 17"/><path d="M20 4.5V11h-6.5"/>'),
    check: svg('<path d="m5 12.8 4.5 4.5L19 7.5"/>'),
    arrowRight: svg('<path d="M5 12h13"/><path d="m13 6.5 5.5 5.5-5.5 5.5"/>'),
    empty: svg('<path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5z"/><path d="m4 7.5 8 3.5 8-3.5"/><path d="M12 11v9"/>'),
    inbox: svg('<path d="M4 13.5h4l1.3 2.5h5.4l1.3-2.5h4"/><path d="M5.5 5.5h13l1.5 8v4a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5v-4z"/>'),
    users: svg('<circle cx="9" cy="8.5" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6"/><path d="M17.5 14.4A5.6 5.6 0 0 1 21 19.6"/>'),
    clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>')
  };

  /* ------------------------------------------------------------------------
     基础工具
     ------------------------------------------------------------------------ */
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** 从 HTML 字符串创建元素 */
  function node(html) {
    var tpl = document.createElement('div');
    tpl.innerHTML = html.trim();
    return tpl.firstElementChild;
  }

  /** 取当前页面文件名，用于高亮导航 */
  function currentPage() {
    var body = document.body;
    if (body && body.getAttribute('data-page')) {
      return body.getAttribute('data-page');
    }
    var path = global.location.pathname.split('/').pop() || 'index.html';
    return path.replace(/\.html$/, '');
  }

  /**
   * 风格化 SVG 标识（占位用，非官方校徽）。
   * 目前页头使用官方校名标志图、页脚只显示校名文字，本函数暂无调用点，
   * 保留为公开工具（UI.logoSvg）以便需要时在内联场景中使用。
   */
  function logoSvg(size) {
    var s = size || 42;
    return '' +
      '<svg class="brand-logo" viewBox="0 0 64 64" width="' + s + '" height="' + s + '" role="img" aria-label="南京工业大学 标识">' +
      '<defs><linearGradient id="njtechLogoGrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#14417a"/><stop offset="100%" stop-color="#2c6cb0"/>' +
      '</linearGradient></defs>' +
      '<circle cx="32" cy="32" r="30" fill="url(#njtechLogoGrad)"/>' +
      '<circle cx="32" cy="32" r="26.5" fill="none" stroke="#c9a227" stroke-width="1.4" opacity=".85"/>' +
      '<path d="M18 38.5 32 22l14 16.5" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M22 43.5h20" stroke="#c9a227" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M26 33.5h12" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity=".75"/>' +
      '</svg>';
  }

  /**
   * 页头品牌标志（学校官方校徽 + 中英文校名组合标志）
   * 原图 378 × 124，用 CSS 约束高度、宽度自适应，保持比例
   */
  function brandLogoImg() {
    return '<img class="brand-logo-img" src="assets/images/njtech-logo.jpg" ' +
      'width="378" height="124" alt="南京工业大学" data-i18n-alt="site.logoAlt">';
  }

  /* ------------------------------------------------------------------------
     导航配置
     ------------------------------------------------------------------------ */
  var NAV = [
    { page: 'index', href: 'index.html', key: 'nav.home', icon: 'home', roles: null },
    { page: 'about', href: 'about.html', key: 'nav.about', icon: 'info', roles: null },
    { page: 'colleges', href: 'colleges.html', key: 'nav.colleges', icon: 'grid', roles: null },
    { page: 'news', href: 'news.html', key: 'nav.news', icon: 'news', roles: null },
    { page: 'courses', href: 'courses.html', key: 'nav.courses', icon: 'calendar', roles: ['student', 'teacher', 'admin'] },
    { page: 'grades', href: 'grades.html', key: 'nav.grades', icon: 'chart', roles: ['student', 'teacher', 'admin'] },
    { page: 'admin', href: 'admin.html', key: 'nav.admin', icon: 'shield', roles: ['admin'] }
  ];

  function visibleNav() {
    var user = global.Auth ? global.Auth.currentUser() : null;
    return NAV.filter(function (item) {
      if (!item.roles) return true;
      return !!user && item.roles.indexOf(user.role) >= 0;
    });
  }

  /* ------------------------------------------------------------------------
     页头 / 页脚
     ------------------------------------------------------------------------ */
  function renderHeader() {
    var host = document.getElementById('site-header');
    if (!host) return;

    var page = currentPage();
    var items = visibleNav();

    var navHtml = items.map(function (item) {
      var active = item.page === page ? ' aria-current="page"' : '';
      return '<li><a href="' + item.href + '" data-i18n="' + item.key + '"' + active + '></a></li>';
    }).join('');

    /* 右上角：用户区或登录按钮 */
    var user = global.Auth ? global.Auth.currentUser() : null;
    var actionsHtml = '';
    if (user) {
      var initial = String(user.name || user.username).trim().charAt(0);
      actionsHtml =
        '<div class="user-chip" title="' + escapeHtml(user.name) + '">' +
        '<div class="user-chip-info">' +
        '<span class="user-chip-name">' + escapeHtml(user.name) + '</span>' +
        '<span class="user-chip-role">' + escapeHtml(I18N.label('role', user.role)) + '</span>' +
        '</div>' +
        '<span class="user-chip-avatar" aria-hidden="true">' + escapeHtml(initial) + '</span>' +
        '</div>' +
        '<button type="button" class="btn btn-outline btn-sm" id="btn-logout">' +
        ICONS.logout.replace('<svg', '<svg width="15" height="15"') +
        '<span class="btn-label-full" data-i18n="nav.logout"></span></button>';
    } else {
      actionsHtml =
        '<a class="btn btn-sm" href="login.html">' +
        ICONS.login.replace('<svg', '<svg width="15" height="15"') +
        '<span data-i18n="nav.login"></span></a>';
    }

    host.innerHTML =
      '<div class="topbar">' +
        '<div class="container">' +
          '<span class="topbar-slogan" data-i18n="topbar.slogan"></span>' +
          '<ul class="topbar-links">' +
            '<li><a href="https://sfgl.njtech.edu.cn/" target="_blank" rel="noopener" data-i18n="topbar.smart"></a></li>' +
            '<li><a href="http://mail.njtech.edu.cn/" target="_blank" rel="noopener" data-i18n="topbar.mail"></a></li>' +
            '<li><a href="https://jwgl.njtech.edu.cn/" target="_blank" rel="noopener" data-i18n="nav.portal"></a></li>' +
            '<li class="topbar-lang">' +
              '<span class="sr-only" data-i18n="lang.label"></span>' +
              '<span class="lang-switch" role="group">' +
                '<button type="button" data-lang-btn="zh" aria-pressed="false" data-lang-label="lang.zh">中文</button>' +
                '<button type="button" data-lang-btn="en" aria-pressed="false" data-lang-label="lang.en">EN</button>' +
              '</span>' +
            '</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="site-header">' +
        '<div class="container header-main">' +
          '<a class="brand" href="index.html">' + brandLogoImg() + '</a>' +
          '<nav class="main-nav" id="main-nav" aria-label="主导航"><ul>' + navHtml + '</ul></nav>' +
          '<div class="header-actions">' + actionsHtml +
            '<button type="button" class="nav-toggle" id="nav-toggle" ' +
            'data-i18n-aria-label="nav.menu" aria-expanded="false" aria-controls="main-nav">' +
            '<span></span></button>' +
          '</div>' +
        '</div>' +
      '</div>';

    /* 语言切换 */
    Array.prototype.forEach.call(host.querySelectorAll('[data-lang-btn]'), function (btn) {
      btn.addEventListener('click', function () {
        I18N.setLang(btn.getAttribute('data-lang-btn'));
      });
    });

    /* 移动端菜单 */
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* 退出登录 */
    var logout = document.getElementById('btn-logout');
    if (logout && global.Auth) {
      logout.addEventListener('click', function () {
        global.Auth.logout();
      });
    }
  }

  function renderFooter() {
    var host = document.getElementById('site-footer');
    if (!host) return;

    var school = (global.Store && global.Store.SCHOOL) || {};
    var lang = I18N.getLang();
    var year = new Date().getFullYear();

    var linkItems = (school.quickLinks || []).map(function (link) {
      var label = lang === 'en' ? link.labelEn : link.labelZh;
      return '<li><a href="' + escapeHtml(link.url) + '" target="_blank" rel="noopener">' +
        escapeHtml(label) + '</a></li>';
    }).join('');

    var campusItems = (school.campuses || []).map(function (c) {
      var name = lang === 'en' ? c.nameEn : c.nameZh;
      var addr = lang === 'en' ? c.addressEn : c.addressZh;
      return '<li><strong>' + escapeHtml(name) + '</strong><br>' +
        escapeHtml(addr) + '　' + I18N.t('footer.zip') + ' ' + escapeHtml(c.zip) + '</li>';
    }).join('');

    host.innerHTML =
      '<footer class="site-footer">' +
        '<div class="container footer-main">' +
          '<div class="footer-col">' +
            '<div class="footer-brand">' +
              '<span><strong>' + escapeHtml(lang === 'en' ? school.nameEn : school.nameZh) + '</strong>' +
              '<span>' + escapeHtml(lang === 'en' ? (school.mottoEn || '') : (school.mottoZh || '')) + '</span></span>' +
            '</div>' +
            '<p data-i18n="footer.aboutText"></p>' +
            '<p class="text-muted" style="font-size:12.5px" data-i18n="footer.disclaimer"></p>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h3 data-i18n="footer.links"></h3>' +
            '<ul>' + linkItems +
              '<li><a href="news.html" data-i18n="nav.news"></a></li>' +
              '<li><a href="about.html" data-i18n="nav.about"></a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h3 data-i18n="footer.campus"></h3>' +
            '<ul class="footer-address">' + campusItems + '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h3 data-i18n="footer.contact"></h3>' +
            '<ul>' +
              '<li><a href="' + escapeHtml(school.website || '#') + '" target="_blank" rel="noopener">' +
                escapeHtml('www.njtech.edu.cn') + '</a></li>' +
              '<li><a href="https://jwgl.njtech.edu.cn/" target="_blank" rel="noopener" data-i18n="nav.portal"></a></li>' +
              '<li data-i18n="footer.source"></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="container footer-bottom">' +
          '<span>' + escapeHtml(I18N.t('footer.copyright').replace('2026', String(year))) + '</span>' +
          '<span data-i18n="footer.disclaimer"></span>' +
        '</div>' +
      '</footer>';
  }

  /* ------------------------------------------------------------------------
     Toast
     ------------------------------------------------------------------------ */
  function toastHost() {
    var host = document.getElementById('toast-stack');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toast-stack';
      host.className = 'toast-stack';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    return host;
  }

  function toast(message, type) {
    var host = toastHost();
    var el = node('<div class="toast toast-' + (type || 'info') + '">' +
      '<span>' + escapeHtml(message) + '</span></div>');
    host.appendChild(el);
    global.setTimeout(function () {
      el.classList.add('leaving');
      global.setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 220);
    }, 3200);
    return el;
  }

  /* ------------------------------------------------------------------------
     模态框
     ------------------------------------------------------------------------ */
  var modalState = { el: null, resolve: null, lastFocus: null };

  function openModal(options) {
    closeModal();
    var opts = options || {};
    var sizeClass = opts.size === 'sm' ? ' modal-sm' : '';

    var backdrop = node(
      '<div class="modal-backdrop" role="presentation">' +
        '<div class="modal' + sizeClass + '" role="dialog" aria-modal="true">' +
          '<div class="modal-header">' +
            '<h2>' + escapeHtml(opts.title || '') + '</h2>' +
            '<button type="button" class="modal-close" aria-label="' +
              escapeHtml(I18N.t('common.close')) + '">&times;</button>' +
          '</div>' +
          '<div class="modal-body">' + (opts.bodyHtml || '') + '</div>' +
          (opts.footerHtml === null ? '' :
            '<div class="modal-footer">' + (opts.footerHtml ||
              '<button type="button" class="btn btn-outline" data-modal-cancel>' +
                escapeHtml(I18N.t('common.cancel')) + '</button>' +
              '<button type="button" class="btn" data-modal-confirm>' +
                escapeHtml(opts.confirmText || I18N.t('common.confirm')) + '</button>') +
            '</div>') +
        '</div>' +
      '</div>');

    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    modalState.el = backdrop;
    modalState.lastFocus = document.activeElement;

    /* 关闭按钮 */
    backdrop.querySelector('.modal-close').addEventListener('click', closeModal);

    /* 取消按钮 */
    var cancelBtn = backdrop.querySelector('[data-modal-cancel]');
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    /* 确认按钮 */
    var confirmBtn = backdrop.querySelector('[data-modal-confirm]');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        if (typeof opts.onConfirm === 'function') {
          var result = opts.onConfirm(backdrop);
          if (result === false) return;
        }
        closeModal();
      });
    }

    /* 点击遮罩关闭 */
    if (opts.dismissible !== false) {
      backdrop.addEventListener('mousedown', function (event) {
        if (event.target === backdrop) closeModal();
      });
    }

    /* Esc 关闭 */
    document.addEventListener('keydown', onKeydown);

    /* 焦点管理 */
    var focusTarget = backdrop.querySelector(
      'input:not([type="hidden"]), select, textarea, [data-modal-confirm], button');
    if (focusTarget) {
      global.setTimeout(function () { focusTarget.focus(); }, 30);
    }

    if (typeof opts.onMount === 'function') opts.onMount(backdrop);

    return backdrop;
  }

  function onKeydown(event) {
    if (event.key === 'Escape') closeModal();
  }

  function closeModal() {
    if (!modalState.el) return;
    document.removeEventListener('keydown', onKeydown);
    if (modalState.el.parentNode) {
      modalState.el.parentNode.removeChild(modalState.el);
    }
    modalState.el = null;
    document.body.style.overflow = '';
    if (modalState.lastFocus && modalState.lastFocus.focus) {
      modalState.lastFocus.focus();
    }
    modalState.lastFocus = null;
  }

  /** 二次确认，返回 Promise<boolean> */
  function confirm(message, options) {
    var opts = options || {};
    return new Promise(function (resolve) {
      openModal({
        title: opts.title || I18N.t('common.confirm'),
        size: 'sm',
        bodyHtml: '<p>' + escapeHtml(message) + '</p>',
        confirmText: opts.confirmText || I18N.t('common.delete'),
        onConfirm: function () { resolve(true); },
        onMount: function (backdrop) {
          backdrop.addEventListener('click', function (event) {
            if (event.target.hasAttribute('data-modal-cancel') ||
              event.target.closest('.modal-close') ||
              event.target === backdrop) {
              resolve(false);
            }
          });
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     空状态
     ------------------------------------------------------------------------ */
  function emptyState(messageKey, iconName) {
    return '<div class="empty-state">' +
      (ICONS[iconName || 'inbox']) +
      '<p>' + escapeHtml(I18N.t(messageKey || 'common.noData')) + '</p>' +
      '</div>';
  }

  /** 渲染分页控件 */
  function renderPagination(host, page, totalPages, onChange) {
    if (!host) return;
    if (totalPages <= 1) {
      host.innerHTML = '';
      return;
    }
    var buttons = [];
    buttons.push('<button type="button" data-page-btn="' + (page - 1) + '"' +
      (page === 1 ? ' disabled' : '') + '>' + escapeHtml(I18N.t('common.prevPage')) + '</button>');

    var start = Math.max(1, page - 2);
    var end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    for (var i = start; i <= end; i++) {
      buttons.push('<button type="button" data-page-btn="' + i + '"' +
        (i === page ? ' aria-current="true"' : '') + '>' + i + '</button>');
    }
    buttons.push('<button type="button" data-page-btn="' + (page + 1) + '"' +
      (page === totalPages ? ' disabled' : '') + '>' + escapeHtml(I18N.t('common.nextPage')) + '</button>');

    host.innerHTML = buttons.join('');
    host.onclick = function (event) {
      var btn = event.target.closest('[data-page-btn]');
      if (!btn || btn.disabled) return;
      onChange(Number(btn.getAttribute('data-page-btn')));
    };
  }

  /* ------------------------------------------------------------------------
     初始化
     ------------------------------------------------------------------------ */
  var initialized = false;

  function init() {
    renderHeader();
    renderFooter();
    I18N.apply(document);
    I18N.updateLangButtons();

    if (!initialized) {
      initialized = true;
      /* 语言切换后刷新页头页脚中的动态部分（校名、校区地址等） */
      document.addEventListener('langchange', function () {
        renderHeader();
        renderFooter();
        I18N.updateLangButtons();
      });
    }
  }

  global.UI = {
    ICONS: ICONS,
    NAV: NAV,
    escapeHtml: escapeHtml,
    node: node,
    logoSvg: logoSvg,
    currentPage: currentPage,
    renderHeader: renderHeader,
    renderFooter: renderFooter,
    toast: toast,
    modal: { open: openModal, close: closeModal },
    confirm: confirm,
    emptyState: emptyState,
    renderPagination: renderPagination,
    init: init
  };
})(window);
