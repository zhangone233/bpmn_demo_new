// @ts-nocheck

import { BPMN_PUBLIC_STATE } from '../common/constants';

export default function ContextPadProvider(
  contextPad,
  config,
  injector,
  translate,
  bpmnFactory,
  elementFactory,
  create,
  modeling,
  connect
) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.translate = translate;
  this.bpmnFactory = bpmnFactory;
  this.modeling = modeling;
  this.connect = connect;
  config = config || {};
  if (config.autoPlace !== false) {
    this.autoPlace = injector.get('autoPlace', false);
  }
  contextPad.registerProvider(this);
}

ContextPadProvider.$inject = [
  'contextPad',
  'config',
  'injector',
  'translate',
  'bpmnFactory',
  'elementFactory',
  'create',
  'modeling',
  'connect',
];

ContextPadProvider.prototype.getContextPadEntries = function (element) {
  const info = element.id.split('_');
  const id = info[1];
  const cover = info[2];
  const { __customAttrs } = element;

  const { autoPlace, create, elementFactory, translate, modeling, connect } = this;
  // 删除功能
  function removeElement(e) {
    BPMN_PUBLIC_STATE.IS_CREATE && modeling.removeElements([element]);
  }

  // function clickElement(e) {
  //   console.log(element);
  //   // window.localStorage.setItem('nodeInfo', JSON.stringify(element))
  //   // window.localStorage.setItem('nodeVisible', 'true')
  //   // store.commit('SETNODEINFO', element)
  //   // store.commit('TOGGLENODEVISIBLE', true)
  // }

  // function appendTask(event, element) {
  //   console.log(autoPlace);
  //   if (autoPlace) {
  //     const shape = elementFactory.createShape({ type: 'bpmn:Task' });
  //     autoPlace.append(element, shape);
  //   } else {
  //     appendTaskStart(event, element);
  //   }
  // }

  // function appendTaskStart(event) {
  //   console.log(event);
  //   const shape = elementFactory.createShape({ type: 'bpmn:Task' });
  //   create.start(event, shape, element);
  // }

  // function editElement() {
  //   // 创建编辑图标
  //   return {
  //     group: 'edit',
  //     className: 'icon-custom icon-custom-edit',
  //     title: translate('编辑'),
  //     action: {
  //       click: clickElement,
  //     },
  //   };
  // }

  // function deleteElement() {
  //   return {
  //     group: 'edit',
  //     className: 'icon-custom icon-custom-delete',
  //     title: translate('删除'),
  //     action: {
  //       click: removeElement,
  //     },
  //   };
  // }

  function startConnect(event, element) {
    connect.start(event, element);
  }

  function appendAction(type, className, title, options, customOptions = {}) {
    const { idPrefix } = customOptions;

    if (typeof title !== 'string') {
      options = title;
      title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
    }

    function appendStart(event, element) {
      if (!BPMN_PUBLIC_STATE.IS_CREATE) {
        return;
      }

      const shape = elementFactory.createShape(Object.assign({ type, id: `${idPrefix}_${Date.now()}` }, options));
      shape.__customAttrs = __customAttrs;

      create.start(event, shape, {
        source: element,
      });
    }

    const append = autoPlace ?
      function (event, element) {
          if (!BPMN_PUBLIC_STATE.IS_CREATE) {
            return;
          }

          // if (autoPlace) {
          //   const shape = elementFactory.createShape({ type: 'bpmn:Task' });
          //   autoPlace.append(element, shape);
          // } else {
          //   appendTaskStart(event, element);
          // }

          const shape = elementFactory.createShape(Object.assign({ type, id: `${idPrefix}_${Date.now()}` }, options));
          shape.__customAttrs = __customAttrs;

          console.log(autoPlace, '222222');

          autoPlace.append(element, shape, '222');
        } :
      appendStart;

    return {
      group: 'model',
      className,
      title,
      action: {
        dragstart: appendStart,
        click: append,
      },
    };
  }

  // return {
  //   'append.one-task': {
  //     group: 'model',
  //     className: 'icon-custom one-task',
  //     title: translate('one-task的任务节点'),
  //     action: {
  //       click: appendTask,
  //       dragstart: appendTaskStart,
  //     },
  //   },
  //   edit: editElement(),
  //   delete: deleteElement(),
  // };

  const actions = {
    // 创建普通的矩形任务
    'append.append-task': appendAction(
      'bpmn:Task',
      'bpmn-icon-task',
      translate('Append Task'),
      {},
      {
        idPrefix: `arrangeNode_${id}_${cover}`, // / 编排节点 + 资源id + 资源cover
      }
    ),

    // 连接线
    connect: {
      group: 'connect',
      className: 'bpmn-icon-connection-multi',
      title: translate('Connect using Association'),
      action: {
        click: startConnect,
        dragstart: startConnect,
      },
    },

    // 删除图形
    delete: {
      group: 'edit',
      className: 'bpmn-icon-trash',
      title: translate('Remove'),
      action: {
        click: removeElement,
      },
    },
  };

  return Object.assign(actions);
};
