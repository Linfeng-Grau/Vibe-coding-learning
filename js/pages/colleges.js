/* ==========================================================================
   pages/colleges.js — 院系设置
   ========================================================================== */
(function () {
  'use strict';

  var SCHOOL = Store.SCHOOL;

  function el(id) { return document.getElementById(id); }

  function schoolCount() {
    return SCHOOL.colleges.reduce(function (sum, division) {
      return sum + division.schools.length;
    }, 0);
  }

  function renderStats() {
    var host = el('colleges-stats');
    if (!host) return;
    var lang = I18N.getLang();
    var teachingUnits = SCHOOL.colleges.length;
    var schools = schoolCount();

    var items = [
      {
        value: '11', unit: lang === 'en' ? 'divisions' : '个学部',
        label: lang === 'en' ? 'Academic divisions' : '学部数量'
      },
      {
        value: '29', unit: lang === 'en' ? 'schools' : '个学院',
        label: lang === 'en' ? 'Schools and colleges' : '学院数量'
      },
      {
        value: String(schools), unit: lang === 'en' ? 'units listed' : '个单位',
        label: lang === 'en' ? 'Units listed below' : '下列出的教学单位'
      },
      {
        value: '10', unit: lang === 'en' ? 'categories' : '个门类',
        label: lang === 'en' ? 'Discipline categories' : '学科门类'
      }
    ];

    host.innerHTML = items.map(function (item) {
      return '<div class="stat">' +
        '<div class="stat-value">' + UI.escapeHtml(item.value) +
          '<small>' + UI.escapeHtml(item.unit) + '</small></div>' +
        '<div class="stat-label">' + UI.escapeHtml(item.label) + '</div>' +
        '</div>';
    }).join('');
  }

  function renderDivisions() {
    var host = el('colleges-list');
    if (!host) return;

    host.innerHTML = SCHOOL.colleges.map(function (division, index) {
      var name = I18N.pick(division, 'name');
      var open = index === 0;
      var chips = division.schools.map(function (school) {
        return '<span class="college-chip">' + UI.escapeHtml(I18N.pick(school, 'name')) + '</span>';
      }).join('');

      return '' +
        '<div class="accordion">' +
          '<button type="button" class="accordion-toggle" aria-expanded="' +
            (open ? 'true' : 'false') + '" data-accordion-toggle>' +
            '<span>' + UI.escapeHtml(name) +
              '<span class="text-muted" style="display:block;font-size:12.5px;font-weight:400">' +
                UI.escapeHtml(I18N.t('colleges.schoolCount', { n: division.schools.length })) +
              '</span>' +
            '</span>' +
            '<span class="chev" aria-hidden="true"></span>' +
          '</button>' +
          '<div class="accordion-panel"' + (open ? '' : ' hidden') + '>' +
            '<div class="college-chips">' + chips + '</div>' +
          '</div>' +
        '</div>';
    }).join('');

    host.onclick = function (event) {
      var toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return;
      var panel = toggle.nextElementSibling;
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (panel) panel.hidden = expanded;
    };
  }

  function renderAll() {
    renderStats();
    renderDivisions();
    I18N.apply(document);
  }

  UI.init();
  Auth.init();
  renderAll();

  document.addEventListener('langchange', function () {
    /* 语言切换会重建列表，默认展开第一个学部 */
    renderAll();
  });
})();
