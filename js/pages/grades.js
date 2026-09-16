/* ==========================================================================
   pages/grades.js — 成绩查询
   学生：个人成绩单（按学期分组）+ 加权平均分 + 平均绩点
   教师：所授课程的学生成绩（只读）
   ========================================================================== */
(function () {
  'use strict';

  var user = null;
  var selectedCourse = '';

  function el(id) { return document.getElementById(id); }

  function scoreClass(score) {
    var s = Number(score) || 0;
    if (s >= 90) return 'badge-green';
    if (s < 60) return 'badge-danger';
    if (s < 70) return 'badge-warn';
    return 'badge';
  }

  /* ------------------------------------------------------------------------
     顶部信息
     ------------------------------------------------------------------------ */
  function renderScope() {
    var host = el('scope-info');
    if (!host) return;

    if (user.role === 'student') {
      host.innerHTML =
        '<div>' +
          '<strong>' + UI.escapeHtml(user.name) + '</strong>' +
          '<span class="text-muted" style="font-size:13px"> · ' +
            UI.escapeHtml(I18N.label('role', user.role)) + '</span>' +
        '</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">' +
          '<span class="badge">' + UI.escapeHtml(user.className || '-') + '</span>' +
          '<span class="badge">' + UI.escapeHtml(user.major || '') + '</span>' +
          '<span class="badge badge-muted">' + UI.escapeHtml(I18N.t('grades.col.studentNo')) +
            '：' + UI.escapeHtml(user.studentNo || '-') + '</span>' +
        '</div>';
    } else {
      host.innerHTML =
        '<div>' +
          '<strong>' + UI.escapeHtml(user.name) + '</strong>' +
          '<span class="text-muted" style="font-size:13px"> · ' +
            UI.escapeHtml(I18N.label('role', user.role)) + '</span>' +
          '<p class="text-muted" style="font-size:13px;margin:4px 0 0">' +
            UI.escapeHtml(user.role === 'admin'
              ? I18N.t('grades.adminDesc')
              : I18N.t('grades.teacherDesc')) + '</p>' +
        '</div>';
    }
  }

  /* ------------------------------------------------------------------------
     教师端 / 管理员端：课程筛选
     ------------------------------------------------------------------------ */
  /** 当前角色可见的成绩记录：教师看自己所授课程，管理员看全部 */
  function visibleRecords() {
    var all = user.role === 'admin'
      ? Store.grades.all()
      : Store.grades.byTeacher(user.name);
    if (!selectedCourse) return all;
    return all.filter(function (g) { return g.courseZh === selectedCourse; });
  }

  /** 当前角色可筛选的课程名 */
  function visibleCourseNames() {
    if (user.role === 'admin') {
      var seen = [];
      Store.grades.all().forEach(function (g) {
        if (seen.indexOf(g.courseZh) < 0) seen.push(g.courseZh);
      });
      return seen;
    }
    return Store.courses.courseNamesOfTeacher(user.name);
  }

  function renderCoursePicker() {
    var host = el('course-picker');
    if (!host || user.role === 'student') {
      if (host) host.innerHTML = '';
      return;
    }

    var names = visibleCourseNames();
    if (names.length < 2) {
      host.innerHTML = '';
      return;
    }

    host.innerHTML =
      '<label class="sr-only" for="course-select">' +
        UI.escapeHtml(I18N.t('grades.filterCourse')) + '</label>' +
      '<select class="select" id="course-select">' +
        '<option value="">' + UI.escapeHtml(I18N.t('common.all')) + '</option>' +
        names.map(function (name) {
          return '<option value="' + UI.escapeHtml(name) + '"' +
            (name === selectedCourse ? ' selected' : '') + '>' +
            UI.escapeHtml(name) + '</option>';
        }).join('') +
      '</select>';

    host.querySelector('#course-select').addEventListener('change', function (event) {
      selectedCourse = event.target.value;
      renderAll();
    });
  }

  /* ------------------------------------------------------------------------
     统计卡片
     ------------------------------------------------------------------------ */
  function statCard(label, value, unit) {
    return '<div class="admin-stat">' +
      '<div class="admin-stat-label">' + UI.escapeHtml(label) + '</div>' +
      '<div class="admin-stat-value">' + UI.escapeHtml(value) +
        (unit ? '<small style="font-size:14px">' + UI.escapeHtml(unit) + '</small>' : '') +
      '</div></div>';
  }

  function renderSummary() {
    var host = el('summary');
    if (!host) return;

    if (user.role === 'student') {
      var summary = Store.grades.summary(user.id);
      host.innerHTML =
        statCard(I18N.t('grades.summary.courses'), summary.courseCount, '') +
        statCard(I18N.t('grades.summary.credits'), summary.totalCredit, '') +
        statCard(I18N.t('grades.summary.average'), summary.average, '') +
        statCard(I18N.t('grades.summary.gpa'), summary.gpa, '');
      return;
    }

    var records = visibleRecords();
    if (!records.length) {
      host.innerHTML = '';
      return;
    }
    var scores = records.map(function (g) { return Number(g.score) || 0; });
    var sum = scores.reduce(function (a, b) { return a + b; }, 0);
    var passed = scores.filter(function (s) { return s >= 60; }).length;

    host.innerHTML =
      statCard(I18N.t('grades.statAvg'), Math.round(sum / scores.length * 100) / 100, '') +
      statCard(I18N.t('grades.statPass'),
        Math.round(passed / scores.length * 1000) / 10, '%') +
      statCard(I18N.t('grades.statMax'), Math.max.apply(null, scores), '') +
      statCard(I18N.t('grades.statMin'), Math.min.apply(null, scores), '');
  }

  /* ------------------------------------------------------------------------
     学生端：按学期分组的成绩单
     ------------------------------------------------------------------------ */
  function renderStudentGrades() {
    var host = el('grades-host');
    var groups = Store.grades.byStudentGrouped(user.id);

    if (!groups.length) {
      host.innerHTML = UI.emptyState('grades.empty', 'chart');
      return;
    }

    host.innerHTML = groups.map(function (group) {
      var credit = 0;
      var weighted = 0;
      var body = group.items.map(function (g) {
        var c = Number(g.credit) || 0;
        credit += c;
        weighted += (Number(g.score) || 0) * c;
        return '<tr>' +
          '<td>' + UI.escapeHtml(I18N.pick(g, 'course')) + '</td>' +
          '<td class="num">' + c + '</td>' +
          '<td>' + UI.escapeHtml(g.examType || '') + '</td>' +
          '<td class="num"><span class="badge ' + scoreClass(g.score) + '">' +
            UI.escapeHtml(g.score) + '</span></td>' +
          '<td class="num">' + Store.gradePoint(g.score).toFixed(1) + '</td>' +
          '</tr>';
      }).join('');

      var avg = credit ? Math.round(weighted / credit * 100) / 100 : 0;

      return '' +
        '<div class="table-wrap mb-2">' +
          '<table class="data-table">' +
            '<caption>' + UI.escapeHtml(group.term) +
              '<span class="text-muted" style="font-weight:400;font-size:13px"> · ' +
                UI.escapeHtml(I18N.t('grades.termStat')) + ' ' + avg +
              '</span>' +
            '</caption>' +
            '<thead><tr>' +
              '<th scope="col">' + UI.escapeHtml(I18N.t('grades.col.course')) + '</th>' +
              '<th scope="col" class="num">' + UI.escapeHtml(I18N.t('grades.col.credit')) + '</th>' +
              '<th scope="col">' + UI.escapeHtml(I18N.t('grades.col.examType')) + '</th>' +
              '<th scope="col" class="num">' + UI.escapeHtml(I18N.t('grades.col.score')) + '</th>' +
              '<th scope="col" class="num">' + UI.escapeHtml(I18N.t('grades.col.point')) + '</th>' +
            '</tr></thead>' +
            '<tbody>' + body + '</tbody>' +
          '</table>' +
        '</div>';
    }).join('');
  }

  /* ------------------------------------------------------------------------
     教师端：学生成绩表
     ------------------------------------------------------------------------ */
  function renderTeacherGrades() {
    var host = el('grades-host');
    var records = visibleRecords();

    if (!records.length) {
      host.innerHTML = UI.emptyState('grades.empty', 'chart');
      return;
    }

    records.sort(function (a, b) {
      if (a.courseZh !== b.courseZh) return String(a.courseZh).localeCompare(String(b.courseZh));
      return String(a.term).localeCompare(String(b.term));
    });

    var body = records.map(function (g) {
      var student = Store.users.byId(g.studentId) || {};
      return '<tr>' +
        '<td>' + UI.escapeHtml(student.studentNo || '-') + '</td>' +
        '<td>' + UI.escapeHtml(student.name || '-') + '</td>' +
        '<td>' + UI.escapeHtml(student.className || g.className || '-') + '</td>' +
        '<td>' + UI.escapeHtml(I18N.pick(g, 'course')) + '</td>' +
        '<td>' + UI.escapeHtml(g.term) + '</td>' +
        '<td>' + UI.escapeHtml(g.examType || '') + '</td>' +
        '<td class="num"><span class="badge ' + scoreClass(g.score) + '">' +
          UI.escapeHtml(g.score) + '</span></td>' +
        '<td class="num">' + Store.gradePoint(g.score).toFixed(1) + '</td>' +
        '</tr>';
    }).join('');

    host.innerHTML =
      '<div class="table-wrap">' +
        '<table class="data-table">' +
          '<caption>' + UI.escapeHtml(user.role === 'admin'
            ? I18N.t('grades.adminTitle')
            : I18N.t('grades.teacherTitle')) + '</caption>' +
          '<thead><tr>' +
            '<th scope="col">' + UI.escapeHtml(I18N.t('grades.col.studentNo')) + '</th>' +
            '<th scope="col">' + UI.escapeHtml(I18N.t('grades.col.student')) + '</th>' +
            '<th scope="col">' + UI.escapeHtml(I18N.t('grades.col.class')) + '</th>' +
            '<th scope="col">' + UI.escapeHtml(I18N.t('grades.col.course')) + '</th>' +
            '<th scope="col">' + UI.escapeHtml(I18N.t('grades.col.term')) + '</th>' +
            '<th scope="col">' + UI.escapeHtml(I18N.t('grades.col.examType')) + '</th>' +
            '<th scope="col" class="num">' + UI.escapeHtml(I18N.t('grades.col.score')) + '</th>' +
            '<th scope="col" class="num">' + UI.escapeHtml(I18N.t('grades.col.point')) + '</th>' +
          '</tr></thead>' +
          '<tbody>' + body + '</tbody>' +
        '</table>' +
      '</div>';
  }

  function renderNote() {
    var host = el('note');
    if (!host) return;
    var parts = [];
    if (user.role === 'student') parts.push(I18N.t('grades.note'));
    if (user.role !== 'student') parts.push(I18N.t('grades.readonlyNote'));
    var zh = '演示说明：成绩为示例数据，仅用于功能展示。';
    var en = 'Demo note: all grades are sample data used to demonstrate this feature.';
    parts.push(I18N.getLang() === 'en' ? en : zh);
    host.textContent = parts.join(' ');
  }

  /* ------------------------------------------------------------------------
     初始化
     ------------------------------------------------------------------------ */
  UI.init();
  Auth.init();

  user = Auth.guard(['student', 'teacher', 'admin']);

  if (user) {
    var renderAll = function () {
      renderScope();
      renderCoursePicker();
      renderSummary();
      if (user.role === 'student') {
        renderStudentGrades();
      } else {
        renderTeacherGrades();
      }
      renderNote();
      I18N.apply(document);
    };

    renderAll();
    document.addEventListener('langchange', renderAll);
  }
})();
