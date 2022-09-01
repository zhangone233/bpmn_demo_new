// @ts-nocheck no check
import React, { FC, memo, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from './FlowDiagram.module.scss';
import { getDefaultXml } from './custom/common/constants';

import './custom/css/bpmn.css'; // 自定义的流程元素全局样式
import 'bpmn-js/dist/assets/diagram-js.css'; // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'highlight.js/styles/atom-one-dark-reasonable.css';

import BpmnAutoPlace from 'bpmn-js/lib/features/auto-place';

// import ArrangePanel from '../ArrangePanel/ArrangePanel';
import {
  Modeler,
  CustomPalette,
  CustomRenderer,
  paletteEntries,
  CustomContextPad,
  getPaletteEntries,
  customPaletteElement
} from './custom';

interface IFlowDiagramProps {
  projectInfo: ProjectInfo;
  materialDetails: VideoInfoItem[];
}

const FlowDiagram: FC<IFlowDiagramProps> = ({ projectInfo, materialDetails }, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const [bpmnModeler, setBpmnModeler] = useState();

  const initBpmnModeler = async () => {
    const paletteEntries = getPaletteEntries(materialDetails); // 根据props传入的数据，生成工具栏配置
    console.dir(Modeler, 'Modeler'); // dir: 详细输出内容

    const bpmnModeler = new Modeler({
      paletteEntries,
      container: canvasRef.current,
      paletteContainer: paletteRef.current,
      additionalModules: [CustomPalette, CustomRenderer, CustomContextPad, BpmnAutoPlace],
    });

    const RES = await bpmnModeler.importXML(getDefaultXml());

    // 画布视图调整在正中间
    bpmnModeler.get('canvas').zoom('fit-viewport', 'auto');

    customPaletteElement();
    setBpmnModeler(bpmnModeler);
    bpmnModelerAddEventListener(bpmnModeler);
  };

  const bpmnModelerAddEventListener = bpmnModeler => {
    // const eventBus = bpmnModeler.get('eventBus');
    // eventBus.on('shape.removed', e => {
    //   console.log(e, '删除时间');
    // });
  };

  /** 
   * 监听props数据变化，重置 BpmnModeler画布，生成新的工具栏。
   * todo: 可保留上次画布数据。但需注意不可保留的元素
   */
  useEffect(() => {
    initBpmnModeler();

    return () => {
      setBpmnModeler(undefined);
      canvasRef.current?.innerHTML = '';
    };
  }, [materialDetails]);

  useImperativeHandle(
    ref,
    () => ({
      bpmnModeler,
    }),
    [bpmnModeler]
  );

  return (
    <div className={styles['bpmn-container']}>
      <div ref={paletteRef} className={styles.palette} />
      <div ref={canvasRef} className={styles.canvas} />
      {/* <ArrangePanel bpmnModeler={bpmnModeler} projectInfo={projectInfo} materialDetails={materialDetails} /> */}
    </div>
  );
};

export default memo(forwardRef(FlowDiagram));
