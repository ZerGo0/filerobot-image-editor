/** External Dependencies */
import PropTypes from 'prop-types';

/** Internal Dependencies */
import AnnotationOptions from 'components/common/AnnotationOptions';
import Slider from 'components/common/Slider';
import { useAnnotation } from 'hooks';
import { TOOLS_IDS } from 'utils/constants';
import restrictNumber from 'utils/restrictNumber';
import {
  StyledSliderContainer,
  StyledSliderInput,
  StyledSliderLabel,
  StyledSliderWrapper,
} from '../tools.styled';
import {
  BLUR_ANNOTATION_POPPABLE_OPTIONS,
  blurAnnotationOptionsPopupComponents,
} from './BlurAnnotation.constants';

const MIN_VALUE = 0;
const MAX_VALUE = 100;
const DEFAULT_VALUE = 50;

const BlurAnnotationOptions = ({ t }) => {
  const [blurAnnotation, saveBlurAnnotation] = useAnnotation({
    name: TOOLS_IDS.BLUR_ANNOTATION,
    defaultAnnotationProps: { blurRadius: DEFAULT_VALUE },
  });

  const updateBlurRadius = (value) => {
    const sanitizedValue = restrictNumber(value, MIN_VALUE, MAX_VALUE);
    saveBlurAnnotation({
      blurRadius: sanitizedValue,
      name: TOOLS_IDS.BLUR_ANNOTATION,
    });
  };

  return (
    <AnnotationOptions
      className="FIE_blur-annotation-tool-options"
      moreOptionsPopupComponentsObj={blurAnnotationOptionsPopupComponents}
      morePoppableOptionsPrepended={BLUR_ANNOTATION_POPPABLE_OPTIONS}
      annotation={blurAnnotation}
      updateAnnotation={(updates) =>
        saveBlurAnnotation({
          ...updates,
          name: TOOLS_IDS.BLUR_ANNOTATION,
        })
      }
      t={t}
      overrideOptions={[]}
    >
      <StyledSliderContainer className="FIE_blur-annotation-radius-wrapper">
        <StyledSliderLabel className="FIE_blur-annotation-radius-label">
          {t('blurRadius')}
        </StyledSliderLabel>
        <StyledSliderWrapper>
          <Slider
            className="FIE_blur-annotation-radius"
            min={MIN_VALUE}
            max={MAX_VALUE}
            width="124px"
            value={blurAnnotation?.blurRadius ?? DEFAULT_VALUE}
            onChange={updateBlurRadius}
          />
          <StyledSliderInput
            value={blurAnnotation?.blurRadius ?? DEFAULT_VALUE}
            onChange={({ target: { value } }) => updateBlurRadius(value)}
          />
        </StyledSliderWrapper>
      </StyledSliderContainer>
    </AnnotationOptions>
  );
};

BlurAnnotationOptions.propTypes = {
  t: PropTypes.func.isRequired,
};

export default BlurAnnotationOptions;
