/** 获取BPMN默认xml文件节点 */
export const getDefaultXml = (): string => {
  const diagramXML = `<?xml version="1.0" encoding="UTF-8"?>
  <bpmn2:definitions
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd"
    id="sample-diagram"
    targetNamespace="http://bpmn.io/schema/bpmn"
  >
    <bpmn2:process id="Process_1" isExecutable="false">
    </bpmn2:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
  </bpmn2:definitions>`;

  return diagramXML;
};

export const BPMN_PUBLIC_STATE = {
  /** 是否能创建图形 */
  IS_CREATE: true,
  /** 是否开启画布滚动 （鼠标滚轮滚动。与点按拖动是两个交互） */
  IS_ZOOM_SCROLL: true,
};
