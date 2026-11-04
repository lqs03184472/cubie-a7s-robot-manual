/* Cubie A7S Robot Manual — charts & diagrams */
(function () {
  'use strict';

  var css = getComputedStyle(document.documentElement);
  function v(name) { return css.getPropertyValue(name).trim(); }

  var INK = v('--ink') || '#1a2230';
  var MUTED = v('--muted') || '#5a6472';
  var RULE = v('--rule') || '#d8dee5';
  var ACCENT = v('--accent') || '#0d6e6e';
  var ACCENT2 = v('--accent2') || '#e8762d';
  var BG2 = v('--bg2') || '#eef1f4';

  var FONT = "'InstrumentSans', 'PingFang SC', 'Microsoft YaHei', sans-serif";
  var MONO = "'JetBrainsMono', 'Consolas', monospace";

  var charts = [];

  function make(id, option) {
    var el = document.getElementById(id);
    if (!el || typeof echarts === 'undefined') return;
    var c = echarts.init(el, null, { renderer: 'canvas' });
    option.animation = false;
    option.textStyle = { fontFamily: FONT, color: INK };
    c.setOption(option);
    charts.push(c);
  }

  /* ---------- 图 1-1 · 能力雷达图 ---------- */
  make('chart-capability', {
    tooltip: { trigger: 'item', textStyle: { fontFamily: FONT } },
    legend: {
      bottom: 8,
      itemWidth: 14,
      itemHeight: 9,
      textStyle: { color: MUTED, fontSize: 12 }
    },
    radar: {
      center: ['50%', '48%'],
      radius: '62%',
      splitNumber: 5,
      axisName: { color: INK, fontSize: 12, fontFamily: FONT },
      axisLine: { lineStyle: { color: RULE } },
      splitLine: { lineStyle: { color: RULE } },
      splitArea: { areaStyle: { color: ['#ffffff', BG2] } },
      indicator: [
        { name: '实时运动控制', max: 10 },
        { name: '视觉推理', max: 10 },
        { name: '语音交互', max: 10 },
        { name: '多任务并行', max: 10 },
        { name: '接口扩展', max: 10 },
        { name: '功耗与散热', max: 10 }
      ]
    },
    series: [{
      type: 'radar',
      symbolSize: 4,
      data: [
        {
          name: 'Cubie A7S 支撑度',
          value: [9, 8, 8, 8, 9, 7],
          lineStyle: { color: ACCENT, width: 2 },
          itemStyle: { color: ACCENT },
          areaStyle: { color: ACCENT, opacity: 0.18 }
        },
        {
          name: '项目需求基线',
          value: [8, 7, 7, 7, 7, 6],
          lineStyle: { color: ACCENT2, width: 2, type: 'dashed' },
          itemStyle: { color: ACCENT2 },
          areaStyle: { color: ACCENT2, opacity: 0.05 }
        }
      ]
    }]
  });

  /* ---------- 图 13-1 · 内存分配（堆叠条形） ---------- */
  make('chart-memory', {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: { fontFamily: FONT },
      valueFormatter: function (x) { return x + ' GB'; }
    },
    legend: {
      bottom: 8,
      itemWidth: 14,
      itemHeight: 9,
      textStyle: { color: MUTED, fontSize: 12 }
    },
    grid: { left: 110, right: 40, top: 30, bottom: 60 },
    xAxis: {
      type: 'value',
      max: 6,
      name: 'GB',
      nameTextStyle: { color: MUTED, fontFamily: MONO },
      axisLabel: { color: MUTED, fontFamily: MONO },
      splitLine: { lineStyle: { color: RULE } }
    },
    yAxis: {
      type: 'category',
      data: ['满载并行场景'],
      axisLabel: { color: INK, fontSize: 13 },
      axisLine: { lineStyle: { color: RULE } },
      axisTick: { show: false }
    },
    series: [
      { name: '系统 + ROS 2 基础', type: 'bar', stack: 'mem', barWidth: 64, data: [1.2], itemStyle: { color: ACCENT }, label: { show: true, formatter: '1.2', color: '#fff', fontFamily: MONO } },
      { name: '视觉链路(采集+YOLO)', type: 'bar', stack: 'mem', data: [1.5], itemStyle: { color: ACCENT2 }, label: { show: true, formatter: '1.5', color: '#fff', fontFamily: MONO } },
      { name: '语音助手(KWS/ASR/TTS)', type: 'bar', stack: 'mem', data: [0.8], itemStyle: { color: '#4a8f8d' }, label: { show: true, formatter: '0.8', color: '#fff', fontFamily: MONO } },
      { name: '导航/SLAM', type: 'bar', stack: 'mem', data: [0.3], itemStyle: { color: '#b07aa1' }, label: { show: true, formatter: '0.3', color: '#fff', fontFamily: MONO } },
      { name: '桌面/调试工具', type: 'bar', stack: 'mem', data: [0.5], itemStyle: { color: '#8a97a5' }, label: { show: true, formatter: '0.5', color: '#fff', fontFamily: MONO } },
      { name: '安全预留', type: 'bar', stack: 'mem', data: [1.7], itemStyle: { color: BG2, borderColor: RULE, borderWidth: 1 }, label: { show: true, formatter: '预留 1.7', color: MUTED, fontFamily: MONO } }
    ]
  });

  /* ---------- 图 13-2 · CPU 核心任务分配 ---------- */
  var coreColors = {
    'A76 大核': ACCENT2,
    'A55 小核': ACCENT
  };
  make('chart-cpu', {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: { fontFamily: FONT }
    },
    legend: {
      bottom: 8,
      itemWidth: 14,
      itemHeight: 9,
      textStyle: { color: MUTED, fontSize: 12 }
    },
    grid: { left: 150, right: 40, top: 30, bottom: 60 },
    xAxis: {
      type: 'value',
      max: 100,
      name: '负载占比 (%)',
      nameTextStyle: { color: MUTED, fontFamily: MONO },
      axisLabel: { color: MUTED, fontFamily: MONO },
      splitLine: { lineStyle: { color: RULE } }
    },
    yAxis: {
      type: 'category',
      data: [
        'Core0-1 (A76×2)',
        'Core2-3 (A55)',
        'Core4-5 (A55)',
        'Core6-7 (A55)'
      ],
      axisLabel: { color: INK, fontSize: 12, fontFamily: MONO },
      axisLine: { lineStyle: { color: RULE } },
      axisTick: { show: false }
    },
    series: [
      {
        name: '决策/状态机/任务编排',
        type: 'bar', stack: 'load', barWidth: 40,
        data: [65, 0, 0, 0],
        itemStyle: { color: ACCENT2 }
      },
      {
        name: '跟踪/避让决策',
        type: 'bar', stack: 'load',
        data: [25, 0, 0, 0],
        itemStyle: { color: '#f0a56b' }
      },
      {
        name: '图像采集/预处理',
        type: 'bar', stack: 'load',
        data: [0, 60, 0, 0],
        itemStyle: { color: ACCENT }
      },
      {
        name: 'NPU 推理回调/后处理',
        type: 'bar', stack: 'load',
        data: [0, 25, 15, 0],
        itemStyle: { color: '#4a8f8d' }
      },
      {
        name: '语音链路(CPU 段)',
        type: 'bar', stack: 'load',
        data: [0, 0, 35, 30],
        itemStyle: { color: '#7a9e7e' }
      },
      {
        name: '导航/SLAM(定位/规划)',
        type: 'bar', stack: 'load',
        data: [0, 0, 15, 20],
        itemStyle: { color: '#b07aa1' }
      },
      {
        name: '日志/网络/系统',
        type: 'bar', stack: 'load',
        data: [10, 15, 35, 40],
        itemStyle: { color: '#8a97a5' }
      },
      {
        name: '空闲余量',
        type: 'bar', stack: 'load',
        data: [0, 0, 0, 10],
        itemStyle: { color: BG2, borderColor: RULE, borderWidth: 1 }
      }
    ]
  });

  /* ---------- 图 3-1 · 采买预算分布（横向条形） ---------- */
  var bomCats = [
    '工具与耗材',
    '线材与连接件',
    '感知(视觉/语音/导航)',
    '机械臂',
    '底盘与运动',
    '电源与散热',
    '计算核心与存储'
  ];
  var bomVals = [336.4, 74.7, 728, 140.4, 240.3, 344.3, 358.8];
  make('chart-bom', {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: { fontFamily: FONT },
      valueFormatter: function (x) { return '¥' + x; }
    },
    grid: { left: 168, right: 70, top: 24, bottom: 34 },
    xAxis: {
      type: 'value',
      max: 800,
      name: '元',
      nameTextStyle: { color: MUTED, fontFamily: MONO },
      axisLabel: { color: MUTED, fontFamily: MONO },
      splitLine: { lineStyle: { color: RULE } }
    },
    yAxis: {
      type: 'category',
      data: bomCats,
      axisLabel: { color: INK, fontSize: 12 },
      axisLine: { lineStyle: { color: RULE } },
      axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      barWidth: 22,
      data: bomVals.map(function (v, i) {
        return {
          value: v,
          itemStyle: { color: i === bomVals.length - 1 ? ACCENT2 : ACCENT, borderRadius: [0, 4, 4, 0] }
        };
      }),
      label: {
        show: true,
        position: 'right',
        formatter: '¥{c}',
        color: MUTED,
        fontFamily: MONO,
        fontSize: 11
      }
    }]
  });

  /* ---------- 图 16-2 · 扩展后资源预算（双轴分组条形） ---------- */
  make('chart-budget', {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      textStyle: { fontFamily: FONT }
    },
    legend: {
      bottom: 8,
      itemWidth: 14,
      itemHeight: 9,
      textStyle: { color: MUTED, fontSize: 12 }
    },
    grid: { left: 60, right: 60, top: 30, bottom: 60 },
    xAxis: {
      type: 'category',
      data: ['现有功能占用', '本次新增', '剩余余量'],
      axisLabel: { color: INK, fontSize: 12 },
      axisLine: { lineStyle: { color: RULE } },
      axisTick: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        name: '核心当量',
        max: 8,
        nameTextStyle: { color: MUTED, fontFamily: MONO },
        axisLabel: { color: MUTED, fontFamily: MONO },
        splitLine: { lineStyle: { color: RULE } }
      },
      {
        type: 'value',
        name: 'GB',
        max: 6,
        nameTextStyle: { color: MUTED, fontFamily: MONO },
        axisLabel: { color: MUTED, fontFamily: MONO },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'CPU（核心当量 / 8）',
        type: 'bar',
        yAxisIndex: 0,
        barWidth: 30,
        data: [5.5, 1.3, 1.2],
        itemStyle: { color: ACCENT, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}', color: INK, fontFamily: MONO, fontSize: 11 }
      },
      {
        name: '内存（GB / 6）',
        type: 'bar',
        yAxisIndex: 1,
        barWidth: 30,
        data: [4.3, 0.4, 1.3],
        itemStyle: { color: ACCENT2, borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}', color: INK, fontFamily: MONO, fontSize: 11 }
      }
    ]
  });

  window.addEventListener('resize', function () {
    charts.forEach(function (c) { c.resize(); });
  });

  /* ---------- Mermaid ---------- */
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      flowchart: { htmlLabels: true, curve: 'basis' },
      themeVariables: {
        fontFamily: FONT,
        fontSize: '13px',
        primaryColor: '#ffffff',
        primaryBorderColor: ACCENT,
        primaryTextColor: INK,
        lineColor: MUTED,
        clusterBkg: BG2,
        clusterBorder: RULE
      }
    });

    /* 图内去重：Mermaid 会为每个流程图生成相同的内部 id（如 L_A_B_0），
       同页多图时形成重复 id。渲染完成后按图逐个重命名，并同步 url(#id) 引用。 */
    var mermaidSeenIds = Object.create(null);
    function mermaidDedupeIds(svg) {
      var map = Object.create(null);
      Array.prototype.forEach.call(svg.querySelectorAll('[id]'), function (el) {
        var id = el.id;
        if (mermaidSeenIds[id]) {
          var next = id + '-' + (mermaidSeenIds[id]++);
          map[id] = next;
          el.setAttribute('id', next);
        } else {
          mermaidSeenIds[id] = 1;
        }
      });
      var keys = Object.keys(map);
      if (!keys.length) return;
      Array.prototype.forEach.call(svg.querySelectorAll('*'), function (el) {
        for (var i = 0; i < el.attributes.length; i++) {
          var attr = el.attributes[i];
          if (attr.value.indexOf('url(#') === -1) continue;
          var val = attr.value;
          keys.forEach(function (k) {
            val = val.split('url(#' + k + ')').join('url(#' + map[k] + ')');
          });
          if (val !== attr.value) el.setAttribute(attr.name, val);
        }
      });
    }
    function mermaidDedupeAll() {
      Array.prototype.forEach.call(document.querySelectorAll('.mermaid svg'), mermaidDedupeIds);
    }
    function mermaidWaitDedupe(tries) {
      var pending = 0;
      Array.prototype.forEach.call(document.querySelectorAll('.mermaid'), function (d) {
        if (!d.querySelector('svg')) pending++;
      });
      if (pending === 0 || tries <= 0) { mermaidDedupeAll(); }
      else { setTimeout(function () { mermaidWaitDedupe(tries - 1); }, 150); }
    }
    window.addEventListener('load', function () { mermaidWaitDedupe(40); });
  }
})();
