/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { Blur as BlurIcon } from '@scaleflex/icons/blur';

/** Internal Dependencies */
import ToolsBarItemButton from 'components/ToolsBar/ToolsBarItemButton';
import { TOOLS_IDS } from 'utils/constants';

const BlurAnnotationButton = ({ selectTool, isSelected, t }) => (
  <ToolsBarItemButton
    className="FIE_blur-annotation-tool-button"
    id={TOOLS_IDS.BLUR_ANNOTATION}
    label={t('blurTool')}
    Icon={BlurIcon}
    onClick={selectTool}
    isSelected={isSelected}
  />
);

BlurAnnotationButton.defaultProps = {
  isSelected: false,
};

BlurAnnotationButton.propTypes = {
  selectTool: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

export default BlurAnnotationButton;