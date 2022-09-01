declare namespace FlowDiagramModuleScssNamespace {
  export interface IFlowDiagramModuleScss {
    "bpmn-container": string;
    canvas: string;
    palette: string;
  }
}

declare const FlowDiagramModuleScssModule: FlowDiagramModuleScssNamespace.IFlowDiagramModuleScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: FlowDiagramModuleScssNamespace.IFlowDiagramModuleScss;
};

export = FlowDiagramModuleScssModule;
