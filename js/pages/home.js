/* ==========================================================================
   pages/home.js — 首页
   ========================================================================== */
(function () {
  'use strict';

  var SCHOOL = Store.SCHOOL;

  function el(id) {
    return document.getElementById(id);
  }

  /* ------------------------------------------------------------------------
     Hero
     ------------------------------------------------------------------------ */
  function renderHero() {
    var hero = SCHOOL.hero;
    el('hero-eyebrow').textContent = I18N.pick(hero, 'eyebrow');
    el('hero-title').textContent = I18N.pick(hero, 'title');
    el('hero-motto').textContent = I18N.pick(SCHOOL, 'motto');
    el('hero-desc').textContent = I18N.pick(hero, 'desc');
    el('hero-credit').textContent = I18N.pick(hero, 'imageCredit');
  }

  /* ------------------------------------------------------------------------
     学校数据
     ------------------------------------------------------------------------ */
  function renderStats() {
    var host = el('stat-strip');
    if (!host) return;

    host.innerHTML = SCHOOL.stats.map(function (stat) {
      var lang = I18N.getLang();
      var value = lang === 'en' ? stat.valueEn : stat.value;
      var unit = lang === 'en' ? stat.unitEn : stat.unit;
      return '' +
        '<div class="stat">' +
          '<div class="stat-value">' + UI.escapeHtml(value) +
            '<small>' + UI.escapeHtml(unit) + '</small>' +
          '</div>' +
          '<div class="stat-label">' + UI.escapeHtml(I18N.pick(stat, 'label')) + '</div>' +
        '</div>';
    }).join('');
  }

  /* ------------------------------------------------------------------------
     办学特色
     ------------------------------------------------------------------------ */
  function renderHighlights() {
    var host = el('highlight-grid');
    if (!host) return;

    host.innerHTML = SCHOOL.highlights.map(function (item) {
      return '' +
        '<article class="card card-hover">' +
          '<span class="entry-icon">' + (UI.ICONS[item.icon] || '') + '</span>' +
          '<h3 class="card-title">' + UI.escapeHtml(I18N.pick(item, 'title')) + '</h3>' +
          '<p class="card-text">' + UI.escapeHtml(I18N.pick(item, 'text')) + '</p>' +
        '</article>';
    }).join('');
  }

  /* ------------------------------------------------------------------------
     新闻列表
     ------------------------------------------------------------------------ */
  function newsItemHtml(item) {
    var parts = I18N.dateParts(item.date);
    var title = I18N.pick(item, 'title');
    var summary = I18N.pick(item, 'summary');
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
            UI.escapeHtml(title) + '</a>' +
          '<p class="news-summary">' + UI.escapeHtml(summary) + '</p>' +
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

  function renderNewsBlock(hostId, category, limit) {
    var host = el(hostId);
    if (!host) return;

    var items = Store.news.query({ category: category }).slice(0, limit);
    if (!items.length) {
      host.innerHTML = UI.emptyState('common.noData', 'news');
      return;
    }
    host.innerHTML = '<ul class="news-list">' +
      items.map(newsItemHtml).join('') + '</ul>';
  }

  function renderNews() {
    renderNewsBlock('news-list', 'ngyw', 4);
    renderNewsBlock('notice-list', 'tzgg', 5);
    renderNewsBlock('academic-list', 'xshd', 4);
  }

  /* ------------------------------------------------------------------------
     常用链接
     ------------------------------------------------------------------------ */
  function renderQuickLinks() {
    var host = el('quick-links');
    if (!host) return;

    host.innerHTML = SCHOOL.quickLinks.map(function (link) {
      return '' +
        '<a class="card card-hover entry-card" href="' + UI.escapeHtml(link.url) + '" ' +
          'target="_blank" rel="noopener" style="flex-direction:row;align-items:center;gap:14px">' +
          '<span class="entry-icon" style="margin:0">' + UI.ICONS.arrowRight + '</span>' +
          '<span>' +
            '<strong style="display:block;color:var(--ink-900)">' +
              UI.escapeHtml(I18N.pick(link, 'label')) + '</strong>' +
            '<span class="text-muted" style="font-size:12.5px">' +
              UI.escapeHtml(link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')) + '</span>' +
          '</span>' +
        '</a>';
    }).join('');
  }

  /* ------------------------------------------------------------------------
     图标占位
     ------------------------------------------------------------------------ */
  function fillIcons() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-icon]'), function (node) {
      var name = node.getAttribute('data-icon');
      if (UI.ICONS[name]) node.innerHTML = UI.ICONS[name];
    });
  }

  /* ------------------------------------------------------------------------
     初始化
     ------------------------------------------------------------------------ */
  function renderAll() {
    renderHero();
    renderStats();
    renderHighlights();
    renderNews();
    renderQuickLinks();
    fillIcons();
    I18N.apply(document);
  }

  UI.init();
  Auth.init();
  renderAll();

  document.addEventListener('langchange', function () {
    renderAll();
  });
})();
