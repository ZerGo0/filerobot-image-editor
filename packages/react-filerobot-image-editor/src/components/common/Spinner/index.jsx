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
import { ConfirmationModal } from '../ConfirmationModals';

const Spinner = ({ loadingData, theme, t }) => {
  const {
    isLoadingGlobally,
    text,
    cancelFn,
    useCancelConfirmationModal,
    confirmationTitle,
    confirmationHint,
  } = loadingData;
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
      {isFunction(cancelFn) &&
        (useCancelConfirmationModal ? (
          <ConfirmationModal
            title={confirmationTitle}
            hint={confirmationHint}
            onConfirm={cancelFn}
          >
            <StyledSpinnerCancelButton
              onClick={cancelFn}
              size="md"
              data-testid="FIE-spinner-cancel-button"
            >
              {t('cancel')}
            </StyledSpinnerCancelButton>
          </ConfirmationModal>
        ) : (
          <StyledSpinnerCancelButton
            onClick={cancelFn}
            size="md"
            data-testid="FIE-spinner-cancel-button"
          >
            {t('cancel')}
          </StyledSpinnerCancelButton>
        ))}
    </StyledSpinnerWrapper>
  );
};

Spinner.propTypes = {
  loadingData: PropTypes.instanceOf(Object).isRequired,
  theme: PropTypes.instanceOf(Object).isRequired,
  t: PropTypes.func.isRequired,
};

export default Spinner;
