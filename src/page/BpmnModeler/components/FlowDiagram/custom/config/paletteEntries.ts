// @ts-nocheck

import { is } from 'bpmn-js/lib/util/ModelUtil';
import { append as svgAppend, attr as svgAttr, create as svgCreate, remove as svgRemove } from 'tiny-svg';
import { BPMN_PUBLIC_STATE } from '../common/constants';

const HIGH_PRIORITY = 1500;
const TASK_BORDER_RADIUS = 2;

// export default {
//   'create.start-event': createAction('bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none', 'Create StartEvent'),
//   'create.task': createAction('bpmn:Task', 'activity', 'bpmn-icon-task', 'Create Task'),
// };

// function createAction(type, group, className, title, options) {
//   // 还记得 CustomPalette.js 吗？便是这里回调 createListener 函数
//   // if (action === 'click') {
//   // 		handler(originalEvent, autoActivate, elementFactory, create)
//   // 	}
//   function createListener(event, autoActivate, elementFactory, create) {
//     const shape = elementFactory.createShape({ type });

//     create.start(event, shape);
//   }

//   return {
//     group,
//     className,
//     title,
//     action: {
//       dragstart: createListener,
//       click: createListener,
//     },
//   };
// }

let currentPaletteEntries = {};

export default {
  'create.start-event': createAction('bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none', 'Create StartEvent'),
  'create.task': createAction(
    'bpmn:Task',
    'task',
    'bpmn-icon-task-custom', // 🙋‍♂️ 使用图片后，记得修改成自己的类名
    'Create Task',
    require('../image/image.jpg'),
    drawShape,
    'arrangeNode' // 编排节点
  ),
};

export const getPaletteEntries = (materialDetails: VideoInfoItem[]) => {
  const paletteEntries = {};

  materialDetails.forEach(({ id, url, cover, name }) => {
    paletteEntries[`create.task_${id}`] = createAction(
      'bpmn:Task',
      'id',
      '__bpmn-icon-task-custom', // 🙋‍♂️ 使用图片后，记得修改成自己的类名
      name,
      cover,
      drawShape,
      `arrangeNode_${id}_${cover}`, // 编排节点 + 资源id + 资源cover
      {
        videoUrl: url,
      }
    );
  });

  currentPaletteEntries = paletteEntries;
  return paletteEntries;
};

// 实例初始化之后调用
export const customPaletteElement = () => {
  const root = document.getElementById('root'); // react app 根容器
  const customPaletteElement = root?.getElementsByClassName('custom-palette')[0]; // 工具栏盒子容器
  const customTaskElements = root?.getElementsByClassName('__bpmn-icon-task-custom'); // 工具栏每一个拖动入口item （工具拖动菜单）

  // 给工具栏容器绑定自己的事件

  if (customPaletteElement) {
    customPaletteElement.addEventListener('mouseenter', () => {
      console.log('mouseenter');

      BPMN_PUBLIC_STATE.IS_ZOOM_SCROLL = false;
    });

    customPaletteElement.addEventListener('mouseleave', () => {
      console.log('mouseleave');

      BPMN_PUBLIC_STATE.IS_ZOOM_SCROLL = true;
    });
  }

  // 自定义菜单DOM
  Array.from(customTaskElements).forEach(taskElement => {
    const name = taskElement.getAttribute('title');

    taskElement.innerHTML += `<div class="__bpmn-task-custom-name">
      <p>${name}</p>
    </div>`;
  });
};

function createAction(type, group, className, title, imageUrl = '', drawShape, idPrefix = '', __customAttrs) {
  function createListener(event, autoActivate, elementFactory, create) {
    if (!BPMN_PUBLIC_STATE.IS_CREATE) {
      return;
    }

    const shape = elementFactory.createShape({ type, id: `${idPrefix}_${Date.now()}` });
    shape.__customAttrs = __customAttrs;

    create.start(event, shape);
  }

  const config = {
    type, // 📌 渲染的时候需要判断
    group,
    className,
    title,
    drawShape, // 📌
    action: {
      dragstart: createListener,
      click: createListener,
    },
  };
  if (imageUrl) {
    Object.assign(config, {
      imageUrl,
    });
  }
  if (drawShape) {
    Object.assign(config, {
      drawShape,
    });
  }

  return config;
}

// 这里将 CustomRenderer.js 渲染的方法搬到 paletteEntries
function drawShape(parentNode, element, bpmnRenderer) {
  const shape = bpmnRenderer.drawShape(parentNode, element);

  if (is(element, 'bpmn:Task')) {
    const height = 100;
    const width = 100;
    // 真实元素的宽高
    element.width = width;
    element.height = height;

    // 显示元素的宽高与真实的宽高需要一致
    // const rect = drawRect(parentNode, width, height, TASK_BORDER_RADIUS, '#52B415');
    const rect = drawRect(parentNode, element, width, height);

    prependTo(rect, parentNode);

    svgRemove(shape);

    return shape;
  }

  const rect = drawRect(parentNode, 30, 20, TASK_BORDER_RADIUS, '#cc0000');

  svgAttr(rect, {
    transform: 'translate(-20, -10)',
  });

  return shape;
}

function drawRect(parentNode, element, width, height) {
  const info = element.id.split('_');
  const id = info[1];
  const cover = info[2];

  const entryKey = Object.keys(currentPaletteEntries).find(entry => entry.split('_')[1] === id);

  const { url } = currentPaletteEntries[entryKey];
  const customIcon = svgCreate('image', {
    href: cover,
    width,
    height,
    preserveAspectRatio: 'none', // 铺满
  });

  svgAppend(parentNode, customIcon);

  // svgAttr(rect, {
  //   width,
  //   height,
  //   rx: borderRadius,
  //   ry: borderRadius,
  //   stroke: strokeColor || '#000',
  //   strokeWidth: 2,
  //   fill: '#fff',
  // });

  // svgAppend(parentNode, rect);

  return customIcon;
}

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
// function drawRect(parentNode, width, height, borderRadius, strokeColor) {
//   const rect = svgCreate('rect');

//   svgAttr(rect, {
//     width,
//     height,
//     rx: borderRadius,
//     ry: borderRadius,
//     stroke: strokeColor || '#000',
//     strokeWidth: 2,
//     fill: '#fff',
//   });

//   svgAppend(parentNode, rect);

//   return rect;
// }

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}
