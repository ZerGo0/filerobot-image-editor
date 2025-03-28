/** External Dependencies */
import React from 'react';
import { Color as PC } from '@scaleflex/ui/utils/types/palette';
import PropTypes from 'prop-types';
import { Label } from '@scaleflex/ui/core';

/** Internal Dependencies */
import isFunction from 'utils/isFunction';
import {
  StyledSpinnerWrapper,
  StyledSpinner,
  StyledSpinnerCancelButton,
} from './Spinner.styled';

const Spinner = ({ loadingData, theme, t }) => {
  const { isLoadingGlobally, text, cancelFn } = loadingData;
  if (!isLoadingGlobally) {
    return null;
  }

  return (
    <StyledSpinnerWrapper
      data-testid="FIE-spinner-wrapper"
      className="FIE_spinner-wrapper"
    >
      <StyledSpinner
        data-testid="FIE-spinner"
        size={50}
        color={theme.palette[PC.AccentStateless]}
      />
      {text && <Label size="lg">{text}</Label>}
      {isFunction(cancelFn) && (
        <StyledSpinnerCancelButton onClick={cancelFn} size="md">
          {t('cancel')}
        </StyledSpinnerCancelButton>
      )}
    </StyledSpinnerWrapper>
  );
};

Spinner.propTypes = {
  loadingData: PropTypes.instanceOf(Object).isRequired,
  theme: PropTypes.instanceOf(Object).isRequired,
  t: PropTypes.func.isRequired,
};

export default Spinner;
