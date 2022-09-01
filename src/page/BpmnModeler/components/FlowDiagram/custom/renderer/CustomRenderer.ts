// @ts-nocheck

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import { append as svgAppend, attr as svgAttr, create as svgCreate, remove as svgRemove } from 'tiny-svg';

import { getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil';

import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

const HIGH_PRIORITY = 1500;
const TASK_BORDER_RADIUS = 2;

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer, paletteEntries) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
    this.paletteEntries = paletteEntries;
  }

  canRender(element) {
    // only render tasks and events (ignore labels)
    return isAny(element, ['bpmn:Task', 'bpmn:Event']) && !element.labelTarget;
  }

  // 这个是渲染的核心方法， 返回一个 shape，即一个 SVG
  drawShape(parentNode, element) {
    const { paletteEntries } = this;

    // 通过 type 找到对应的配置
    // const shape = find(paletteEntries, entry => is(element, entry.type));
    const shape = Object.values(paletteEntries).find(entry => entry.type === element.type);

    // 如果传入自定义方法，则回调该方法
    if (shape && shape.drawShape instanceof Function) {
      return shape.drawShape(parentNode, element, this.bpmnRenderer);
    }

    // 否则调用默认渲染的方法
    return this.bpmnRenderer.drawShape(parentNode, element);
    // const shape = this.bpmnRenderer.drawShape(parentNode, element);

    // if (is(element, 'bpmn:Task')) {
    //   // 当元素类型是 bpmn:Task 时
    //   const rect = drawRect(parentNode, 100, 80, TASK_BORDER_RADIUS, '#52B415'); // 创建一个带绿色边框的矩形

    //   prependTo(rect, parentNode);

    //   svgRemove(shape);

    //   return shape;
    // }

    // // 其他不属于 bpmn:Task 的元素，如开始事件
    // // 也创建一个 红色小矩形
    // const rect = drawRect(parentNode, 30, 20, TASK_BORDER_RADIUS, '#cc0000');

    // // 放置于左上角
    // svgAttr(rect, {
    //   transform: 'translate(-20, -10)',
    // });

    // return shape;
  }

  getShapePath(shape) {
    if (is(shape, 'bpmn:Task')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer', 'config.paletteEntries'];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, strokeColor) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width,
    height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: strokeColor || '#000',
    strokeWidth: 2,
    fill: '#fff',
  });

  svgAppend(parentNode, rect);

  return rect;
}

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}
