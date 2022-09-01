// @ts-nocheck bpmn-js 没有类型描述文件

import Modeler from 'bpmn-js/lib/Modeler';

import zoomScroll from '../zoomscroll';

// import CustomPalette from '../palette';
// import customContextPad from '../contextPad';

// export default function CustomModeler(options) {
//   Modeler.call(this, options);
//   this._customElements = [];
// }

// const F = function () {}; // 核心，利用空对象作为中介；
// F.prototype = Modeler.prototype; // 核心，将父类的原型赋值给空对象F；
// CustomModeler.prototype = new F(); // 核心，将 F的实例赋值给子类；
// CustomModeler.prototype.constructor = CustomModeler; // 修复子类CustomModeler的构造器指向，防止原型链的混乱；

// CustomModeler.prototype._modules = [].concat(CustomModeler.prototype._modules, [customContextPad]);

const modules = Modeler.prototype._modules;
const interactionModules = Modeler.prototype._interactionModules;

// 需要去除内置模块名称。默认工具栏、默认contextPad、画布滚轮监听zoomScroll
const needDeleteProperty = ['contextPadProvider', 'paletteProvider', 'zoomScroll'];

// const needDeleteInteractionModulesProperty = ['zoomScroll'];

// 删除指定内置模块
needDeleteProperty.forEach(property => {
  const index = modules.findIndex(it => it[property]);
  modules.splice(index, 1);
});

modules.push(zoomScroll); // 使用自定义 zoomScroll

// needDeleteInteractionModulesProperty.forEach(property => {
//   const index = interactionModules.findIndex(it => it[property]);
//   interactionModules.splice(index, 1);
// });
// interactionModules.push(zoomScroll);

export default Modeler;
