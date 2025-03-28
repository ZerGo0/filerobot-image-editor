/** External Dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { Remove as ObjectRemovalIcon } from '@scaleflex/icons/remove';

/** Internal Dependencies */
import ToolsBarItemButton from 'components/ToolsBar/ToolsBarItemButton';
import { TOOLS_IDS } from 'utils/constants';

const ObjectRemovalButton = ({ selectTool, isSelected = false, t }) => (
  <ToolsBarItemButton
    className="FIE_object-removal-tool-button"
    id={TOOLS_IDS.OBJECT_REMOVAL}
    label={t('objectRemovalTool')}
    Icon={ObjectRemovalIcon}
    onClick={selectTool}
    isSelected={isSelected}
  />
);

ObjectRemovalButton.propTypes = {
  selectTool: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

export default ObjectRemovalButton;
