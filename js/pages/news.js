/* ==========================================================================
   pages/news.js — 新闻公告列表（分类筛选 + 关键词搜索 + 分页）
   ========================================================================== */
(function () {
  'use strict';

  var PAGE_SIZE = 6;

  var state = {
    category: 'all',
    keyword: '',
    page: 1
  };

  function el(id) { return document.getElementById(id); }

  /* ------------------------------------------------------------------------
     URL 参数
     ------------------------------------------------------------------------ */
  function readUrl() {
    try {
      var params = new URLSearchParams(location.search);
      var category = params.get('category');
      if (category && ['all', 'ngyw', 'tzgg', 'xshd'].indexOf(category) >= 0) {
        state.category = category;
      }
      var keyword = params.get('q');
      if (keyword) state.keyword = keyword;
      var page = Number(params.get('page'));
      if (page > 0) state.page = page;
    } catch (e) { /* 忽略 */ }
  }

  function writeUrl() {
    try {
      var params = new URLSearchParams();
      if (state.category !== 'all') params.set('category', state.category);
      if (state.keyword) params.set('q', state.keyword);
      if (state.page > 1) params.set('page', String(state.page));
      var query = params.toString();
      var url = location.pathname.split('/').pop() + (query ? '?' + query : '');
      history.replaceState(null, '', url);
    } catch (e) { /* 忽略 */ }
  }

  /* ------------------------------------------------------------------------
     渲染
     ------------------------------------------------------------------------ */
  function newsItemHtml(item) {
    var parts = I18N.dateParts(item.date);
    var pinned = item.pinned
      ? '<span class="badge badge-gold">' + UI.escapeHtml(I18N.t('common.pinned')) + '</span>'
      : '';

    return '' +
      '<li class="news-item">' +
        '<div class="news-date">' +
          '<strong>' + UI.escapeHtml(parts.day) + '</strong>' +
          '<span>' + UI.escapeHtml(parts.month) + '</span>' +
        '</div>' +
        '<div class="news-body">' +
          '<a class="news-title" href="news-detail.html?id=' + encodeURIComponent(item.id) + '">' +
            UI.escapeHtml(I18N.pick(item, 'title')) + '</a>' +
          '<p class="news-summary">' + UI.escapeHtml(I18N.pick(item, 'summary')) + '</p>' +
          '<div class="news-meta">' +
            pinned +
            '<span class="badge">' + UI.escapeHtml(I18N.label('category', item.category)) + '</span>' +
            '<span>' + UI.escapeHtml(I18N.t('common.author')) + '：' +
              UI.escapeHtml(item.author || '') + '</span>' +
            '<span>' + I18N.formatDate(item.date) + '</span>' +
            '<span>' + UI.escapeHtml(item.views || 0) + ' ' +
              UI.escapeHtml(I18N.t('common.views')) + '</span>' +
          '</div>' +
        '</div>' +
      '</li>';
  }

  function renderTabs() {
    var host = el('filter-tabs');
    if (!host) return;
    Array.prototype.forEach.call(host.querySelectorAll('[data-category]'), function (btn) {
      var isActive = btn.getAttribute('data-category') === state.category;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function render() {
    var all = Store.news.query({ category: state.category, keyword: state.keyword });
    var totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;

    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = all.slice(start, start + PAGE_SIZE);

    var listHost = el('news-list');
    if (!pageItems.length) {
      listHost.innerHTML = UI.emptyState('news.empty', 'search');
    } else {
      listHost.innerHTML = '<ul class="news-list">' +
        pageItems.map(newsItemHtml).join('') + '</ul>';
    }

    var countHost = el('result-count');
    countHost.textContent = I18N.t('common.resultCount', { n: all.length }) +
      (totalPages > 1 ? '　·　' + I18N.t('common.page', { n: state.page, m: totalPages }) : '');

    UI.renderPagination(el('pagination'), state.page, totalPages, function (next) {
      state.page = next;
      writeUrl();
      render();
      var top = document.querySelector('.toolbar');
      if (top) top.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    renderTabs();
    writeUrl();
  }

  /* ------------------------------------------------------------------------
     事件
     ------------------------------------------------------------------------ */
  function bind() {
    var tabs = el('filter-tabs');
    if (tabs) {
      tabs.addEventListener('click', function (event) {
        var btn = event.target.closest('[data-category]');
        if (!btn) return;
        state.category = btn.getAttribute('data-category');
        state.page = 1;
        render();
      });
    }

    var search = el('news-search');
    if (search) {
      search.value = state.keyword || '';
      var timer = null;
      search.addEventListener('input', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          state.keyword = search.value.trim();
          state.page = 1;
          render();
        }, 220);
      });
      search.addEventListener('search', function () {
        state.keyword = search.value.trim();
        state.page = 1;
        render();
      });
    }
  }

  /* ------------------------------------------------------------------------
     初始化
     ------------------------------------------------------------------------ */
  UI.init();
  Auth.init();

  var searchIcon = el('search-icon');
  if (searchIcon) searchIcon.innerHTML = UI.ICONS.search;

  readUrl();
  bind();
  render();

  document.addEventListener('langchange', function () {
    render();
    I18N.apply(document);
  });
})();
