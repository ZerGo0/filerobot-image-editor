// Main component with the rich canvas contains all the features.
export { default } from 'components/AssemblyPoint';

/** State management & UI controls exports */
// The main provider for the whole library's context so this has to be the top level provider for any of the library's code/usage.
export { default as FilerobotImageEditorProvider } from 'components/AssemblyPoint/Providers';

// The main App component that contains the whole library's UI & logic.
export { default as App } from 'components/App';

// The tabs drawer that contains the tabs.
export { default as Tabs } from 'components/Tabs';

// The topbar that contains the zooming & close buttons and the image info.
export { default as Topbar } from 'components/Topbar';

// The toolsbar that contains the tools available.
export { default as Toolsbar } from 'components/ToolsBar';

/** Canvas & layers exports */

// The canvas contains all the design layer and its annotations & transformers, no need to add children for it if used.
export { default as RichCanvas } from 'components/MainCanvas';

// Only the canvas wrapper component that should contain the design layer/transformers layer/any other custom layer.
export { default as CanvasWrapper } from 'components/MainCanvas/MainCanvasWrapper';

// The ready to use design layer contains all the annotations, preview and the original image background.
export { default as DesignLayer } from 'components/Layers/DesignLayer';

// The design layer wrapper only that should contain all the annotations, the original image background and preview (eg. transparent bg) background
// But left for your customization through the children.
export { default as DesignLayerWrapper } from 'components/Layers/DesignLayer/DesignLayerWrapper';

// All the annotations nodes that are rendered on the design layer.
export { default as DesignLayerAnnotations } from 'components/Layers/DesignLayer/AnnotationNodes';

// The group used in previewing the annotation while dragging/annotating with the mouse.
export { default as DesignLayerPreviewGroup } from 'components/Layers/DesignLayer/PreviewGroup';

// Ellipse annotation node.
export { default as DesignLayerEllipseNode } from 'components/Layers/DesignLayer/AnnotationNodes/EllipseNode';

// Rect annotation node.
export { default as DesignLayerRectNode } from 'components/Layers/DesignLayer/AnnotationNodes/RectNode';

// Polygon annotation node.
export { default as DesignLayerPolygonNode } from 'components/Layers/DesignLayer/AnnotationNodes/PolygonNode';

// Text annotation node.
export { default as DesignLayerTextNode } from 'components/Layers/DesignLayer/AnnotationNodes/TextNode';

// Image annotation node.
export { default as DesignLayerImageNode } from 'components/Layers/DesignLayer/AnnotationNodes/ImageNode';

// Line annotation node.
export { default as DesignLayerLineNode } from 'components/Layers/DesignLayer/AnnotationNodes/LineNode';

// Arrow annotation node.
export { default as DesignLayerArrowNode } from 'components/Layers/DesignLayer/AnnotationNodes/ArrowNode';

// Transformers layer that contains all the transformers (crop, node transformer (eg. resize/rotate)) doesn't need any children.
export { default as TransformersLayer } from 'components/Layers/TransformersLayer';

// Transformers layer wrapper only, so you could customize its children/transformers based on ur needs.
export { default as TransformersLayerWrapper } from 'components/Layers/TransformersLayer/TransformersLayerWrapper';

// The Nodes transformer only for (resizing, rotating...etc) the annotation/node.
export { default as NodesTransformer } from 'components/Layers/TransformersLayer/NodesTransformer';

// The Crop transformer only for cropping the original image.
export { default as CropTransformer } from 'components/Layers/TransformersLayer/CropTransformer';

/** UI Info/data exports */

// The image info shown (width x height)...etc.
export { default as ImageInfo } from 'components/ImageInfo';

/** Constants/utilities/abstraction/miscellaneous/Other-UI exports */

export { TABS_IDS as TABS, TOOLS_IDS as TOOLS } from 'utils/constants';

export { ANNOTATION_NAMES_TO_COMPONENT as ANNOTATION_NAMES_TO_NODES } from 'components/Layers/DesignLayer/AnnotationNodes/AnnotationNodes.constants';

export { default as emitCustomEvent } from 'utils/emitCustomEvent';

export * from 'components/common';

export * from 'components/Tabs';

export * from 'components/buttons';

export * from 'utils/constants';

export * from 'hooks';
