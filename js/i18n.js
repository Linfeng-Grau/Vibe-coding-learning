/* ==========================================================================
   i18n.js — 中英双语模块
   用法：
     1) HTML 中标注 data-i18n="key"（文本）、data-i18n-html、data-i18n-placeholder、
        data-i18n-title、data-i18n-value
     2) JS 中用 I18N.t('key') 取文案；用 I18N.pick(item, 'title') 取数据对象里的
        titleZh / titleEn 字段
     3) 语言变化时 document 上会派发 'langchange' 事件，动态内容可监听后重渲染
   ========================================================================== */
(function (global) {
  'use strict';

  var DICT = {
    /* ===================== 中文 ===================== */
    zh: {
      /* 站点与导航 */
      'site.name': '南京工业大学',
      'site.nameEn': 'Nanjing Tech University',
      'site.portal': '门户网站',
      'site.motto': '明德 厚学 沉毅 笃行',
      'site.logoAlt': '南京工业大学 校徽与校名标志',

      'topbar.slogan': '明德 厚学 沉毅 笃行',
      'topbar.smart': '智慧南工',
      'topbar.mail': '邮箱',
      'topbar.oa': '办公系统',
      'lang.label': '语言',
      'lang.zh': '中文',
      'lang.en': 'EN',

      'nav.home': '首页',
      'nav.about': '学校概况',
      'nav.colleges': '院系设置',
      'nav.news': '新闻公告',
      'nav.courses': '课程表',
      'nav.grades': '成绩查询',
      'nav.admin': '后台管理',
      'nav.login': '登录',
      'nav.logout': '退出登录',
      'nav.menu': '打开导航菜单',
      'nav.portal': '智慧南工门户',

      /* 通用 */
      'common.search': '搜索',
      'common.searchPlaceholder': '输入关键词搜索',
      'common.all': '全部',
      'common.reset': '重置',
      'common.submit': '提交',
      'common.cancel': '取消',
      'common.confirm': '确认',
      'common.save': '保存',
      'common.delete': '删除',
      'common.edit': '编辑',
      'common.add': '新增',
      'common.close': '关闭',
      'common.actions': '操作',
      'common.noData': '暂无数据',
      'common.more': '查看更多',
      'common.back': '返回',
      'common.backToList': '返回列表',
      'common.readMore': '阅读全文',
      'common.author': '来源',
      'common.date': '日期',
      'common.category': '分类',
      'common.views': '浏览',
      'common.pinned': '置顶',
      'common.required': '此项为必填',
      'common.page': '第 {n} 页 / 共 {m} 页',
      'common.prevPage': '上一页',
      'common.nextPage': '下一页',
      'common.resultCount': '共 {n} 条结果',
      'common.loading': '加载中…',
      'common.viewDetail': '查看详情',
      'common.units.credit': '学分',
      'common.units.score': '分',

      /* 首页 */
      'home.hero.cta1': '了解学校概况',
      'home.hero.cta2': '查看新闻公告',
      'home.hero.scroll': '向下浏览',
      'home.overview.title': '学校数据',
      'home.overview.titleEn': 'At a Glance',
      'home.overview.desc': '以下数据统计至 2026 年 6 月，来源为南京工业大学官网。',
      'home.highlight.title': '办学特色',
      'home.highlight.titleEn': 'Distinctive Strengths',
      'home.highlight.desc': '以工为主、多学科协调发展，产学研协同创新特色鲜明。',
      'home.news.title': '南工要闻',
      'home.news.titleEn': 'Headlines',
      'home.news.desc': '聚焦学校人才培养、科学研究与校园动态。',
      'home.notice.title': '通知公告',
      'home.notice.titleEn': 'Notices',
      'home.notice.desc': '面向师生的教学、管理与服务类公告。',
      'home.academic.title': '学术活动',
      'home.academic.titleEn': 'Academics',
      'home.academic.desc': '学术会议、论坛与讲座信息。',
      'home.entry.title': '快速服务',
      'home.entry.titleEn': 'Quick Services',
      'home.entry.desc': '常用栏目与校内服务的快捷入口。',
      'home.entry.about': '学校概况',
      'home.entry.aboutText': '办学历史、校训精神、现任领导与三校区信息。',
      'home.entry.colleges': '院系设置',
      'home.entry.collegesText': '11 个学部、29 个学院的组织架构一览。',
      'home.entry.news': '新闻公告',
      'home.entry.newsText': '南工要闻、通知公告与学术活动集中发布。',
      'home.entry.courses': '课程表',
      'home.entry.coursesText': '按班级或教师查看 2026—2027 学年第一学期课表。',
      'home.entry.grades': '成绩查询',
      'home.entry.gradesText': '查看成绩单、加权平均分与平均绩点。',
      'home.entry.login': '用户登录',
      'home.entry.loginText': '学生、教师与管理员分角色进入对应服务。',
      'home.links.title': '常用链接',
      'home.links.titleEn': 'Useful Links',

      /* 学校概况 */
      'about.title': '学校概况',
      'about.desc': '南京工业大学办学历史溯源于 1902 年创办的三江师范学堂，2001 年由南京化工大学与南京建筑工程学院合并组建。',
      'about.intro.title': '学校简介',
      'about.facts.title': '基本情况',
      'about.timeline.title': '历史沿革',
      'about.timeline.desc': '以下仅列示可核实的办学节点。',
      'about.leaders.title': '现任领导',
      'about.leaders.desc': '名单来源：南京工业大学官网「现任领导」页面。',
      'about.leaders.name': '姓名',
      'about.leaders.post': '职务',
      'about.campus.title': '校区分布',
      'about.campus.desc': '学校现有江浦、丁家桥、虹桥三个校区。',
      'about.campus.zip': '邮编',
      'about.motto.title': '校训与校风',
      'about.motto.desc': '校训：明德、厚学、沉毅、笃行；校风：诚朴自强。',

      /* 院系设置 */
      'colleges.title': '院系设置',
      'colleges.desc': '学校设有 11 个学部、29 个学院，涵盖工、理、管、经、文、法、医、艺、教、交叉等 10 个学科门类。',
      'colleges.expand': '展开',
      'colleges.collapse': '收起',
      'colleges.schoolCount': '下设 {n} 个学院',
      'colleges.note': '以上学部与学院依据南京工业大学官网「办学条件 — 院系设置」公开信息整理。',

      /* 新闻公告 */
      'news.title': '新闻公告',
      'news.desc': '南工要闻、通知公告与学术活动，支持分类筛选与关键词搜索。',
      'news.cat.ngyw': '南工要闻',
      'news.cat.tzgg': '通知公告',
      'news.cat.xshd': '学术活动',
      'news.filter.all': '全部',
      'news.empty': '没有找到匹配的新闻，请尝试其他关键词。',
      'news.related.title': '相关阅读',
      'news.detail.meta': '发布于',
      'news.notFound': '未找到对应的新闻内容',
      'news.notFoundDesc': '该新闻可能已被删除，或链接参数不正确。',
      'news.views': '阅读',

      /* 登录 */
      'login.title': '用户登录',
      'login.subtitle': '请使用校内账号登录，系统将根据角色进入对应服务。',
      'login.username': '用户名',
      'login.usernamePlaceholder': '请输入用户名或学号',
      'login.password': '密码',
      'login.passwordPlaceholder': '请输入密码',
      'login.submit': '登录',
      'login.demo.title': '演示账号',
      'login.demo.desc': '点击任意账号可自动填入表单。本项目为纯前端演示，密码以明文保存在浏览器中，请勿用于真实环境。',
      'login.demo.click': '一键填入',
      'login.remember': '记住我的登录状态',
      'login.error.userNotFound': '用户名不存在，请检查后重试。',
      'login.error.wrongPassword': '密码错误，请重新输入。',
      'login.error.accountDisabled': '该账号已被停用，请联系管理员。',
      'login.error.required': '请填写用户名与密码。',
      'login.success': '登录成功，正在跳转…',
      'login.welcome': '欢迎回来',
      'login.loggedInAs': '当前登录身份',
      'login.goHome': '返回首页',
      'login.goPortal': '进入个人服务',
      'login.noPermission': '当前账号无权访问该页面，已返回首页。',
      'login.needLogin': '请先登录后再访问该页面。',

      /* 课程表 */
      'courses.title': '课程表',
      'courses.desc': '2026—2027 学年第一学期',
      'courses.studentClass': '所在班级',
      'courses.teacherMode': '授课班级',
      'courses.teacherNote': '以下为您的授课安排，含多个班级。',
      'courses.studentNote': '以下为所在班级的课表安排。',
      'courses.tableCaption': '{name} 课表',
      'courses.summary.courses': '本学期课程门数',
      'courses.summary.credits': '本学期合计学分',
      'courses.teacherCaption': '{name} 老师授课安排',
      'courses.col.period': '节次',
      'courses.col.course': '课程',
      'courses.col.teacher': '任课教师',
      'courses.col.room': '上课地点',
      'courses.col.credit': '学分',
      'courses.col.class': '班级',
      'courses.period.12': '第 1—2 节',
      'courses.period.34': '第 3—4 节',
      'courses.period.56': '第 5—6 节',
      'courses.period.78': '第 7—8 节',
      'courses.weekday.1': '星期一',
      'courses.weekday.2': '星期二',
      'courses.weekday.3': '星期三',
      'courses.weekday.4': '星期四',
      'courses.weekday.5': '星期五',
      'courses.empty': '本学期暂无排课记录。',
      'courses.totalCourses': '本学期共 {n} 门课程',
      'courses.totalCredit': '合计 {n} 学分',

      /* 成绩 */
      'grades.title': '成绩查询',
      'grades.desc': '查看历史成绩单、加权平均分与平均绩点。',
      'grades.summary.courses': '已修课程',
      'grades.summary.credits': '累计学分',
      'grades.summary.average': '加权平均分',
      'grades.summary.gpa': '平均绩点',
      'grades.col.term': '学期',
      'grades.col.course': '课程名称',
      'grades.col.credit': '学分',
      'grades.col.examType': '考核方式',
      'grades.col.score': '成绩',
      'grades.col.point': '绩点',
      'grades.col.class': '班级',
      'grades.col.student': '学生',
      'grades.col.studentNo': '学号',
      'grades.termStat': '学期加权平均分',
      'grades.teacherTitle': '授课课程成绩',
      'grades.teacherDesc': '以下为您所授课程的学生成绩，仅供查询。',
      'grades.adminDesc': '以下为全部学生的成绩记录，仅供查询。',
      'grades.adminTitle': '全部成绩记录',
      'grades.filterCourse': '课程',
      'grades.empty': '暂无成绩记录。',
      'grades.note': '绩点按百分制分段换算为 4.0 制（90 分及以上为 4.0），加权平均分按学分加权计算。',
      'grades.readonlyNote': '教师账号对该页面为只读访问，不支持录入或修改成绩。',
      'grades.statPass': '及格率',
      'grades.statAvg': '平均分',
      'grades.statMax': '最高分',
      'grades.statMin': '最低分',

      /* 后台 */
      'admin.title': '后台管理',
      'admin.desc': '维护新闻公告与用户账号。数据保存在浏览器本地，仅对当前浏览器生效。',
      'admin.nav.overview': '数据概览',
      'admin.nav.news': '新闻管理',
      'admin.nav.users': '用户管理',
      'admin.nav.reset': '重置演示数据',
      'admin.stat.news': '新闻总数',
      'admin.stat.users': '用户总数',
      'admin.stat.students': '学生账号',
      'admin.stat.teachers': '教师账号',
      'admin.recent.title': '最近发布',
      'admin.recent.desc': '按发布日期倒序显示最近 5 条新闻。',
      'admin.news.title': '新闻管理',
      'admin.news.desc': '新增、编辑、删除新闻公告，操作结果立即同步到前台页面。',
      'admin.news.add': '新增新闻',
      'admin.news.searchPlaceholder': '搜索标题或来源',
      'admin.news.col.id': '编号',
      'admin.news.col.title': '标题',
      'admin.news.col.category': '分类',
      'admin.news.col.date': '发布日期',
      'admin.news.col.author': '来源',
      'admin.news.col.views': '浏览量',
      'admin.news.col.pinned': '置顶',
      'admin.news.empty': '暂无新闻数据。',
      'admin.news.form.add': '新增新闻',
      'admin.news.form.edit': '编辑新闻',
      'admin.news.form.titleZh': '中文标题',
      'admin.news.form.titleEn': '英文标题',
      'admin.news.form.summaryZh': '中文摘要',
      'admin.news.form.summaryEn': '英文摘要',
      'admin.news.form.contentZh': '中文正文',
      'admin.news.form.contentEn': '英文正文',
      'admin.news.form.contentHint': '支持空行分段；也可直接粘贴简单 HTML（p / h2 / ul / li）。',
      'admin.news.form.category': '分类',
      'admin.news.form.date': '发布日期',
      'admin.news.form.author': '来源',
      'admin.news.form.pinned': '设为置顶',
      'admin.news.deleteConfirm': '确定要删除《{title}》吗？此操作不可撤销。',
      'admin.users.title': '用户管理',
      'admin.users.desc': '维护学生、教师与管理员账号。',
      'admin.users.add': '新增用户',
      'admin.users.searchPlaceholder': '搜索用户名、姓名或班级',
      'admin.users.col.username': '用户名',
      'admin.users.col.name': '姓名',
      'admin.users.col.role': '角色',
      'admin.users.col.college': '所属学院',
      'admin.users.col.class': '班级',
      'admin.users.col.no': '学号',
      'admin.users.col.status': '状态',
      'admin.users.col.actions': '操作',
      'admin.users.status.active': '正常',
      'admin.users.status.disabled': '已停用',
      'admin.users.empty': '暂无用户数据。',
      'admin.users.form.add': '新增用户',
      'admin.users.form.edit': '编辑用户',
      'admin.users.form.username': '用户名',
      'admin.users.form.password': '密码',
      'admin.users.form.passwordEditHint': '留空表示不修改密码。',
      'admin.users.form.name': '姓名',
      'admin.users.form.role': '角色',
      'admin.users.form.college': '所属学院',
      'admin.users.form.major': '专业',
      'admin.users.form.class': '班级',
      'admin.users.form.no': '学号',
      'admin.users.form.title': '职称',
      'admin.users.form.active': '账号启用',
      'admin.users.deleteConfirm': '确定要删除用户「{name}」吗？',
      'admin.users.selfDelete': '不能删除当前登录的账号。',
      'admin.toast.newsCreated': '新闻已新增',
      'admin.toast.newsUpdated': '新闻已更新',
      'admin.toast.newsDeleted': '新闻已删除',
      'admin.toast.userCreated': '用户已新增',
      'admin.toast.userUpdated': '用户已更新',
      'admin.toast.userDeleted': '用户已删除',
      'admin.toast.resetDone': '演示数据已重置为初始状态',
      'admin.toast.resetConfirm': '确定要重置全部演示数据吗？自行新增的内容将全部丢失。',
      'admin.toast.usernameTaken': '该用户名已存在，请更换。',
      'admin.toast.formInvalid': '请检查表单中标红的必填项。',
      'admin.storageWarning': '当前浏览器禁用了本地存储，数据只保存在内存中，刷新页面后将恢复初始状态。',

      /* 页脚 */
      'footer.about': '关于本站',
      'footer.aboutText': '本站为南京工业大学门户网站的演示实现，用于展示首页、新闻公告、课程表、成绩查询与后台管理等功能。',
      'footer.links': '常用链接',
      'footer.campus': '校区地址',
      'footer.contact': '联系方式',
      'footer.zip': '邮编',
      'footer.copyright': '© 2026 南京工业大学 演示站点',
      'footer.disclaimer': '本页面为学习用途的静态演示，非学校官方站点，内容依据公开资料整理。',
      'footer.source': '资料来源：南京工业大学官网'
    },

    /* ===================== English ===================== */
    en: {
      'site.name': 'Nanjing Tech University',
      'site.nameEn': 'Nanjing Tech University',
      'site.portal': 'Portal',
      'site.motto': 'Virtue · Learning · Resolve · Practice',
      'site.logoAlt': 'Nanjing Tech University emblem and wordmark',

      'topbar.slogan': 'Virtue · Learning · Resolve · Practice',
      'topbar.smart': 'Smart NJTech',
      'topbar.mail': 'Webmail',
      'topbar.oa': 'Office System',
      'lang.label': 'Language',
      'lang.zh': '中文',
      'lang.en': 'EN',

      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.colleges': 'Schools',
      'nav.news': 'News',
      'nav.courses': 'Timetable',
      'nav.grades': 'Grades',
      'nav.admin': 'Admin',
      'nav.login': 'Sign in',
      'nav.logout': 'Sign out',
      'nav.menu': 'Open navigation menu',
      'nav.portal': 'Smart NJTech Portal',

      'common.search': 'Search',
      'common.searchPlaceholder': 'Enter keywords',
      'common.all': 'All',
      'common.reset': 'Reset',
      'common.submit': 'Submit',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.add': 'Add',
      'common.close': 'Close',
      'common.actions': 'Actions',
      'common.noData': 'No data available',
      'common.more': 'View more',
      'common.back': 'Back',
      'common.backToList': 'Back to list',
      'common.readMore': 'Read more',
      'common.author': 'Source',
      'common.date': 'Date',
      'common.category': 'Category',
      'common.views': 'Views',
      'common.pinned': 'Pinned',
      'common.required': 'This field is required',
      'common.page': 'Page {n} of {m}',
      'common.prevPage': 'Previous',
      'common.nextPage': 'Next',
      'common.resultCount': '{n} result(s)',
      'common.loading': 'Loading…',
      'common.viewDetail': 'View details',
      'common.units.credit': 'credits',
      'common.units.score': 'pts',

      'home.hero.cta1': 'About the University',
      'home.hero.cta2': 'News & Notices',
      'home.hero.scroll': 'Scroll down',
      'home.overview.title': 'At a Glance',
      'home.overview.titleEn': 'At a Glance',
      'home.overview.desc': 'Statistics as of June 2026, based on the official NJTech website.',
      'home.highlight.title': 'Distinctive Strengths',
      'home.highlight.titleEn': 'Distinctive Strengths',
      'home.highlight.desc': 'Engineering-led and multidisciplinary, with a distinctive strength in industry–academia–research collaboration.',
      'home.news.title': 'Headlines',
      'home.news.titleEn': 'Headlines',
      'home.news.desc': 'Teaching, research and campus updates from NJTech.',
      'home.notice.title': 'Notices',
      'home.notice.titleEn': 'Notices',
      'home.notice.desc': 'Announcements on teaching, administration and services.',
      'home.academic.title': 'Academics',
      'home.academic.titleEn': 'Academics',
      'home.academic.desc': 'Conferences, forums and lectures on campus.',
      'home.entry.title': 'Quick Services',
      'home.entry.titleEn': 'Quick Services',
      'home.entry.desc': 'Shortcuts to frequently used sections and services.',
      'home.entry.about': 'About NJTech',
      'home.entry.aboutText': 'History, motto, current leadership and the three campuses.',
      'home.entry.colleges': 'Schools & Divisions',
      'home.entry.collegesText': 'An overview of 11 divisions and 29 schools.',
      'home.entry.news': 'News & Notices',
      'home.entry.newsText': 'Headlines, notices and academic events in one place.',
      'home.entry.courses': 'Timetable',
      'home.entry.coursesText': 'Browse the 2026–2027 fall semester timetable by class or instructor.',
      'home.entry.grades': 'Grades',
      'home.entry.gradesText': 'Transcript, weighted average and GPA.',
      'home.entry.login': 'Sign in',
      'home.entry.loginText': 'Role-based access for students, faculty and administrators.',
      'home.links.title': 'Useful Links',
      'home.links.titleEn': 'Useful Links',

      'about.title': 'About NJTech',
      'about.desc': 'NJTech traces its roots to Sanjiang Normal College (1902) and was formed in 2001 through the merger of Nanjing University of Chemical Technology and Nanjing Institute of Architectural and Civil Engineering.',
      'about.intro.title': 'Introduction',
      'about.facts.title': 'Key Facts',
      'about.timeline.title': 'History',
      'about.timeline.desc': 'Only verifiable milestones are listed below.',
      'about.leaders.title': 'Current Leadership',
      'about.leaders.desc': 'Source: the "Current Leadership" page of the official NJTech website.',
      'about.leaders.name': 'Name',
      'about.leaders.post': 'Position',
      'about.campus.title': 'Campuses',
      'about.campus.desc': 'NJTech has three campuses: Jiangpu, Dingjiaqiao and Hongqiao.',
      'about.campus.zip': 'Postcode',
      'about.motto.title': 'Motto and Ethos',
      'about.motto.desc': 'Motto: Virtue, Learning, Resolve, Practice. Ethos: Sincere, Simple, Self-reliant.',

      'colleges.title': 'Schools & Divisions',
      'colleges.desc': 'NJTech comprises 11 divisions and 29 schools across ten discipline categories including engineering, science, management, economics, humanities, law, medicine, arts, education and interdisciplinary studies.',
      'colleges.expand': 'Expand',
      'colleges.collapse': 'Collapse',
      'colleges.schoolCount': '{n} school(s)',
      'colleges.note': 'Divisions and schools are compiled from the "Schools & Departments" section of the official NJTech website.',

      'news.title': 'News & Notices',
      'news.desc': 'Headlines, notices and academic events, with category filters and keyword search.',
      'news.cat.ngyw': 'Headlines',
      'news.cat.tzgg': 'Notices',
      'news.cat.xshd': 'Academics',
      'news.filter.all': 'All',
      'news.empty': 'No matching news found. Try different keywords.',
      'news.related.title': 'Related reading',
      'news.detail.meta': 'Published on',
      'news.notFound': 'News article not found',
      'news.notFoundDesc': 'It may have been removed, or the link parameter is invalid.',
      'news.views': 'reads',

      'login.title': 'Sign in',
      'login.subtitle': 'Use your campus account. The system routes you to the services available to your role.',
      'login.username': 'Username',
      'login.usernamePlaceholder': 'Username or student ID',
      'login.password': 'Password',
      'login.passwordPlaceholder': 'Password',
      'login.submit': 'Sign in',
      'login.demo.title': 'Demo accounts',
      'login.demo.desc': 'Click a card to fill the form. This is a purely front-end demo: passwords are stored in plain text in your browser. Do not use it in production.',
      'login.demo.click': 'Fill in',
      'login.remember': 'Keep me signed in',
      'login.error.userNotFound': 'Username not found. Please check and try again.',
      'login.error.wrongPassword': 'Incorrect password. Please try again.',
      'login.error.accountDisabled': 'This account has been disabled. Please contact an administrator.',
      'login.error.required': 'Please enter both username and password.',
      'login.success': 'Signed in. Redirecting…',
      'login.welcome': 'Welcome back',
      'login.loggedInAs': 'Signed in as',
      'login.goHome': 'Back to home',
      'login.goPortal': 'Go to my services',
      'login.noPermission': 'Your account does not have access to that page. Redirected to home.',
      'login.needLogin': 'Please sign in to access that page.',

      'courses.title': 'Timetable',
      'courses.desc': 'First semester, 2026–2027 academic year',
      'courses.studentClass': 'Class',
      'courses.teacherMode': 'Classes taught',
      'courses.teacherNote': 'Your teaching schedule across all classes.',
      'courses.studentNote': 'Timetable for your class.',
      'courses.tableCaption': 'Timetable — {name}',
      'courses.summary.courses': 'Courses this semester',
      'courses.summary.credits': 'Credits this semester',
      'courses.teacherCaption': 'Teaching schedule — {name}',
      'courses.col.period': 'Period',
      'courses.col.course': 'Course',
      'courses.col.teacher': 'Instructor',
      'courses.col.room': 'Venue',
      'courses.col.credit': 'Credits',
      'courses.col.class': 'Class',
      'courses.period.12': 'Periods 1–2',
      'courses.period.34': 'Periods 3–4',
      'courses.period.56': 'Periods 5–6',
      'courses.period.78': 'Periods 7–8',
      'courses.weekday.1': 'Monday',
      'courses.weekday.2': 'Tuesday',
      'courses.weekday.3': 'Wednesday',
      'courses.weekday.4': 'Thursday',
      'courses.weekday.5': 'Friday',
      'courses.empty': 'No scheduled courses this semester.',
      'courses.totalCourses': '{n} course(s) this semester',
      'courses.totalCredit': '{n} credits in total',

      'grades.title': 'Grades',
      'grades.desc': 'Transcript, weighted average and grade point average.',
      'grades.summary.courses': 'Courses taken',
      'grades.summary.credits': 'Credits earned',
      'grades.summary.average': 'Weighted average',
      'grades.summary.gpa': 'GPA',
      'grades.col.term': 'Term',
      'grades.col.course': 'Course',
      'grades.col.credit': 'Credits',
      'grades.col.examType': 'Assessment',
      'grades.col.score': 'Score',
      'grades.col.point': 'Grade point',
      'grades.col.class': 'Class',
      'grades.col.student': 'Student',
      'grades.col.studentNo': 'Student ID',
      'grades.termStat': 'Term weighted average',
      'grades.teacherTitle': 'Grades for courses you teach',
      'grades.teacherDesc': 'Read-only view of student results in your courses.',
      'grades.adminDesc': 'Complete grade records for all students (read-only).',
      'grades.adminTitle': 'All grade records',
      'grades.filterCourse': 'Course',
      'grades.empty': 'No grade records.',
      'grades.note': 'Grade points use a 4.0 scale (90 and above = 4.0); the weighted average is calculated by course credits.',
      'grades.readonlyNote': 'Faculty access is read-only. Grades cannot be entered or modified here.',
      'grades.statPass': 'Pass rate',
      'grades.statAvg': 'Average',
      'grades.statMax': 'Highest',
      'grades.statMin': 'Lowest',

      'admin.title': 'Admin Console',
      'admin.desc': 'Manage news and user accounts. Data is stored locally in this browser only.',
      'admin.nav.overview': 'Overview',
      'admin.nav.news': 'News',
      'admin.nav.users': 'Users',
      'admin.nav.reset': 'Reset demo data',
      'admin.stat.news': 'News items',
      'admin.stat.users': 'Total users',
      'admin.stat.students': 'Student accounts',
      'admin.stat.teachers': 'Faculty accounts',
      'admin.recent.title': 'Recently published',
      'admin.recent.desc': 'The five most recent news items by publication date.',
      'admin.news.title': 'News Management',
      'admin.news.desc': 'Create, edit and delete news. Changes appear on the public pages immediately.',
      'admin.news.add': 'New article',
      'admin.news.searchPlaceholder': 'Search title or source',
      'admin.news.col.id': 'ID',
      'admin.news.col.title': 'Title',
      'admin.news.col.category': 'Category',
      'admin.news.col.date': 'Published',
      'admin.news.col.author': 'Source',
      'admin.news.col.views': 'Views',
      'admin.news.col.pinned': 'Pinned',
      'admin.news.empty': 'No news yet.',
      'admin.news.form.add': 'New article',
      'admin.news.form.edit': 'Edit article',
      'admin.news.form.titleZh': 'Chinese title',
      'admin.news.form.titleEn': 'English title',
      'admin.news.form.summaryZh': 'Chinese summary',
      'admin.news.form.summaryEn': 'English summary',
      'admin.news.form.contentZh': 'Chinese body',
      'admin.news.form.contentEn': 'English body',
      'admin.news.form.contentHint': 'Blank lines create paragraphs; simple HTML (p / h2 / ul / li) is also accepted.',
      'admin.news.form.category': 'Category',
      'admin.news.form.date': 'Publication date',
      'admin.news.form.author': 'Source',
      'admin.news.form.pinned': 'Pin to top',
      'admin.news.deleteConfirm': 'Delete "{title}"? This cannot be undone.',
      'admin.users.title': 'User Management',
      'admin.users.desc': 'Manage student, faculty and administrator accounts.',
      'admin.users.add': 'New user',
      'admin.users.searchPlaceholder': 'Search username, name or class',
      'admin.users.col.username': 'Username',
      'admin.users.col.name': 'Name',
      'admin.users.col.role': 'Role',
      'admin.users.col.college': 'College',
      'admin.users.col.class': 'Class',
      'admin.users.col.no': 'Student ID',
      'admin.users.col.status': 'Status',
      'admin.users.col.actions': 'Actions',
      'admin.users.status.active': 'Active',
      'admin.users.status.disabled': 'Disabled',
      'admin.users.empty': 'No users yet.',
      'admin.users.form.add': 'New user',
      'admin.users.form.edit': 'Edit user',
      'admin.users.form.username': 'Username',
      'admin.users.form.password': 'Password',
      'admin.users.form.passwordEditHint': 'Leave blank to keep the current password.',
      'admin.users.form.name': 'Name',
      'admin.users.form.role': 'Role',
      'admin.users.form.college': 'College',
      'admin.users.form.major': 'Major',
      'admin.users.form.class': 'Class',
      'admin.users.form.no': 'Student ID',
      'admin.users.form.title': 'Title',
      'admin.users.form.active': 'Account active',
      'admin.users.deleteConfirm': 'Delete user "{name}"?',
      'admin.users.selfDelete': 'You cannot delete the account you are signed in with.',
      'admin.toast.newsCreated': 'Article created',
      'admin.toast.newsUpdated': 'Article updated',
      'admin.toast.newsDeleted': 'Article deleted',
      'admin.toast.userCreated': 'User created',
      'admin.toast.userUpdated': 'User updated',
      'admin.toast.userDeleted': 'User deleted',
      'admin.toast.resetDone': 'Demo data has been reset',
      'admin.toast.resetConfirm': 'Reset all demo data? Any content you added will be lost.',
      'admin.toast.usernameTaken': 'That username already exists. Please choose another.',
      'admin.toast.formInvalid': 'Please check the highlighted required fields.',
      'admin.storageWarning': 'Local storage is disabled in this browser. Data is kept in memory only and will reset when you reload.',

      'footer.about': 'About this site',
      'footer.aboutText': 'A demonstration implementation of an NJTech portal, showcasing the homepage, news, timetable, grades and an admin console.',
      'footer.links': 'Useful links',
      'footer.campus': 'Campus addresses',
      'footer.contact': 'Contact',
      'footer.zip': 'Postcode',
      'footer.copyright': '© 2026 Nanjing Tech University — demo site',
      'footer.disclaimer': 'This is a static demo for learning purposes, not an official university site. Content is compiled from public sources.',
      'footer.source': 'Source: official NJTech website'
    }
  };

  /* ------------------------------------------------------------------------
     内部状态
     ------------------------------------------------------------------------ */
  var current = 'zh';

  function detectInitial() {
    if (global.Store && global.Store.prefs) {
      var saved = global.Store.prefs.getLang();
      if (saved === 'en' || saved === 'zh') return saved;
    }
    var nav = global.navigator;
    if (nav && /^en\b/i.test(nav.language || '')) return 'en';
    return 'zh';
  }

  /** 取文案，支持 {n} 之类的占位符替换 */
  function t(key, vars) {
    var table = DICT[current] || DICT.zh;
    var text = table[key];
    if (text === undefined) {
      text = (DICT.zh[key] !== undefined) ? DICT.zh[key] : key;
    }
    if (vars) {
      text = String(text).replace(/\{(\w+)\}/g, function (m, name) {
        return vars[name] !== undefined ? vars[name] : m;
      });
    }
    return text;
  }

  /**
   * 从数据对象中按当前语言取字段。
   * 例如 pick(newsItem, 'title') → newsItem.titleZh 或 newsItem.titleEn
   */
  function pick(obj, base) {
    if (!obj) return '';
    var suffix = current === 'en' ? 'En' : 'Zh';
    var value = obj[base + suffix];
    if (value === undefined || value === '') {
      value = obj[base + (current === 'en' ? 'Zh' : 'En')];
    }
    return value === undefined ? '' : value;
  }

  /** 分类 / 角色等字典项的双语名 */
  function label(group, code) {
    var g = group === 'category' ? (global.Store && global.Store.CATEGORIES)
      : (global.Store && global.Store.ROLES);
    if (!g || !g[code]) return code || '';
    return current === 'en' ? g[code].en : g[code].zh;
  }

  function getLang() {
    return current;
  }

  function setLang(lang, options) {
    var next = lang === 'en' ? 'en' : 'zh';
    var silent = options && options.silent;
    var changed = next !== current;
    current = next;

    if (global.Store && global.Store.prefs) {
      global.Store.prefs.setLang(current);
    }
    apply(document);
    updateLangButtons();

    if (changed && !silent) {
      document.dispatchEvent(new CustomEvent('langchange', {
        detail: { lang: current }
      }));
    }
    return current;
  }

  function toggle() {
    return setLang(current === 'en' ? 'zh' : 'en');
  }

  function updateLangButtons() {
    var buttons = document.querySelectorAll('[data-lang-btn]');
    Array.prototype.forEach.call(buttons, function (btn) {
      var value = btn.getAttribute('data-lang-btn');
      btn.setAttribute('aria-pressed', value === current ? 'true' : 'false');
      var labelEl = btn.getAttribute('data-lang-label');
      btn.setAttribute('title', labelEl ? t(labelEl) : btn.textContent.trim());
    });
  }

  /** 把 data-i18n* 属性应用到 DOM */
  function apply(root) {
    var scope = root || document;

    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n]'), function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-html]'), function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-placeholder]'), function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-title]'), function (el) {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-alt]'), function (el) {
      el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    });
    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-aria-label]'), function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
    });
    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-value]'), function (el) {
      el.setAttribute('value', t(el.getAttribute('data-i18n-value')));
    });

    if (document.documentElement) {
      document.documentElement.setAttribute('lang', current === 'en' ? 'en' : 'zh-CN');
    }
  }

  /** 按当前语言格式化日期：zh → 2026年9月14日；en → 14 Sep 2026 */
  function formatDate(iso) {
    if (!iso) return '';
    var parts = String(iso).split('-');
    if (parts.length !== 3) return String(iso);
    var y = parts[0];
    var m = String(Number(parts[1]));
    var d = String(Number(parts[2]));
    if (current === 'en') {
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var mi = Number(parts[1]) - 1;
      return d + ' ' + (months[mi] || parts[1]) + ' ' + y;
    }
    return y + '年' + m + '月' + d + '日';
  }

  /** 取日期的“日”与“月”，用于新闻列表左侧日期块 */
  function dateParts(iso) {
    var parts = String(iso || '').split('-');
    if (parts.length !== 3) return { day: '', month: '' };
    if (current === 'en') {
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        day: String(Number(parts[2])),
        month: months[Number(parts[1]) - 1] + ' ' + parts[0]
      };
    }
    return { day: String(Number(parts[2])), month: parts[0] + '.' + parts[1] };
  }

  /* ------------------------------------------------------------------------
     初始化
     ------------------------------------------------------------------------ */
  current = detectInitial();

  global.I18N = {
    t: t,
    pick: pick,
    label: label,
    apply: apply,
    setLang: setLang,
    toggle: toggle,
    getLang: getLang,
    formatDate: formatDate,
    dateParts: dateParts,
    updateLangButtons: updateLangButtons,
    dict: DICT
  };
})(window);
