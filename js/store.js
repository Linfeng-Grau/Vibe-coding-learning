/* ==========================================================================
   store.js — localStorage 模拟数据库
   南京工业大学门户网站

   本模块是唯一的数据出入口：所有页面都通过 window.Store 读写数据。
   首次访问时写入种子数据；SEED_VERSION 变更后会自动重建。
   --------------------------------------------------------------------------
   注意：这是纯前端演示方案，数据保存在浏览器 localStorage 中，
        不同浏览器/设备之间不共享，密码为明文，切勿用于生产环境。
   ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------------------
     常量
     ------------------------------------------------------------------------ */
  var KEYS = {
    users: 'njtech_users',
    news: 'njtech_news',
    courses: 'njtech_courses',
    grades: 'njtech_grades',
    session: 'njtech_session',
    lang: 'njtech_lang',
    seed: 'njtech_seed_version'
  };

  var SEED_VERSION = '1.0.0';

  var CATEGORIES = {
    ngyw: { zh: '南工要闻', en: 'Headlines' },
    tzgg: { zh: '通知公告', en: 'Notices' },
    xshd: { zh: '学术活动', en: 'Academics' }
  };

  var ROLES = {
    student: { zh: '学生', en: 'Student' },
    teacher: { zh: '教师', en: 'Faculty' },
    admin: { zh: '管理员', en: 'Administrator' }
  };

  /* ------------------------------------------------------------------------
     学校基础信息（来源：南京工业大学官网，数据统计至 2026 年 6 月）
     ------------------------------------------------------------------------ */
  var SCHOOL = {
    nameZh: '南京工业大学',
    nameEn: 'Nanjing Tech University',
    shortEn: 'NJTech',
    mottoZh: '明德 厚学 沉毅 笃行',
    mottoEn: 'Virtue · Learning · Resolve · Practice',
    ethosZh: '诚朴自强',
    ethosEn: 'Sincere, Simple, Self-reliant',
    founded: '1902',
    website: 'https://www.njtech.edu.cn',
    intro: {
      zh: '南京工业大学办学历史溯源于 1902 年创办的三江师范学堂，2001 年由南京化工大学与南京建筑工程学院合并组建，历史底蕴深厚、学科特色鲜明、办学成果丰硕。是首批国家“高等学校创新能力提升计划”（2011 计划）牵头高校、江苏高水平大学建设高峰计划 A 类建设高校。学校秉承“明德、厚学、沉毅、笃行”的校训，坚持扎根中国大地办大学，形成了产学研协同创新的鲜明特色。',
      en: 'Nanjing Tech University (NJTech) traces its roots to Sanjiang Normal College, founded in 1902, and was formed in 2001 through the merger of Nanjing University of Chemical Technology and Nanjing Institute of Architectural and Civil Engineering. It is one of the first leading universities of China\'s "2011 Plan" for collaborative innovation and a Category-A university under Jiangsu\'s High-Level University Construction Program. Guided by its motto — Virtue, Learning, Resolve, Practice — NJTech has built a distinctive strength in industry–academia–research collaboration.'
    },
    facts: [
      {
        labelZh: '办学溯源', labelEn: 'Origins',
        valueZh: '1902 年创办的三江师范学堂', valueEn: 'Sanjiang Normal College, founded in 1902'
      },
      {
        labelZh: '合并组建', labelEn: 'Merger',
        valueZh: '2001 年由南京化工大学与南京建筑工程学院合并组建',
        valueEn: 'Merged in 2001 from Nanjing University of Chemical Technology and Nanjing Institute of Architectural and Civil Engineering'
      },
      {
        labelZh: '学校定位', labelEn: 'Status',
        valueZh: '首批国家“2011 计划”牵头高校；江苏高水平大学建设高峰计划 A 类建设高校',
        valueEn: 'One of the first leading universities of the national "2011 Plan"; Category-A under Jiangsu\'s High-Level University Construction Program'
      },
      {
        labelZh: '学科门类', labelEn: 'Disciplines',
        valueZh: '涵盖工、理、管、经、文、法、医、艺、教、交叉等 10 个学科门类',
        valueEn: 'Ten discipline categories including engineering, science, management, economics, humanities, law, medicine, arts, education and interdisciplinary studies'
      },
      {
        labelZh: '学位点', labelEn: 'Degree Programs',
        valueZh: '博士后科研流动站 9 个，一级学科博士学位授予点 9 个，博士专业学位授予点 3 个，一级学科硕士学位授予点 32 个，硕士专业学位授予点 21 个',
        valueEn: '9 postdoctoral stations, 9 first-level doctoral programs, 3 professional doctoral programs, 32 first-level master\'s programs and 21 professional master\'s programs'
      },
      {
        labelZh: '学科评估', labelEn: 'Discipline Evaluation',
        valueZh: '第四轮学科评估中，化学工程与技术获评 A 等级，材料科学与工程、安全科学与工程获评 B+ 等级',
        valueEn: 'In the fourth round of national discipline evaluation, Chemical Engineering and Technology was rated A, while Materials Science and Engineering and Safety Science and Engineering were rated B+'
      },
      {
        labelZh: '师资力量', labelEn: 'Faculty',
        valueZh: '教职工近 3300 人，高级职称人员 1750 余人，其中两院院士 10 人，国家级人才 234 人次',
        valueEn: 'Nearly 3,300 faculty and staff, over 1,750 with senior titles, including 10 academicians of the Chinese Academy of Sciences and Chinese Academy of Engineering'
      },
      {
        labelZh: '科研平台', labelEn: 'Research Platforms',
        valueZh: '国家级科研平台 9 个（含材料化学工程全国重点实验室、柔性电子全国重点实验室等），省部级研究中心 48 个、省部级重点实验室 31 个',
        valueEn: '9 national research platforms (including the National Key Laboratory of Materials-Oriented Chemical Engineering and the National Key Laboratory of Flexible Electronics), 48 provincial and ministerial research centers and 31 key laboratories'
      },
      {
        labelZh: '国际交流', labelEn: 'Global Engagement',
        valueZh: '与 30 余个国家和地区的 120 余所海外大学和科研机构建立合作关系',
        valueEn: 'Partnerships with more than 120 overseas universities and research institutions across over 30 countries and regions'
      }
    ],
    highlights: [
      {
        icon: 'lab',
        titleZh: '产学研协同创新',
        titleEn: 'Industry–Academia–Research Collaboration',
        textZh: '建有材料化学工程全国重点实验室、柔性电子全国重点实验室等 9 个国家级科研平台，主动将创新链对接产业链。',
        textEn: 'Nine national research platforms, including the National Key Laboratory of Materials-Oriented Chemical Engineering and the National Key Laboratory of Flexible Electronics, link innovation directly to industry.'
      },
      {
        icon: 'medal',
        titleZh: '工程教育实力',
        titleEn: 'Engineering Education',
        textZh: '28 个工科专业通过工程教育专业认证或住建部专业评估，进入全球工程教育“第一方阵”。',
        textEn: 'Twenty-eight engineering programs are accredited under the Washington Accord or by the Ministry of Housing and Urban-Rural Development.'
      },
      {
        icon: 'globe',
        titleZh: '全球拓展战略',
        titleEn: 'Global Strategy',
        textZh: '与南非约翰内斯堡大学、西班牙萨拉戈萨大学共建孔子学院，与英国斯旺西大学合作举办联合学院。',
        textEn: 'Confucius Institutes with the University of Johannesburg and the University of Zaragoza, plus a joint college with Swansea University.'
      },
      {
        icon: 'star',
        titleZh: '创新创业人才培养',
        titleEn: 'Innovation & Entrepreneurship',
        textZh: '建设书院制“2011 学院”，与中科院相关院所共建“英才班”，入选首批国家深化创新创业教育改革示范高校。',
        textEn: 'The residential "2011 College" and honors classes co-built with CAS institutes anchor its innovation-driven talent training.'
      }
    ],
    stats: [
      { value: '11', unit: '个学部', valueEn: '11', unitEn: 'Divisions', labelZh: '下辖 29 个学院', labelEn: '29 schools and colleges' },
      { value: '4', unit: '万余人', valueEn: '40k+', unitEn: 'students', labelZh: '各类在校学生', labelEn: 'Enrolled students' },
      { value: '10', unit: '位', valueEn: '10', unitEn: 'academicians', labelZh: '两院院士', labelEn: 'CAS & CAE academicians' },
      { value: '9', unit: '个', valueEn: '9', unitEn: 'national platforms', labelZh: '国家级科研平台', labelEn: 'National research platforms' }
    ],
    campuses: [
      {
        nameZh: '江浦校区', nameEn: 'Jiangpu Campus',
        addressZh: '江苏省南京市江北新区浦珠南路 30 号', addressEn: 'No. 30 Puzhu South Road, Jiangbei New Area, Nanjing, Jiangsu',
        zip: '211816'
      },
      {
        nameZh: '丁家桥校区', nameEn: 'Dingjiaqiao Campus',
        addressZh: '江苏省南京市鼓楼区新模范马路 5 号', addressEn: 'No. 5 New Model Road, Gulou District, Nanjing, Jiangsu',
        zip: '210009'
      },
      {
        nameZh: '虹桥校区', nameEn: 'Hongqiao Campus',
        addressZh: '江苏省南京市鼓楼区中山北路 200 号', addressEn: 'No. 200 Zhongshan North Road, Gulou District, Nanjing, Jiangsu',
        zip: '210009'
      }
    ],
    /* 现任领导（来源：南京工业大学官网「现任领导」页面） */
    leaders: [
      { nameZh: '荆 晅', nameEn: 'Jing Xuan', postZh: '党委书记', postEn: 'Party Secretary' },
      { nameZh: '蒋军成', nameEn: 'Jiang Juncheng', postZh: '校长', postEn: 'President' },
      { nameZh: '刘大卫', nameEn: 'Liu Dawei', postZh: '党委副书记', postEn: 'Deputy Party Secretary' },
      { nameZh: '凌 祥', nameEn: 'Ling Xiang', postZh: '副校长', postEn: 'Vice President' },
      { nameZh: '陆伟东', nameEn: 'Lu Weidong', postZh: '副校长', postEn: 'Vice President' },
      { nameZh: '郭万牛', nameEn: 'Guo Wanniu', postZh: '副校长', postEn: 'Vice President' },
      { nameZh: '戴志晖', nameEn: 'Dai Zhihui', postZh: '副校长', postEn: 'Vice President' },
      { nameZh: '郭 凯', nameEn: 'Guo Kai', postZh: '副校长', postEn: 'Vice President' },
      { nameZh: '顾学红', nameEn: 'Gu Xuehong', postZh: '副校长', postEn: 'Vice President' },
      { nameZh: '曹 杰', nameEn: 'Cao Jie', postZh: '纪委书记、派驻监察专员', postEn: 'Secretary of the Discipline Inspection Commission' }
    ],
    /* 历史沿革（依据官网「学校简介」与公开资料，仅列可核实节点） */
    timeline: [
      { year: '1902', textZh: '办学历史溯源于创办的三江师范学堂', textEn: 'The university traces its roots to Sanjiang Normal College.' },
      { year: '2001', textZh: '南京化工大学与南京建筑工程学院合并组建南京工业大学', textEn: 'Nanjing University of Chemical Technology and Nanjing Institute of Architectural and Civil Engineering merged to form NJTech.' },
      { year: '2012', textZh: '住房和城乡建设部与江苏省人民政府合作共建南京工业大学', textEn: 'The Ministry of Housing and Urban-Rural Development and the Jiangsu Provincial Government began jointly supporting the university.' },
      { year: '2026', textZh: '设有 11 个学部、29 个学院，各类学生 4 万余人', textEn: 'Today NJTech comprises 11 divisions and 29 schools with over 40,000 students.' }
    ],
    /* 学部与学院（依据官网「办学条件 — 院系设置」公开信息整理） */
    colleges: [
      {
        nameZh: '安全环境学部', nameEn: 'Division of Safety & Environment',
        schools: [
          { nameZh: '安全科学与工程学院', nameEn: 'School of Safety Science and Engineering' },
          { nameZh: '环境科学与工程学院', nameEn: 'School of Environmental Science and Engineering' }
        ]
      },
      {
        nameZh: '材料科学学部', nameEn: 'Division of Materials Science',
        schools: [
          { nameZh: '材料科学与工程学院', nameEn: 'School of Materials Science and Engineering' }
        ]
      },
      {
        nameZh: '化学化工学部', nameEn: 'Division of Chemistry & Chemical Engineering',
        schools: [
          { nameZh: '化工学院', nameEn: 'School of Chemical Engineering' },
          { nameZh: '化学与分子工程学院', nameEn: 'School of Chemistry and Molecular Engineering' }
        ]
      },
      {
        nameZh: '机械控制学部', nameEn: 'Division of Mechanical & Control Engineering',
        schools: [
          { nameZh: '机械与动力工程学院', nameEn: 'School of Mechanical and Power Engineering' },
          { nameZh: '电气工程与控制科学学院', nameEn: 'School of Electrical Engineering and Control Science' },
          { nameZh: '能源科学与工程学院', nameEn: 'School of Energy Science and Engineering' }
        ]
      },
      {
        nameZh: '健康科技学部', nameEn: 'Division of Health Technology',
        schools: [
          { nameZh: '药学院', nameEn: 'School of Pharmaceutical Sciences' },
          { nameZh: '医学院（筹）', nameEn: 'School of Medicine (in preparation)' }
        ]
      },
      {
        nameZh: '建筑艺术学部', nameEn: 'Division of Architecture & Art',
        schools: [
          { nameZh: '建筑学院', nameEn: 'School of Architecture' },
          { nameZh: '艺术设计学院', nameEn: 'School of Art and Design' }
        ]
      },
      {
        nameZh: '经济管理学部', nameEn: 'Division of Economics & Management',
        schools: [
          { nameZh: '经济与管理学院（商学院）', nameEn: 'School of Economics and Management (Business School)' }
        ]
      },
      {
        nameZh: '人文社科学部', nameEn: 'Division of Humanities & Social Sciences',
        schools: [
          { nameZh: '法学院', nameEn: 'School of Law' },
          { nameZh: '马克思主义学院', nameEn: 'School of Marxism' },
          { nameZh: '外国语言文学学院', nameEn: 'School of Foreign Languages and Literature' },
          { nameZh: '体育部（中国棒垒球学院（筹））', nameEn: 'Department of Physical Education (China Softball & Baseball College, in preparation)' }
        ]
      },
      {
        nameZh: '生物制造学部', nameEn: 'Division of Biomanufacturing',
        schools: [
          { nameZh: '生物与制药工程学院', nameEn: 'School of Biotechnology and Pharmaceutical Engineering' },
          { nameZh: '食品与轻工学院', nameEn: 'School of Food Science and Light Industry' }
        ]
      },
      {
        nameZh: '数理信息学部', nameEn: 'Division of Mathematics, Physics & Information',
        schools: [
          { nameZh: '计算机科学与技术学院（软件工程学院）', nameEn: 'School of Computer Science and Technology (School of Software Engineering)' },
          { nameZh: '数理科学学院', nameEn: 'School of Mathematical and Physical Sciences' },
          { nameZh: '先进材料研究院（海外人才缓冲基地）', nameEn: 'Institute of Advanced Materials' }
        ]
      },
      {
        nameZh: '土木交通学部', nameEn: 'Division of Civil Engineering & Transportation',
        schools: [
          { nameZh: '土木工程学院', nameEn: 'School of Civil Engineering' },
          { nameZh: '交通运输工程学院', nameEn: 'School of Transportation Engineering' },
          { nameZh: '城市建设学院', nameEn: 'School of Urban Construction' },
          { nameZh: '测绘科学与技术学院', nameEn: 'School of Geomatics Science and Technology' }
        ]
      },
      {
        nameZh: '其他教学单位', nameEn: 'Other Teaching Units',
        schools: [
          { nameZh: '2011 学院', nameEn: '2011 College' },
          { nameZh: '海外教育学院', nameEn: 'School of Overseas Education' },
          { nameZh: '继续教育学院', nameEn: 'School of Continuing Education' }
        ]
      }
    ],
    quickLinks: [
      { labelZh: '教务管理', labelEn: 'Academic Affairs', url: 'https://jwgl.njtech.edu.cn/' },
      { labelZh: '学校官网', labelEn: 'Official Website', url: 'https://www.njtech.edu.cn' },
      { labelZh: '信息公开', labelEn: 'Information Disclosure', url: 'http://xxgk.njtech.edu.cn/' },
      { labelZh: '人才招聘', labelEn: 'Careers', url: 'http://hr.njtech.edu.cn/' },
      { labelZh: '校友总会', labelEn: 'Alumni Association', url: 'https://alumni.njtech.edu.cn/' },
      { labelZh: '招标信息', labelEn: 'Tenders', url: 'http://ztb.njtech.edu.cn/' }
    ],
    hero: {
      eyebrowZh: '首批国家“2011 计划”牵头高校 · 江苏高水平大学建设高峰计划 A 类',
      eyebrowEn: 'Leading university of the national "2011 Plan" · Category-A, Jiangsu High-Level University Program',
      titleZh: '南京工业大学',
      titleEn: 'Nanjing Tech University',
      descZh: '办学历史溯源于 1902 年创办的三江师范学堂，2001 年由南京化工大学与南京建筑工程学院合并组建。设有 11 个学部、29 个学院，各类学生 4 万余人。',
      descEn: 'Rooted in Sanjiang Normal College (1902) and formed in 2001 through a landmark merger, NJTech is home to 11 divisions, 29 schools and more than 40,000 students.',
      imageCreditZh: '首页配图：南京城市风光（piqsels 公共领域图库，非校园实景）',
      imageCreditEn: 'Banner image: Nanjing city view (piqsels public-domain library; not an actual campus photo)'
    }
  };

  /* ------------------------------------------------------------------------
     种子数据
     ------------------------------------------------------------------------ */

  function seedUsers() {
    return [
      {
        id: 1, username: 'admin', password: 'admin123', name: '系统管理员',
        role: 'admin', college: '网络与信息中心', title: '系统管理员', active: true
      },
      {
        id: 2, username: 'teacher', password: 'teacher123', name: '王建华',
        role: 'teacher', college: '化学化工学部 · 化工学院', title: '教授', active: true
      },
      {
        id: 3, username: 'teacher2', password: 'teacher123', name: '周敏',
        role: 'teacher', college: '数理信息学部 · 数理科学学院', title: '副教授', active: true
      },
      {
        id: 4, username: 'student', password: 'student123', name: '李小明',
        role: 'student', college: '数理信息学部 · 计算机科学与技术学院',
        major: '计算机科学与技术', className: '计算机 2401 班', studentNo: '20242110101', active: true
      },
      {
        id: 5, username: 'zhangwei', password: 'student123', name: '张 伟',
        role: 'student', college: '化学化工学部 · 化工学院',
        major: '化学工程与工艺', className: '化工 2401 班', studentNo: '20242110201', active: true
      },
      {
        id: 6, username: 'wangfang', password: 'student123', name: '王 芳',
        role: 'student', college: '化学化工学部 · 化工学院',
        major: '化学工程与工艺', className: '化工 2401 班', studentNo: '20242110202', active: true
      },
      {
        id: 7, username: 'liuyang', password: 'student123', name: '刘 洋',
        role: 'student', college: '化学化工学部 · 化工学院',
        major: '化学工程与工艺', className: '化工 2401 班', studentNo: '20242110203', active: true
      },
      {
        id: 8, username: 'chenjing', password: 'student123', name: '陈 静',
        role: 'student', college: '化学化工学部 · 化工学院',
        major: '化学工程与工艺', className: '化工 2401 班', studentNo: '20242110204', active: true
      },
      {
        id: 9, username: 'zhaolei', password: 'student123', name: '赵 磊',
        role: 'student', college: '化学化工学部 · 化工学院',
        major: '化学工程与工艺', className: '化工 2401 班', studentNo: '20242110205', active: true
      }
    ];
  }

  function seedNews() {
    return [
      {
        id: 1, category: 'ngyw', date: '2026-09-14', author: '党委宣传部',
        pinned: true, views: 2381,
        titleZh: '我校举行 2026 级新生开学典礼',
        titleEn: 'NJTech Holds Opening Ceremony for the Class of 2026',
        summaryZh: '9 月 14 日，我校 2026 级 7160 名本科生、4219 名研究生、181 名留学生新生开学典礼在江浦校区行健田径场举行。',
        summaryEn: 'On September 14, the opening ceremony for the Class of 2026 — 7,160 undergraduates, 4,219 postgraduates and 181 international students — was held at the Xingjian Track and Field Ground of the Jiangpu Campus.',
        contentZh: '<p>9 月 14 日上午，南京工业大学 2026 级新生开学典礼在江浦校区行健田径场举行。校领导、中学校长代表、校友代表与 2026 级全体新同学共同参加了典礼。</p><h2>新同学，新起点</h2><p>今年共有 7160 名本科生、4219 名研究生和 181 名留学生加入南京工业大学。典礼上，学校向新同学介绍了学校 1902 年以来的办学历史，以及“明德、厚学、沉毅、笃行”的校训内涵。</p><p>校领导在致辞中勉励同学们把个人成长融入国家发展，扎实打好专业基础，主动走进实验室、走进企业、走进社会，在实践中锤炼真本领。</p><h2>师长寄语</h2><p>教师代表、校友代表分别结合自身经历，分享了对大学学习与成长的理解，希望同学们珍惜时光、保持好奇、学会合作，在南工大度过充实的求学岁月。</p>',
        contentEn: '<p>On the morning of September 14, the opening ceremony for NJTech\'s Class of 2026 was held at the Xingjian Track and Field Ground on the Jiangpu Campus, attended by university leaders, representatives of secondary schools, alumni and all new students.</p><h2>A new beginning</h2><p>This year NJTech welcomed 7,160 undergraduates, 4,219 postgraduates and 181 international students. The ceremony introduced the university\'s history dating back to 1902 and the meaning of its motto — Virtue, Learning, Resolve, Practice.</p><p>University leaders encouraged students to connect personal growth with national development, to build solid professional foundations, and to step into laboratories, enterprises and society to develop genuine capability.</p><h2>Messages from faculty and alumni</h2><p>Faculty and alumni representatives shared their own experiences and hopes: cherish your time, stay curious, learn to collaborate, and make the most of your years at NJTech.</p>'
      },
      {
        id: 2, category: 'ngyw', date: '2026-09-14', author: '教务处',
        pinned: false, views: 892,
        titleZh: '我校荣获全国优秀教材一等奖',
        titleEn: 'NJTech Wins First Prize in National Outstanding Textbook Awards',
        summaryZh: '学校在国家级教材建设评选中取得突破，获全国优秀教材一等奖，体现了学校在课程与教材建设方面的持续投入。',
        summaryEn: 'NJTech won a First Prize in the national outstanding textbook awards, reflecting the university\'s sustained investment in curriculum and textbook development.',
        contentZh: '<p>近日，全国优秀教材评选结果公布，我校荣获一等奖。该奖项是我国教材建设领域的重要奖项，重点考察教材的思想性、科学性与教学适用性。</p><p>学校长期重视课程与教材建设，鼓励教师把科研成果、工程案例转化为教学资源。此次获奖是学校推进一流本科教育、深化教学改革的阶段性成果。</p>',
        contentEn: '<p>The national outstanding textbook awards were recently announced, and NJTech received a First Prize — a major recognition in China\'s textbook development field that evaluates academic rigour, scientific accuracy and teaching suitability.</p><p>The university has long invested in curriculum and textbook development, encouraging faculty to translate research outcomes and engineering cases into teaching resources.</p>'
      },
      {
        id: 3, category: 'ngyw', date: '2026-09-10', author: '党委宣传部',
        pinned: false, views: 1156,
        titleZh: '学校召开庆祝第 42 个教师节大会暨新学期工作会议',
        titleEn: 'NJTech Marks the 42nd Teachers\' Day and Sets Priorities for the New Semester',
        summaryZh: '会议表彰了在教育教学、科学研究与管理服务中作出突出贡献的教职工，并对新学期重点工作作出部署。',
        summaryEn: 'The university honored faculty and staff for outstanding contributions to teaching, research and administration, and laid out priorities for the new semester.',
        contentZh: '<p>9 月 10 日，学校召开庆祝第 42 个教师节大会暨新学期工作会议，向全校教职员工致以节日问候。</p><h2>表彰先进</h2><p>会上对在教学、科研、管理服务等岗位作出突出贡献的教职工进行了表彰，并号召全体教师以先进为榜样，潜心教书育人。</p><h2>新学期部署</h2><p>会议围绕人才培养、学科建设、科研创新与服务水平提升等方面，对新学期重点工作作出部署，明确要以高质量党建推动学校事业高质量发展。</p>',
        contentEn: '<p>On September 10, NJTech held a conference marking the 42nd Teachers\' Day alongside its new-semester work meeting, extending festive greetings to all faculty and staff.</p><h2>Honoring excellence</h2><p>Faculty and staff who made outstanding contributions in teaching, research and administration were commended, and all teachers were urged to follow these examples in nurturing students.</p><h2>Plans for the new semester</h2><p>The meeting set out key priorities in talent training, discipline development, research innovation and service quality, emphasizing high-quality development driven by strong Party building.</p>'
      },
      {
        id: 4, category: 'ngyw', date: '2026-09-07', author: '学生工作处',
        pinned: false, views: 1743,
        titleZh: '我校喜迎 2026 级新同学',
        titleEn: 'NJTech Welcomes the Class of 2026',
        summaryZh: '来自全国各地的新同学陆续到校报到，各学院与职能部门在江浦校区设置迎新服务点，为新生提供一站式服务。',
        summaryEn: 'New students from across the country arrived on campus, with schools and administrative offices providing one-stop welcome services at the Jiangpu Campus.',
        contentZh: '<p>9 月 7 日起，2026 级新同学陆续到校报到。学校在江浦校区设置多个迎新服务点，提供报到注册、宿舍引导、行李搬运、资助咨询等服务。</p><p>各学院结合专业特色布置迎新展位，通过实验室参观、专业介绍等方式帮助新生尽快了解所学专业，融入大学生活。</p>',
        contentEn: '<p>From September 7, the Class of 2026 began arriving on campus. Multiple welcome stations were set up at the Jiangpu Campus offering registration, dormitory guidance, luggage assistance and financial aid consultation.</p><p>Schools arranged themed booths and lab tours to help newcomers understand their majors and settle into university life.</p>'
      },
      {
        id: 5, category: 'ngyw', date: '2026-09-02', author: '体育学院',
        pinned: false, views: 634,
        titleZh: '我校江苏女垒夺得 2026 年全国青年女子垒球锦标赛冠军',
        titleEn: 'NJTech\'s Jiangsu Women\'s Softball Team Wins 2026 National Youth Championship',
        summaryZh: '我校江苏女垒在 2026 年全国青年女子垒球锦标赛中一路过关斩将，最终夺得冠军。',
        summaryEn: 'The Jiangsu women\'s softball team of NJTech won the 2026 National Youth Women\'s Softball Championship.',
        contentZh: '<p>在 2026 年全国青年女子垒球锦标赛中，我校江苏女垒发挥出色，最终夺得冠军。球队在比赛中展现了扎实的基本功与良好的团队配合。</p><p>南京工业大学长期支持垒球项目发展，学校设有中国棒垒球学院（筹），为学生运动员提供了良好的训练与成长条件。</p>',
        contentEn: '<p>NJTech\'s Jiangsu women\'s softball team claimed the title at the 2026 National Youth Women\'s Softball Championship, showing solid fundamentals and strong teamwork.</p><p>NJTech has long supported softball development, hosting the China Softball and Baseball College (in preparation), which provides student athletes with excellent training conditions.</p>'
      },
      {
        id: 6, category: 'ngyw', date: '2026-09-03', author: '党委宣传部',
        pinned: false, views: 721,
        titleZh: '校领导调研江北新区生命健康产业',
        titleEn: 'University Leaders Visit Jiangbei New Area Life and Health Industry',
        summaryZh: '校领导带队走访江北新区相关企业，围绕产学研合作、人才培养与成果转化进行深入交流。',
        summaryEn: 'University leaders visited enterprises in the Jiangbei New Area to discuss industry–academia–research cooperation, talent training and technology transfer.',
        contentZh: '<p>校领导带队赴江北新区调研生命健康产业，实地走访相关企业，了解产业技术需求与人才需求。</p><p>双方围绕共建研发平台、联合培养人才、推进科技成果转化等方面进行了交流，表示将进一步深化校企合作，服务区域产业高质量发展。</p>',
        contentEn: '<p>University leaders led a delegation to the Jiangbei New Area to study the life and health industry, visiting enterprises to understand technological and talent needs.</p><p>Both sides discussed co-building research platforms, jointly training talent and advancing technology transfer, agreeing to deepen university–enterprise cooperation.</p>'
      },
      {
        id: 7, category: 'tzgg', date: '2026-09-11', author: '校长办公室',
        pinned: true, views: 3402,
        titleZh: '关于 2026 年中秋节、国庆节放假安排的通知',
        titleEn: 'Notice on the 2026 Mid-Autumn Festival and National Day Holiday Arrangements',
        summaryZh: '根据国家法定节假日安排并结合学校实际，现将 2026 年中秋节、国庆节放假安排及有关要求通知如下。',
        summaryEn: 'In accordance with national statutory holiday arrangements and the university\'s academic calendar, the 2026 Mid-Autumn Festival and National Day holiday arrangements are hereby announced.',
        contentZh: '<h2>一、放假时间</h2><p>放假安排按国家统一规定执行，具体起止日期以学校正式通知为准。各教学单位应根据放假时间提前调整教学计划，确保教学任务按时完成。</p><h2>二、工作要求</h2><ul><li>各单位要做好值班安排，确保信息畅通，遇有突发事件按规定及时报告并妥善处置。</li><li>相关部门要加强校园安全管理，做好实验室、宿舍、食堂等重点区域的安全检查。</li><li>师生离校前请关好门窗、关闭水电，注意出行安全。</li></ul><h2>三、返校要求</h2><p>请师生合理安排行程，按时返校。因特殊情况不能按时返校的，应按规定办理请假手续。</p>',
        contentEn: '<h2>1. Holiday dates</h2><p>The holiday follows national statutory arrangements, with exact dates subject to the university\'s official notice. Teaching units should adjust plans accordingly to ensure course requirements are met.</p><h2>2. Requirements</h2><ul><li>All units must arrange duty rosters and keep communication open, reporting and handling emergencies promptly.</li><li>Relevant departments should strengthen campus safety management, including inspections of laboratories, dormitories and canteens.</li><li>Before leaving, please secure doors and windows, shut off water and power, and stay safe while travelling.</li></ul><h2>3. Returning to campus</h2><p>Please plan your travel reasonably and return on time. Those unable to return due to special circumstances should apply for leave as required.</p>'
      },
      {
        id: 8, category: 'tzgg', date: '2026-09-08', author: '教务处',
        pinned: false, views: 2815,
        titleZh: '关于 2026—2027 学年第一学期选课工作安排的通知',
        titleEn: 'Notice on Course Selection for the First Semester of 2026–2027',
        summaryZh: '本学期选课分为预选、正选与补退选三个阶段，请同学们在规定时间内通过教务管理系统完成选课。',
        summaryEn: 'Course selection this semester has three stages — pre-selection, formal selection and add/drop. Students should complete selection via the academic affairs system within the specified periods.',
        contentZh: '<h2>一、选课时间</h2><p>本学期选课分为预选、正选和补退选三个阶段。各阶段具体开放时间请登录教务管理系统查看，逾期系统自动关闭。</p><h2>二、选课方式</h2><p>学生登录教务管理系统，进入“选课”模块，按培养方案要求选择课程。请务必核对课程名称、学分、上课时间与任课教师。</p><h2>三、注意事项</h2><ul><li>请提前确认培养方案要求，避免漏选必修课程。</li><li>选课结束后请核对个人课表，如有冲突及时在补退选阶段调整。</li><li>未在规定时间内完成选课的，后果由本人承担。</li></ul>',
        contentEn: '<h2>1. Schedule</h2><p>Selection is divided into pre-selection, formal selection and add/drop. Please log in to the academic affairs system for exact opening times; the system closes automatically after each stage.</p><h2>2. How to select</h2><p>Log in to the academic affairs system, open the "Course Selection" module and choose courses according to your program requirements. Verify course names, credits, class times and instructors.</p><h2>3. Notes</h2><ul><li>Check your program requirements in advance to avoid missing compulsory courses.</li><li>After selection, verify your personal timetable and resolve conflicts during the add/drop stage.</li><li>Students who fail to complete selection on time bear the consequences themselves.</li></ul>'
      },
      {
        id: 9, category: 'tzgg', date: '2026-08-28', author: '人事处',
        pinned: false, views: 967,
        titleZh: '关于开展 2026 年度教职工自主选择体检机构的通知',
        titleEn: 'Notice on Faculty Choice of Health Check Providers for 2026',
        summaryZh: '为更好地服务教职工，2026 年度体检继续采用自主选择体检机构的方式，请教职工在规定时间内完成选择。',
        summaryEn: 'To better serve faculty and staff, the 2026 health check continues to allow independent choice of provider. Please complete your selection within the given period.',
        contentZh: '<p>为更好地满足教职工个性化健康服务需求，2026 年度教职工体检继续采用自主选择体检机构的方式。</p><p>请教职工登录校内信息门户，在公布的合作体检机构中完成选择，并在规定时间内预约体检。具体机构名单与操作流程详见门户通知。</p>',
        contentEn: '<p>To better meet individualized health service needs, the 2026 faculty health check again allows independent choice of provider.</p><p>Please log in to the campus information portal, select from the published partner providers and book your appointment within the specified period.</p>'
      },
      {
        id: 10, category: 'xshd', date: '2026-08-17', author: '应急管理学院',
        pinned: false, views: 512,
        titleZh: '第三届国家安全学学科建设研讨会暨第六届应急治理与政策研究前沿论坛举行',
        titleEn: 'Third Symposium on National Security Studies and Sixth Forum on Emergency Governance Held',
        summaryZh: '来自高校与科研机构的专家学者围绕国家安全学学科建设、应急治理与政策研究展开研讨。',
        summaryEn: 'Experts from universities and research institutions discussed the development of national security studies, emergency governance and policy research.',
        contentZh: '<p>会议由南京工业大学应急管理学院等单位参与举办，与会专家围绕国家安全学学科体系构建、应急管理人才培养、政策研究前沿等议题展开交流。</p><p>南京工业大学应急管理学院创办于 2021 年，致力于培养应急管理急需紧缺专业人才，建设国内一流、国际知名的应急管理人才培养与科技创新基地。</p>',
        contentEn: '<p>Hosted with the participation of NJTech\'s School of Emergency Management, the forum brought together experts to discuss the disciplinary framework of national security studies, emergency management talent training and frontier policy research.</p><p>Founded in 2021, NJTech\'s School of Emergency Management aims to cultivate urgently needed professionals and build a first-class base for talent training and technological innovation.</p>'
      },
      {
        id: 11, category: 'xshd', date: '2026-08-03', author: '柔性电子学院',
        pinned: false, views: 688,
        titleZh: '2026 年钙钛矿光电子研讨会在我校举行',
        titleEn: '2026 Perovskite Optoelectronics Workshop Held at NJTech',
        summaryZh: '研讨会聚焦钙钛矿光电器件的最新研究进展，来自国内高校与科研院所的学者作了学术报告。',
        summaryEn: 'Focusing on the latest advances in perovskite optoelectronic devices, scholars from domestic universities and institutes delivered academic reports.',
        contentZh: '<p>2026 年钙钛矿光电子研讨会在我校举行，与会学者围绕钙钛矿材料制备、器件结构设计与稳定性提升等方向作了专题报告。</p><p>学校建有柔性电子全国重点实验室，在相关领域具备良好的研究基础与平台条件。</p>',
        contentEn: '<p>The 2026 Perovskite Optoelectronics Workshop was held at NJTech, with scholars presenting on perovskite material preparation, device design and stability improvement.</p><p>NJTech hosts the National Key Laboratory of Flexible Electronics, providing strong research foundations and platform support in related fields.</p>'
      },
      {
        id: 12, category: 'xshd', date: '2026-07-09', author: '社会科学处',
        pinned: false, views: 401,
        titleZh: '“劝业青科汇”青年教师哲社科研能力提升活动举行',
        titleEn: '"Quanye Young Scholars Forum" Boosts Early-Career Research Capacity',
        summaryZh: '活动面向学校青年教师，围绕科研选题、项目申报与成果发表等主题开展交流与辅导。',
        summaryEn: 'Aimed at early-career faculty, the event offered guidance and discussion on research topics, grant applications and publication.',
        contentZh: '<p>为提升青年教师哲学社会科学研究能力，学校举办“劝业青科汇”系列活动，邀请校内外专家围绕科研选题、项目申报与论文写作等进行辅导。</p><p>与会青年教师表示，活动有助于理清研究思路，明确发展方向。</p>',
        contentEn: '<p>To strengthen the research capacity of early-career faculty in philosophy and social sciences, NJTech ran the "Quanye Young Scholars Forum" series with experts advising on topic selection, grant applications and academic writing.</p><p>Participants said the event helped clarify their research directions.</p>'
      }
    ];
  }

  /* 2026—2027 学年第一学期课表 */
  function seedCourses() {
    return [
      /* ---- 计算机 2401 班 ---- */
      { id: 1, className: '计算机 2401 班', dayOfWeek: 1, period: '1-2', courseZh: '编译原理', courseEn: 'Compiler Principles', teacherName: '吴 磊', room: '信息楼 A210', credit: 3 },
      { id: 2, className: '计算机 2401 班', dayOfWeek: 1, period: '3-4', courseZh: '软件工程', courseEn: 'Software Engineering', teacherName: '杨 帆', room: '信息楼 A305', credit: 3 },
      { id: 3, className: '计算机 2401 班', dayOfWeek: 2, period: '1-2', courseZh: '计算机网络', courseEn: 'Computer Networks', teacherName: '郑 凯', room: '信息楼 A212', credit: 3 },
      { id: 4, className: '计算机 2401 班', dayOfWeek: 2, period: '5-6', courseZh: '人工智能导论', courseEn: 'Introduction to Artificial Intelligence', teacherName: '林 悦', room: '信息楼 A401', credit: 3 },
      { id: 5, className: '计算机 2401 班', dayOfWeek: 3, period: '1-2', courseZh: '操作系统', courseEn: 'Operating Systems', teacherName: '郑 凯', room: '信息楼 A212', credit: 4 },
      { id: 6, className: '计算机 2401 班', dayOfWeek: 3, period: '5-6', courseZh: '数据库系统原理', courseEn: 'Principles of Database Systems', teacherName: '周 敏', room: '信息楼机房 403', credit: 4 },
      { id: 7, className: '计算机 2401 班', dayOfWeek: 4, period: '3-4', courseZh: '计算机体系结构', courseEn: 'Computer Architecture', teacherName: '吴 磊', room: '信息楼 A210', credit: 3 },
      { id: 8, className: '计算机 2401 班', dayOfWeek: 4, period: '7-8', courseZh: '体育（五）', courseEn: 'Physical Education V', teacherName: '郑 强', room: '行健田径场', credit: 1 },
      { id: 9, className: '计算机 2401 班', dayOfWeek: 5, period: '1-2', courseZh: '大数据技术基础', courseEn: 'Foundations of Big Data Technology', teacherName: '林 悦', room: '信息楼 A401', credit: 3 },

      /* ---- 化工 2401 班 ---- */
      { id: 10, className: '化工 2401 班', dayOfWeek: 1, period: '1-2', courseZh: '化工原理（上）', courseEn: 'Principles of Chemical Engineering I', teacherName: '王建华', room: '明正楼 A201', credit: 4 },
      { id: 11, className: '化工 2401 班', dayOfWeek: 1, period: '5-6', courseZh: '物理化学（下）', courseEn: 'Physical Chemistry II', teacherName: '李国强', room: '笃行楼 C302', credit: 4 },
      { id: 12, className: '化工 2401 班', dayOfWeek: 2, period: '3-4', courseZh: '化工热力学', courseEn: 'Chemical Engineering Thermodynamics', teacherName: '王建华', room: '明正楼 A203', credit: 3 },
      { id: 13, className: '化工 2401 班', dayOfWeek: 3, period: '1-2', courseZh: '化工原理（上）', courseEn: 'Principles of Chemical Engineering I', teacherName: '王建华', room: '明正楼 A201', credit: 4 },
      { id: 14, className: '化工 2401 班', dayOfWeek: 3, period: '7-8', courseZh: '大学英语（三）', courseEn: 'College English III', teacherName: 'S. Miller', room: '语言楼 D105', credit: 3 },
      { id: 15, className: '化工 2401 班', dayOfWeek: 4, period: '5-6', courseZh: '化工原理实验', courseEn: 'Chemical Engineering Laboratory', teacherName: '王建华', room: '实验楼 E401', credit: 1 },
      { id: 16, className: '化工 2401 班', dayOfWeek: 4, period: '7-8', courseZh: '体育（五）', courseEn: 'Physical Education V', teacherName: '郑 强', room: '行健田径场', credit: 1 },
      { id: 17, className: '化工 2401 班', dayOfWeek: 5, period: '3-4', courseZh: '反应工程', courseEn: 'Reaction Engineering', teacherName: '孙 倩', room: '笃行楼 C108', credit: 3 },

      /* ---- 化工 2402 班（王建华授课） ---- */
      { id: 18, className: '化工 2402 班', dayOfWeek: 2, period: '1-2', courseZh: '化工原理（上）', courseEn: 'Principles of Chemical Engineering I', teacherName: '王建华', room: '明正楼 A203', credit: 4 },
      { id: 19, className: '化工 2402 班', dayOfWeek: 4, period: '1-2', courseZh: '化工原理（上）', courseEn: 'Principles of Chemical Engineering I', teacherName: '王建华', room: '明正楼 A203', credit: 4 },
      { id: 20, className: '化工 2402 班', dayOfWeek: 5, period: '1-2', courseZh: '化工原理实验', courseEn: 'Chemical Engineering Laboratory', teacherName: '王建华', room: '实验楼 E401', credit: 1 }
    ];
  }

  /* 成绩数据 */
  function seedGrades() {
    var li = [
      ['2024-2025 学年第一学期', '高等数学（上）', 'Advanced Mathematics I', 5, 88],
      ['2024-2025 学年第一学期', '程序设计基础', 'Foundations of Programming', 4, 92],
      ['2024-2025 学年第一学期', '大学英语（一）', 'College English I', 3, 85],
      ['2024-2025 学年第一学期', '思想道德与法治', 'Ideology, Morality and Rule of Law', 3, 87],
      ['2024-2025 学年第一学期', '体育（一）', 'Physical Education I', 1, 95],

      ['2024-2025 学年第二学期', '高等数学（下）', 'Advanced Mathematics II', 5, 84],
      ['2024-2025 学年第二学期', '面向对象程序设计', 'Object-Oriented Programming', 4, 90],
      ['2024-2025 学年第二学期', '大学英语（二）', 'College English II', 3, 88],
      ['2024-2025 学年第二学期', '线性代数', 'Linear Algebra', 3, 91],
      ['2024-2025 学年第二学期', '体育（二）', 'Physical Education II', 1, 89],

      ['2025-2026 学年第一学期', '数据结构', 'Data Structures', 4, 86],
      ['2025-2026 学年第一学期', '计算机组成原理', 'Computer Organization', 4, 82],
      ['2025-2026 学年第一学期', '离散数学', 'Discrete Mathematics', 4, 89],
      ['2025-2026 学年第一学期', '大学物理（上）', 'College Physics I', 4, 81],
      ['2025-2026 学年第一学期', '体育（三）', 'Physical Education III', 1, 93],

      ['2025-2026 学年第二学期', '数字逻辑', 'Digital Logic', 3, 84],
      ['2025-2026 学年第二学期', '概率论与数理统计', 'Probability and Statistics', 3, 89],
      ['2025-2026 学年第二学期', '大学物理（下）', 'College Physics II', 4, 83],
      ['2025-2026 学年第二学期', '算法设计与分析', 'Algorithm Design and Analysis', 3, 87],
      ['2025-2026 学年第二学期', '大学英语（四）', 'College English IV', 3, 86]
    ];

    var out = [];
    var id = 1;
    li.forEach(function (g) {
      out.push({
        id: id++, studentId: 4, term: g[0], courseZh: g[1], courseEn: g[2],
        credit: g[3], score: g[4], examType: '期末'
      });
    });

    /* 王建华老师所授《化工原理（上）》的班级成绩 */
    var chem = [
      [5, '张 伟', 82], [6, '王 芳', 91], [7, '刘 洋', 76],
      [8, '陈 静', 88], [9, '赵 磊', 79]
    ];
    chem.forEach(function (s) {
      out.push({
        id: id++, studentId: s[0], term: '2025-2026 学年第二学期',
        courseZh: '化工原理（上）', courseEn: 'Principles of Chemical Engineering I',
        credit: 4, score: s[2], examType: '期末', className: '化工 2401 班'
      });
    });

    var chem2 = [
      [5, '张 伟', 85], [6, '王 芳', 93], [7, '刘 洋', 74],
      [8, '陈 静', 90], [9, '赵 磊', 81]
    ];
    chem2.forEach(function (s) {
      out.push({
        id: id++, studentId: s[0], term: '2026-2027 学年第一学期',
        courseZh: '化工原理（上）', courseEn: 'Principles of Chemical Engineering I',
        credit: 4, score: s[2], examType: '期中', className: '化工 2401 班'
      });
    });

    return out;
  }

  /* ------------------------------------------------------------------------
     底层读写
     ------------------------------------------------------------------------ */
  function available() {
    try {
      var k = '__njtech_test__';
      global.localStorage.setItem(k, '1');
      global.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  var memoryFallback = {};
  var useMemory = !available();

  function readRaw(key) {
    if (useMemory) {
      return Object.prototype.hasOwnProperty.call(memoryFallback, key)
        ? memoryFallback[key] : null;
    }
    try {
      return global.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function writeRaw(key, value) {
    if (useMemory) {
      memoryFallback[key] = value;
      return true;
    }
    try {
      global.localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function removeRaw(key) {
    if (useMemory) {
      delete memoryFallback[key];
      return;
    }
    try {
      global.localStorage.removeItem(key);
    } catch (e) { /* 忽略 */ }
  }

  function readArray(key) {
    var raw = readRaw(key);
    if (!raw) return [];
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeArray(key, arr) {
    return writeRaw(key, JSON.stringify(arr));
  }

  function readObject(key) {
    var raw = readRaw(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  /* ------------------------------------------------------------------------
     种子初始化
     ------------------------------------------------------------------------ */
  function init(force) {
    var current = readRaw(KEYS.seed);
    if (!force && current === SEED_VERSION) return false;

    writeArray(KEYS.users, seedUsers());
    writeArray(KEYS.news, seedNews());
    writeArray(KEYS.courses, seedCourses());
    writeArray(KEYS.grades, seedGrades());
    writeRaw(KEYS.seed, SEED_VERSION);
    removeRaw(KEYS.session);
    return true;
  }

  function resetAll() {
    init(true);
  }

  function nextId(list) {
    var max = 0;
    list.forEach(function (item) {
      var n = Number(item && item.id);
      if (!isNaN(n) && n > max) max = n;
    });
    return max + 1;
  }

  function clone(obj) {
    return obj ? JSON.parse(JSON.stringify(obj)) : obj;
  }

  /* ------------------------------------------------------------------------
     用户
     ------------------------------------------------------------------------ */
  var Users = {
    all: function () {
      return readArray(KEYS.users);
    },
    byId: function (id) {
      id = Number(id);
      var found = Users.all().filter(function (u) { return Number(u.id) === id; });
      return found.length ? found[0] : null;
    },
    byUsername: function (username) {
      var name = String(username || '').trim().toLowerCase();
      var found = Users.all().filter(function (u) {
        return String(u.username || '').toLowerCase() === name;
      });
      return found.length ? found[0] : null;
    },
    byRole: function (role) {
      return Users.all().filter(function (u) { return u.role === role; });
    },
    byClass: function (className) {
      return Users.all().filter(function (u) {
        return u.role === 'student' && u.className === className;
      });
    },
    /** 登录校验；返回 { ok, user } 或 { ok:false, error } */
    authenticate: function (username, password) {
      var user = Users.byUsername(username);
      if (!user) {
        return { ok: false, error: 'userNotFound' };
      }
      if (String(user.password) !== String(password)) {
        return { ok: false, error: 'wrongPassword' };
      }
      if (user.active === false) {
        return { ok: false, error: 'accountDisabled' };
      }
      return { ok: true, user: clone(user) };
    },
    create: function (data) {
      var list = Users.all();
      if (Users.byUsername(data.username)) {
        return { ok: false, error: 'usernameTaken' };
      }
      var user = {
        id: nextId(list),
        username: String(data.username || '').trim(),
        password: String(data.password || '123456'),
        name: String(data.name || '').trim(),
        role: data.role || 'student',
        college: data.college || '',
        major: data.major || '',
        className: data.className || '',
        studentNo: data.studentNo || '',
        title: data.title || '',
        active: data.active !== false
      };
      list.push(user);
      writeArray(KEYS.users, list);
      return { ok: true, user: user };
    },
    update: function (id, patch) {
      id = Number(id);
      var list = Users.all();
      var index = -1;
      for (var i = 0; i < list.length; i++) {
        if (Number(list[i].id) === id) { index = i; break; }
      }
      if (index < 0) return { ok: false, error: 'notFound' };

      if (patch.username) {
        var dup = list.filter(function (u) {
          return Number(u.id) !== id &&
            String(u.username).toLowerCase() === String(patch.username).toLowerCase();
        });
        if (dup.length) return { ok: false, error: 'usernameTaken' };
      }

      Object.keys(patch).forEach(function (k) {
        if (k === 'id') return;
        if (patch[k] === undefined) return;
        if (k === 'password' && !patch[k]) return;
        list[index][k] = patch[k];
      });
      writeArray(KEYS.users, list);
      return { ok: true, user: list[index] };
    },
    remove: function (id) {
      id = Number(id);
      var list = Users.all();
      var next = list.filter(function (u) { return Number(u.id) !== id; });
      if (next.length === list.length) return { ok: false, error: 'notFound' };
      writeArray(KEYS.users, next);
      return { ok: true };
    }
  };

  /* ------------------------------------------------------------------------
     新闻
     ------------------------------------------------------------------------ */
  var News = {
    all: function () {
      return readArray(KEYS.news);
    },
    byId: function (id) {
      id = Number(id);
      var found = News.all().filter(function (n) { return Number(n.id) === id; });
      return found.length ? found[0] : null;
    },
    /** 按置顶、日期倒序排序后的列表 */
    sorted: function () {
      return News.all().sort(function (a, b) {
        var pa = a.pinned ? 1 : 0;
        var pb = b.pinned ? 1 : 0;
        if (pa !== pb) return pb - pa;
        return String(b.date).localeCompare(String(a.date));
      });
    },
    /** 查询：{ category, keyword } —— 关键词同时匹配中英标题与摘要 */
    query: function (options) {
      var opts = options || {};
      var kw = String(opts.keyword || '').trim().toLowerCase();
      return News.sorted().filter(function (n) {
        if (opts.category && opts.category !== 'all' && n.category !== opts.category) {
          return false;
        }
        if (!kw) return true;
        var hay = [
          n.titleZh, n.titleEn, n.summaryZh, n.summaryEn, n.author
        ].join(' ').toLowerCase();
        return hay.indexOf(kw) >= 0;
      });
    },
    related: function (id, limit) {
      var target = News.byId(id);
      if (!target) return [];
      var same = News.sorted().filter(function (n) {
        return Number(n.id) !== Number(id) && n.category === target.category;
      });
      var others = News.sorted().filter(function (n) {
        return Number(n.id) !== Number(id) && n.category !== target.category;
      });
      return same.concat(others).slice(0, limit || 5);
    },
    incrementViews: function (id) {
      id = Number(id);
      var list = News.all();
      for (var i = 0; i < list.length; i++) {
        if (Number(list[i].id) === id) {
          list[i].views = Number(list[i].views || 0) + 1;
          writeArray(KEYS.news, list);
          return list[i].views;
        }
      }
      return 0;
    },
    create: function (data) {
      var list = News.all();
      var item = {
        id: nextId(list),
        category: CATEGORIES[data.category] ? data.category : 'ngyw',
        date: data.date || todayISO(),
        author: String(data.author || '党委宣传部').trim(),
        pinned: !!data.pinned,
        views: 0,
        titleZh: String(data.titleZh || '').trim(),
        titleEn: String(data.titleEn || '').trim(),
        summaryZh: String(data.summaryZh || '').trim(),
        summaryEn: String(data.summaryEn || '').trim(),
        contentZh: textToHtml(data.contentZh),
        contentEn: textToHtml(data.contentEn)
      };
      list.push(item);
      writeArray(KEYS.news, list);
      return { ok: true, item: item };
    },
    update: function (id, patch) {
      id = Number(id);
      var list = News.all();
      var index = -1;
      for (var i = 0; i < list.length; i++) {
        if (Number(list[i].id) === id) { index = i; break; }
      }
      if (index < 0) return { ok: false, error: 'notFound' };

      var p = clone(patch);
      if (p.contentZh !== undefined) p.contentZh = textToHtml(p.contentZh);
      if (p.contentEn !== undefined) p.contentEn = textToHtml(p.contentEn);
      if (p.date) p.date = String(p.date);
      p.pinned = !!p.pinned;

      Object.keys(p).forEach(function (k) {
        if (k === 'id' || p[k] === undefined) return;
        list[index][k] = p[k];
      });
      writeArray(KEYS.news, list);
      return { ok: true, item: list[index] };
    },
    remove: function (id) {
      id = Number(id);
      var list = News.all();
      var next = list.filter(function (n) { return Number(n.id) !== id; });
      if (next.length === list.length) return { ok: false, error: 'notFound' };
      writeArray(KEYS.news, next);
      return { ok: true };
    },
    countByCategory: function () {
      var out = { all: 0, ngyw: 0, tzgg: 0, xshd: 0 };
      News.all().forEach(function (n) {
        out.all++;
        if (out[n.category] !== undefined) out[n.category]++;
      });
      return out;
    }
  };

  /* ------------------------------------------------------------------------
     课程
     ------------------------------------------------------------------------ */
  var Courses = {
    all: function () {
      return readArray(KEYS.courses);
    },
    byClass: function (className) {
      return Courses.all()
        .filter(function (c) { return c.className === className; })
        .sort(sortCourses);
    },
    byTeacher: function (teacherName) {
      var name = normalizeName(teacherName);
      return Courses.all()
        .filter(function (c) { return normalizeName(c.teacherName) === name; })
        .sort(sortCourses);
    },
    /** 某教师授课的班级列表（去重） */
    classesOfTeacher: function (teacherName) {
      var seen = [];
      Courses.byTeacher(teacherName).forEach(function (c) {
        if (seen.indexOf(c.className) < 0) seen.push(c.className);
      });
      return seen;
    },
    /** 全部班级列表（去重，按名称排序） */
    allClasses: function () {
      var seen = [];
      Courses.all().forEach(function (c) {
        if (seen.indexOf(c.className) < 0) seen.push(c.className);
      });
      return seen.sort();
    },
    /** 教师课表中出现的课程名（去重） */
    courseNamesOfTeacher: function (teacherName) {
      var seen = [];
      Courses.byTeacher(teacherName).forEach(function (c) {
        if (seen.indexOf(c.courseZh) < 0) seen.push(c.courseZh);
      });
      return seen;
    }
  };

  function sortCourses(a, b) {
    if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
    return String(a.period).localeCompare(String(b.period));
  }

  function normalizeName(name) {
    return String(name || '').replace(/\s+/g, '');
  }

  /* ------------------------------------------------------------------------
     成绩
     ------------------------------------------------------------------------ */
  var Grades = {
    all: function () {
      return readArray(KEYS.grades);
    },
    byStudent: function (studentId) {
      studentId = Number(studentId);
      return Grades.all().filter(function (g) {
        return Number(g.studentId) === studentId;
      });
    },
    /** 按学期分组：[{ term, items: [] }]，学期按时间正序 */
    byStudentGrouped: function (studentId) {
      var map = {};
      Grades.byStudent(studentId).forEach(function (g) {
        if (!map[g.term]) map[g.term] = [];
        map[g.term].push(g);
      });
      return Object.keys(map).sort().map(function (term) {
        return { term: term, items: map[term] };
      });
    },
    /** 某教师所授课程的成绩（依据课程名匹配） */
    byTeacher: function (teacherName) {
      var names = Courses.courseNamesOfTeacher(teacherName);
      if (!names.length) return [];
      return Grades.all().filter(function (g) {
        return names.indexOf(g.courseZh) >= 0;
      });
    },
    /** 学业统计：加权平均分、总学分、平均绩点 */
    summary: function (studentId) {
      var list = Grades.byStudent(studentId);
      var totalCredit = 0;
      var weighted = 0;   // 加权平均分
      var gpaWeighted = 0; // 加权绩点
      var passed = 0;
      list.forEach(function (g) {
        var credit = Number(g.credit) || 0;
        var score = Number(g.score) || 0;
        totalCredit += credit;
        weighted += score * credit;
        gpaWeighted += gradePoint(score) * credit;
        if (score >= 60) passed++;
      });
      return {
        courseCount: list.length,
        passedCount: passed,
        totalCredit: totalCredit,
        average: totalCredit ? round2(weighted / totalCredit) : 0,
        gpa: totalCredit ? round2(gpaWeighted / totalCredit) : 0
      };
    }
  };

  /**
   * 百分制成绩转 4.0 制绩点（常见的分段换算方式，仅作演示口径）
   */
  function gradePoint(score) {
    var s = Number(score) || 0;
    if (s >= 90) return 4.0;
    if (s >= 85) return 3.7;
    if (s >= 82) return 3.3;
    if (s >= 78) return 3.0;
    if (s >= 75) return 2.7;
    if (s >= 72) return 2.3;
    if (s >= 68) return 2.0;
    if (s >= 64) return 1.5;
    if (s >= 60) return 1.0;
    return 0;
  }

  function round2(n) {
    return Math.round(n * 100) / 100;
  }

  /* ------------------------------------------------------------------------
     会话与偏好
     ------------------------------------------------------------------------ */
  var Session = {
    get: function () {
      var s = readObject(KEYS.session);
      if (!s || !s.userId) return null;
      var user = Users.byId(s.userId);
      if (!user || user.active === false) {
        Session.clear();
        return null;
      }
      return { userId: Number(s.userId), role: user.role, loginAt: s.loginAt };
    },
    currentUser: function () {
      var s = Session.get();
      return s ? Users.byId(s.userId) : null;
    },
    isLoggedIn: function () {
      return !!Session.get();
    },
    set: function (userId) {
      var user = Users.byId(userId);
      if (!user) return false;
      writeRaw(KEYS.session, JSON.stringify({
        userId: Number(userId),
        role: user.role,
        loginAt: new Date().toISOString()
      }));
      return true;
    },
    clear: function () {
      removeRaw(KEYS.session);
    }
  };

  var Prefs = {
    getLang: function () {
      var lang = readRaw(KEYS.lang);
      return lang === 'en' ? 'en' : 'zh';
    },
    setLang: function (lang) {
      writeRaw(KEYS.lang, lang === 'en' ? 'en' : 'zh');
    }
  };

  /* ------------------------------------------------------------------------
     工具
     ------------------------------------------------------------------------ */
  function todayISO() {
    var d = new Date();
    var m = String(d.getMonth() + 1);
    var day = String(d.getDate());
    if (m.length < 2) m = '0' + m;
    if (day.length < 2) day = '0' + day;
    return d.getFullYear() + '-' + m + '-' + day;
  }

  /** 把纯文本（空行分段）转成简单 HTML；已经是 HTML 则原样返回 */
  function textToHtml(text) {
    var str = String(text == null ? '' : text).trim();
    if (!str) return '';
    if (/<(p|h2|h3|ul|ol|li|br|div|strong|em)\b/i.test(str)) return str;
    return str
      .split(/\n\s*\n/)
      .map(function (para) { return '<p>' + para.trim() + '</p>'; })
      .join('');
  }

  /* ------------------------------------------------------------------------
     对外接口
     ------------------------------------------------------------------------ */
  var Store = {
    KEYS: KEYS,
    SEED_VERSION: SEED_VERSION,
    CATEGORIES: CATEGORIES,
    ROLES: ROLES,
    SCHOOL: SCHOOL,

    users: Users,
    news: News,
    courses: Courses,
    grades: Grades,
    session: Session,
    prefs: Prefs,

    init: init,
    resetAll: resetAll,

    /** 是否退化为内存存储（localStorage 不可用时） */
    isMemoryOnly: function () { return useMemory; },

    gradePoint: gradePoint,
    todayISO: todayISO,
    textToHtml: textToHtml,
    clone: clone
  };

  /* 立即完成初始化，保证后续脚本拿到的就是完整数据 */
  init(false);

  global.Store = Store;
})(window);
