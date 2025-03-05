/** External Dependencies */
import { useCallback, useRef } from 'react';
import { SET_FEEDBACK, SET_ORIGINAL_SOURCE } from 'actions';
import { DEFAULT_ZOOM_FACTOR } from 'utils/constants';
import isSameSource from 'utils/isSameSource';
import loadImage from 'utils/loadImage';

/** Internal Dependencies */
import useDispatch from './useDispatch';
import useStore from './useStore';

const useSetOriginalSource = ({
  resetOnSourceChange,
  keepZoomOnSourceChange,
}) => {
  const dispatch = useDispatch();
  const imageBeingLoadedSrc = useRef(null);
  const { t, originalSource, config } = useStore();
  const { defaultSavedImageName, noCrossOrigin } = config;

  const setOriginalSource = useCallback(
    (newSource) => {
      dispatch({
        type: SET_ORIGINAL_SOURCE,
        payload: {
          originalSource: newSource,
          dismissHistory: newSource?.noHistoryRecord,
          keepPrevZoomRatio: keepZoomOnSourceChange,
          ...(!(resetOnSourceChange || keepZoomOnSourceChange) && {
            zoom: {
              factor: DEFAULT_ZOOM_FACTOR,
              x: null,
              y: null,
            },
          }),
        },
      });
    },
    [resetOnSourceChange, keepZoomOnSourceChange],
  );

  const setOriginalSourceIfDimensionsFound = (newSource) => {
    if (newSource?.width && newSource.height) {
      const newSourceClone = { ...newSource };
      delete newSourceClone.src;
      setOriginalSource(newSourceClone);
      return true;
    }

    return false;
  };

  const setError = useCallback((newError) => {
    dispatch({
      type: SET_FEEDBACK,
      payload: {
        feedback: {
          message: newError.message || newError,
          duration: 0,
        },
      },
    });
  }, []);

  // We are promisifying the image loading for mixing it with other promises
  const loadAndSetOriginalSource = (imgToLoad) =>
    new Promise((resolve) => {
      const imgSrc = imgToLoad?.src || imgToLoad;
      if (
        imageBeingLoadedSrc.current === imgSrc ||
        (!imgSrc && originalSource) ||
        isSameSource(imgSrc, originalSource)
      ) {
        if (!imageBeingLoadedSrc.current) {
          resolve();
        }
        return;
      }

      const triggerResolve = () => {
        imageBeingLoadedSrc.current = null;
        resolve();
      };

      imageBeingLoadedSrc.current = imgSrc;

      // This timeout is a workaround when re-initializing
      // the react app from vanilla JS. Due to a bug in react
      // the dispatch method that is called in setOriginalSource
      // still points to the old dispatch method after re-init,
      // so we need to wait for one tick to make sure it's updated.
      //
      // This applies to both URLs and HTMLImageElement, since URLs
      // may resolve immediately in some cases, e.g. memory cache.
      setTimeout(() => {
        if (imgToLoad instanceof HTMLImageElement) {
          if (!imgToLoad.name && defaultSavedImageName) {
            // eslint-disable-next-line no-param-reassign
            imgToLoad.name = defaultSavedImageName;
          }
          if (!imgToLoad.complete) {
            imgToLoad.addEventListener('load', () => {
              setOriginalSource(imgToLoad);
              triggerResolve();
            });
            return;
          }

          setOriginalSource(imgToLoad);
          triggerResolve();
        } else if (
          imgToLoad &&
          (typeof imgToLoad === 'string' || imgToLoad?.src)
        ) {
          loadImage(imgToLoad?.src || imgToLoad, {
            name: defaultSavedImageName,
            noCrossOrigin,
            width: imgToLoad?.width,
            height: imgToLoad?.height,
            key: imgToLoad?.key,
          })
            .then(setOriginalSource)
            .catch((err) => {
              if (!setOriginalSourceIfDimensionsFound(imgToLoad)) {
                setError(err);
              }
            })
            .finally(triggerResolve);
        } else if (setOriginalSourceIfDimensionsFound(imgToLoad)) {
          triggerResolve();
        } else {
          setError(t('invalidImageError'));
          triggerResolve();
        }
      }, 0);
    });

  return {
    loadAndSetOriginalSource,
    setOriginalSource,
    setOriginalSourceIfDimensionsFound,
  };
};

export default useSetOriginalSource;
