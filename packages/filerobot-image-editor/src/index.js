/** External Dependencies */
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

/** Internal Dependencies */
import AssemblyPoint, { TOOLS, TABS } from 'react-filerobot-image-editor/src/';
import deepMerge from 'react-filerobot-image-editor/src/utils/deepMerge';

class FilerobotImageEditor {
  static TABS = TABS;
  static TOOLS = TOOLS;
  #root;
  #getCurrentImgDataFnRef;
  #updateStateFnRef;
  #rootInitialized;

  constructor(container, config = {}) {
    this.container = container;
    this.config = config;

    if (!container || !(container instanceof HTMLElement)) {
      throw new Error(
        '`container` (argument 0) is required to initialize the image editor plugin.',
      );
    }

    this.#rootInitialized = false;
    this.#root = createRoot(this.container);
    this.#rootInitialized = true;
    this.#getCurrentImgDataFnRef = {};
    this.#updateStateFnRef = {};

    this.getCurrentImgData = this.getCurrentImgData.bind(this);
    this.render = this.render.bind(this);
    this.terminate = this.terminate.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  render(additionalConfig) {
    if (typeof additionalConfig === 'object') {
      this.config = this.config = deepMerge(
        this.config || {},
        additionalConfig,
      );
    }

    this.config = {
      ...this.config,
      getCurrentImgDataFnRef: this.#getCurrentImgDataFnRef,
      updateStateFnRef: this.#updateStateFnRef,
    };

    if (!this.#rootInitialized) {
      this.#root = createRoot(this.container);
      this.#rootInitialized = true;
    }

    this.#root.render(createElement(AssemblyPoint, this.config));
  }

  terminate() {
    this.#root.unmount();
    this.#rootInitialized = false;
  }

  getCurrentImgData(imageFileInfo, pixelRatio, keepLoadingSpinnerShown) {
    return (
      this.#getCurrentImgDataFnRef?.current?.(
        imageFileInfo,
        pixelRatio,
        keepLoadingSpinnerShown,
      ) || {}
    );
  }

  updateState(newStatePart) {
    this.#updateStateFnRef?.current?.(newStatePart);
  }
}

FilerobotImageEditor.TABS = TABS;
FilerobotImageEditor.TOOLS = TOOLS;

export default FilerobotImageEditor;
