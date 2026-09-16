/* ==========================================================================
   pages/about.js — 学校概况
   ========================================================================== */
(function () {
  'use strict';

  var SCHOOL = Store.SCHOOL;

  function el(id) { return document.getElementById(id); }

  function renderIntro() {
    var host = el('intro-body');
    if (!host) return;
    var lang = I18N.getLang();
    var text = lang === 'en' ? SCHOOL.intro.en : SCHOOL.intro.zh;
    host.innerHTML = '<p>' + UI.escapeHtml(text) + '</p>';

    /* 院系数量补充说明 */
    var extraZh = '学校设有 11 个学部、29 个学院，各类学生 4 万余人。设有材料化学工程全国重点实验室、柔性电子全国重点实验室等 9 个国家级科研平台，省部级研究中心 48 个、省部级重点实验室 31 个。';
    var extraEn = 'NJTech comprises 11 divisions and 29 schools with over 40,000 students. It hosts nine national research platforms — including the National Key Laboratory of Materials-Oriented Chemical Engineering and the National Key Laboratory of Flexible Electronics — along with 48 provincial and ministerial research centers and 31 key laboratories.';
    host.innerHTML += '<p>' + UI.escapeHtml(lang === 'en' ? extraEn : extraZh) + '</p>';
  }

  function renderMotto() {
    var host = el('motto-card');
    if (!host) return;
    var lang = I18N.getLang();
    var ethosLabel = lang === 'en' ? 'University ethos' : '校风';
    var ethosValue = lang === 'en' ? SCHOOL.ethosEn : SCHOOL.ethosZh;
    host.innerHTML =
      '<p style="font-size:22px;font-weight:700;letter-spacing:.28em;color:var(--brand-700);margin:0 0 12px">' +
        UI.escapeHtml(lang === 'en' ? SCHOOL.mottoEn : SCHOOL.mottoZh) +
      '</p>' +
      '<p class="text-muted" style="font-size:13.5px;margin:0">' +
        UI.escapeHtml(ethosLabel) + '：' + UI.escapeHtml(ethosValue) +
      '</p>';
  }

  function renderFacts() {
    var host = el('facts-list');
    if (!host) return;
    host.innerHTML = SCHOOL.facts.map(function (fact) {
      return '<div>' +
        '<dt>' + UI.escapeHtml(I18N.pick(fact, 'label')) + '</dt>' +
        '<dd>' + UI.escapeHtml(I18N.pick(fact, 'value')) + '</dd>' +
        '</div>';
    }).join('');
  }

  function renderTimeline() {
    var host = el('timeline');
    if (!host) return;
    host.innerHTML = SCHOOL.timeline.map(function (item) {
      return '<li>' +
        '<span class="timeline-year">' + UI.escapeHtml(item.year) + '</span>' +
        '<p>' + UI.escapeHtml(I18N.pick(item, 'text')) + '</p>' +
        '</li>';
    }).join('');
  }

  function renderLeaders() {
    var host = el('leaders-body');
    if (!host) return;
    host.innerHTML = SCHOOL.leaders.map(function (p) {
      return '<tr>' +
        '<td><strong>' + UI.escapeHtml(I18N.pick(p, 'name')) + '</strong></td>' +
        '<td>' + UI.escapeHtml(I18N.pick(p, 'post')) + '</td>' +
        '</tr>';
    }).join('');
  }

  function renderCampuses() {
    var host = el('campus-grid');
    if (!host) return;
    host.innerHTML = SCHOOL.campuses.map(function (c) {
      return '<article class="card card-hover">' +
        '<span class="entry-icon">' + UI.ICONS.globe + '</span>' +
        '<h3 class="card-title">' + UI.escapeHtml(I18N.pick(c, 'name')) + '</h3>' +
        '<p class="card-text">' + UI.escapeHtml(I18N.pick(c, 'address')) + '</p>' +
        '<p class="text-muted mt-2" style="font-size:13px">' +
          UI.escapeHtml(I18N.t('about.campus.zip')) + ' ' + UI.escapeHtml(c.zip) +
        '</p>' +
        '</article>';
    }).join('');
  }

  function renderAll() {
    renderIntro();
    renderMotto();
    renderFacts();
    renderTimeline();
    renderLeaders();
    renderCampuses();
    I18N.apply(document);
  }

  UI.init();
  Auth.init();
  renderAll();

  document.addEventListener('langchange', renderAll);
})();
