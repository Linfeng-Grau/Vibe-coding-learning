/* ==========================================================================
   pages/news-detail.js — 新闻详情（?id=N）
   ========================================================================== */
(function () {
  'use strict';

  var newsId = 0;

  function el(id) { return document.getElementById(id); }

  function readId() {
    try {
      var params = new URLSearchParams(location.search);
      return Number(params.get('id')) || 0;
    } catch (e) {
      return 0;
    }
  }

  function renderNotFound() {
    el('page-heading').textContent = I18N.t('news.notFound');
    el('crumb-current').textContent = '';
    el('related-list').innerHTML = '';
    el('article-host').innerHTML =
      '<div class="card">' + UI.emptyState('news.notFoundDesc', 'news') +
      '<div class="text-center"><a class="btn btn-outline" href="news.html" data-i18n="common.backToList"></a></div></div>';
    I18N.apply(document);
  }

  function renderArticle(item) {
    var title = I18N.pick(item, 'title');
    var content = I18N.pick(item, 'content');
    if (!content) content = '<p>' + UI.escapeHtml(I18N.pick(item, 'summary')) + '</p>';

    document.title = title + ' · ' + I18N.t('site.name');
    el('page-heading').textContent = I18N.label('category', item.category);
    el('crumb-current').textContent = title;

    el('article-host').innerHTML =
      '<article class="article card">' +
        '<h1 class="article-title">' + UI.escapeHtml(title) + '</h1>' +
        '<div class="article-meta">' +
          '<span class="badge">' + UI.escapeHtml(I18N.label('category', item.category)) + '</span>' +
          (item.pinned
            ? '<span class="badge badge-gold">' + UI.escapeHtml(I18N.t('common.pinned')) + '</span>'
            : '') +
          '<span>' + UI.escapeHtml(I18N.t('common.author')) + '：' +
            UI.escapeHtml(item.author || '') + '</span>' +
          '<span>' + UI.escapeHtml(I18N.t('news.detail.meta')) + ' ' +
            I18N.formatDate(item.date) + '</span>' +
          '<span>' + UI.escapeHtml(item.views || 0) + ' ' +
            UI.escapeHtml(I18N.t('news.views')) + '</span>' +
        '</div>' +
        '<div class="prose">' + content + '</div>' +
      '</article>';
  }

  function renderRelated() {
    var host = el('related-list');
    var items = Store.news.related(newsId, 6);
    if (!items.length) {
      host.innerHTML = '<li class="text-muted">' + UI.escapeHtml(I18N.t('common.noData')) + '</li>';
      return;
    }
    host.innerHTML = items.map(function (item) {
      return '<li>' +
        '<a href="news-detail.html?id=' + encodeURIComponent(item.id) + '">' +
          UI.escapeHtml(I18N.pick(item, 'title')) + '</a>' +
        '<div class="text-muted" style="font-size:12.5px">' +
          I18N.formatDate(item.date) + '</div>' +
        '</li>';
    }).join('');
  }

  function renderAll() {
    var item = Store.news.byId(newsId);
    if (!item) {
      renderNotFound();
      return;
    }
    renderArticle(item);
    renderRelated();
  }

  /* ------------------------------------------------------------------------
     初始化
     ------------------------------------------------------------------------ */
  UI.init();
  Auth.init();

  newsId = readId();
  if (newsId) {
    /* 浏览量 +1；同时更新本页展示用的快照 */
    Store.news.incrementViews(newsId);
  }
  renderAll();

  document.addEventListener('langchange', renderAll);
})();
