/* ==========================================================================
   pages/courses.js — 课程表
   学生：查看本班课表
   教师：查看自己授课安排（可跨多个班级）
   管理员：可切换查看任意班级
   ========================================================================== */
(function () {
  'use strict';

  var PERIODS = ['1-2', '3-4', '5-6', '7-8'];
  var DAYS = [1, 2, 3, 4, 5];

  var user = null;
  var selectedClass = '';

  function el(id) { return document.getElementById(id); }

  function periodLabel(period) {
    return I18N.t('courses.period.' + period.replace('-', ''));
  }

  /* ------------------------------------------------------------------------
     数据准备
     ------------------------------------------------------------------------ */
  function getRows() {
    if (user.role === 'teacher') {
      /* 教师：自己的全部授课记录 */
      return Store.courses.byTeacher(user.name);
    }
    /* 学生与管理员：按班级取课表 */
    var className = user.role === 'admin'
      ? (selectedClass || Store.courses.allClasses()[0] || '')
      : user.className;
    return Store.courses.byClass(className);
  }

  /* ------------------------------------------------------------------------
     顶部信息与班级选择器
     ------------------------------------------------------------------------ */
  function renderScope() {
    var host = el('scope-info');
    if (!host) return;

    if (user.role === 'teacher') {
      var classes = Store.courses.classesOfTeacher(user.name);
      host.innerHTML =
        '<div>' +
          '<strong>' + UI.escapeHtml(user.name) + '</strong>' +
          '<span class="text-muted" style="font-size:13px"> · ' +
            UI.escapeHtml(I18N.label('role', user.role)) + '</span>' +
          '<p class="text-muted" style="font-size:13px;margin:4px 0 0">' +
            UI.escapeHtml(I18N.t('courses.teacherNote')) + '</p>' +
        '</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">' +
          classes.map(function (name) {
            return '<span class="badge">' + UI.escapeHtml(name) + '</span>';
          }).join('') +
        '</div>';
      return;
    }

    if (user.role === 'admin') {
      var all = Store.courses.allClasses();
      host.innerHTML =
        '<div>' +
          '<strong>' + UI.escapeHtml(user.name) + '</strong>' +
          '<span class="text-muted" style="font-size:13px"> · ' +
            UI.escapeHtml(I18N.label('role', user.role)) + '</span>' +
          '<p class="text-muted" style="font-size:13px;margin:4px 0 0">' +
            UI.escapeHtml(I18N.t('courses.studentNote')) + '</p>' +
        '</div>';

      var picker = el('class-picker');
      picker.innerHTML =
        '<label class="sr-only" for="class-select">' + UI.escapeHtml(I18N.t('courses.col.class')) + '</label>' +
        '<select class="select" id="class-select">' +
          all.map(function (name) {
            return '<option value="' + UI.escapeHtml(name) + '"' +
              (name === selectedClass ? ' selected' : '') + '>' +
              UI.escapeHtml(name) + '</option>';
          }).join('') +
        '</select>';
      picker.querySelector('#class-select').addEventListener('change', function (event) {
        selectedClass = event.target.value;
        renderAll();
      });
      return;
    }

    /* 学生 */
    host.innerHTML =
      '<div>' +
        '<strong>' + UI.escapeHtml(user.name) + '</strong>' +
        '<span class="text-muted" style="font-size:13px"> · ' +
          UI.escapeHtml(I18N.label('role', user.role)) + '</span>' +
        '<p class="text-muted" style="font-size:13px;margin:4px 0 0">' +
          UI.escapeHtml(I18N.t('courses.studentNote')) + '</p>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">' +
        '<span class="badge">' + UI.escapeHtml(I18N.t('courses.studentClass')) + '：' +
          UI.escapeHtml(user.className || '-') + '</span>' +
        '<span class="badge">' + UI.escapeHtml(user.major || '') + '</span>' +
        '<span class="badge badge-muted">' + UI.escapeHtml(user.studentNo || '') + '</span>' +
      '</div>';
  }

  /* ------------------------------------------------------------------------
     课表渲染
     ------------------------------------------------------------------------ */
  function cellHtml(entries) {
    if (!entries.length) return '';
    return entries.map(function (course) {
      var lines = [
        '<strong>' + UI.escapeHtml(I18N.pick(course, 'course')) + '</strong>',
        '<span>' + UI.escapeHtml(course.teacherName || '') + '</span>',
        '<span>' + UI.escapeHtml(course.room || '') + '</span>'
      ];
      if (user.role !== 'student' && course.className) {
        lines.push('<span>' + UI.escapeHtml(course.className) + '</span>');
      }
      return '<span class="course-cell">' + lines.join('') + '</span>';
    }).join('');
  }

  function renderTimetable() {
    var host = el('timetable-host');
    var rows = getRows();

    var captionText = user.role === 'teacher'
      ? I18N.t('courses.teacherCaption', { name: user.name })
      : I18N.t('courses.tableCaption', {
          name: user.role === 'admin' ? (selectedClass || '-') : (user.className || '-')
        });

    if (!rows.length) {
      host.innerHTML = UI.emptyState('courses.empty', 'calendar');
      return;
    }

    var head = '<tr><th scope="col">' + UI.escapeHtml(I18N.t('courses.col.period')) + '</th>' +
      DAYS.map(function (day) {
        return '<th scope="col">' + UI.escapeHtml(I18N.t('courses.weekday.' + day)) + '</th>';
      }).join('') + '</tr>';

    var body = PERIODS.map(function (period) {
      var cells = DAYS.map(function (day) {
        var entries = rows.filter(function (course) {
          return Number(course.dayOfWeek) === day && course.period === period;
        });
        return '<td>' + cellHtml(entries) + '</td>';
      }).join('');
      return '<tr><th scope="row">' + UI.escapeHtml(periodLabel(period)) + '</th>' + cells + '</tr>';
    }).join('');

    host.innerHTML =
      '<table class="data-table timetable">' +
        '<caption>' + UI.escapeHtml(captionText) + '</caption>' +
        '<thead>' + head + '</thead>' +
        '<tbody>' + body + '</tbody>' +
      '</table>';
  }

  /* ------------------------------------------------------------------------
     统计信息
     ------------------------------------------------------------------------ */
  function renderSummary() {
    var host = el('summary');
    var rows = getRows();

    if (!rows.length) {
      host.innerHTML = '';
      return;
    }

    var uniqueCourses = [];
    var credit = 0;
    rows.forEach(function (course) {
      var key = I18N.pick(course, 'course') + '|' + (course.className || '');
      if (uniqueCourses.indexOf(key) < 0) {
        uniqueCourses.push(key);
        credit += Number(course.credit) || 0;
      }
    });

    host.innerHTML =
      '<div class="grid grid-2" style="max-width:560px">' +
        '<div class="card" style="padding:16px 20px">' +
          '<div class="stat-label">' + UI.escapeHtml(I18N.t('courses.summary.courses')) + '</div>' +
          '<div class="stat-value" style="font-size:22px;text-align:left">' +
            uniqueCourses.length + '<small>' +
            UI.escapeHtml(I18N.getLang() === 'en' ? 'courses' : '门') + '</small></div>' +
        '</div>' +
        '<div class="card" style="padding:16px 20px">' +
          '<div class="stat-label">' + UI.escapeHtml(I18N.t('courses.summary.credits')) + '</div>' +
          '<div class="stat-value" style="font-size:22px;text-align:left">' +
            credit + '<small>' +
            UI.escapeHtml(I18N.getLang() === 'en' ? 'credits' : '学分') + '</small></div>' +
        '</div>' +
      '</div>';
  }

  function renderNote() {
    var host = el('note');
    if (!host) return;
    var zh = '说明：课表数据为演示用示例数据，依据学校专业培养方案结构编排，非真实教学安排。';
    var en = 'Note: this timetable uses sample data structured after real engineering curricula; it is not an actual teaching schedule.';
    host.textContent = I18N.getLang() === 'en' ? en : zh;
  }

  /* ------------------------------------------------------------------------
     初始化
     ------------------------------------------------------------------------ */
  UI.init();
  Auth.init();

  user = Auth.guard(['student', 'teacher', 'admin']);

  if (user) {
    if (user.role === 'admin') {
      selectedClass = Store.courses.allClasses()[0] || '';
    }

    var renderAll = function () {
      renderScope();
      renderSummary();
      renderTimetable();
      renderNote();
      I18N.apply(document);
    };

    renderAll();
    document.addEventListener('langchange', renderAll);
  }
})();
