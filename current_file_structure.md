.github/
  └── ISSUE_TEMPLATE/
      ├── bug_report.md
      └── feature_request.md
bin/
  └── deploy-js-bundle-to-filerobot.js
packages/
  ├── filerobot-image-editor/
  │   ├── src/
  │   │   ├── index.d.ts
  │   │   └── index.js
  │   ├── LICENSE
  │   ├── README.md
  │   └── package.json
  └── react-filerobot-image-editor/
      ├── src/
      │   ├── actions/
      │   │   ├── addFilter.js
      │   │   ├── changePointerIcon.js
      │   │   ├── changeRotation.js
      │   │   ├── clearAnnotationsSelections.js
      │   │   ├── duplicateAnnotations.js
      │   │   ├── enableTextContentEdit.js
      │   │   ├── hideLoader.js
      │   │   ├── index.js
      │   │   ├── redo.js
      │   │   ├── removeAnnotations.js
      │   │   ├── reset.js
      │   │   ├── selectAnnotation.js
      │   │   ├── selectTab.js
      │   │   ├── selectTool.js
      │   │   ├── setAnnotation.js
      │   │   ├── setCanvasSize.js
      │   │   ├── setCrop.js
      │   │   ├── setFeedback.js
      │   │   ├── setFinetune.js
      │   │   ├── setLatestColor.js
      │   │   ├── setOriginalImage.js
      │   │   ├── setResize.js
      │   │   ├── setSaved.js
      │   │   ├── setSaving.js
      │   │   ├── setShowTabsMenu.js
      │   │   ├── setShownImageDimensions.js
      │   │   ├── showLoader.js
      │   │   ├── toggleFlip.js
      │   │   ├── toggleOriginalImageDisplay.js
      │   │   ├── undo.js
      │   │   ├── updateState.js
      │   │   └── zoomCanvas.js
      │   ├── components/
      │   │   ├── App/
      │   │   │   ├── App.styled.js
      │   │   │   └── index.jsx
      │   │   ├── AssemblyPoint/
      │   │   │   ├── globalStyles.js
      │   │   │   └── index.jsx
      │   │   ├── FeedbackPopup/
      │   │   │   └── index.jsx
      │   │   ├── Layers/
      │   │   │   ├── DesignLayer/
      │   │   │   │   ├── AnnotationNodes/
      │   │   │   │   │   ├── AnnotationNodes.constants.js
      │   │   │   │   │   ├── ArrowNode.jsx
      │   │   │   │   │   ├── BlurAnnotationNode.jsx
      │   │   │   │   │   ├── EllipseNode.jsx
      │   │   │   │   │   ├── ImageNode.jsx
      │   │   │   │   │   ├── LineNode.jsx
      │   │   │   │   │   ├── MemoizedAnnotation.jsx
      │   │   │   │   │   ├── PolygonNode.jsx
      │   │   │   │   │   ├── RectNode.jsx
      │   │   │   │   │   ├── TextNode.jsx
      │   │   │   │   │   └── index.jsx
      │   │   │   │   ├── PreviewGroup.jsx
      │   │   │   │   ├── index.jsx
      │   │   │   │   └── nodesCommonPropTypes.js
      │   │   │   ├── TransformersLayer/
      │   │   │   │   ├── CropTransformer.jsx
      │   │   │   │   ├── NodesTransformer.jsx
      │   │   │   │   ├── TransformersLayer.utils.js
      │   │   │   │   └── index.jsx
      │   │   │   └── index.js
      │   │   ├── MainCanvas/
      │   │   │   ├── CanvasNode.jsx
      │   │   │   ├── MainCanvas.styled.js
      │   │   │   ├── index.jsx
      │   │   │   └── touchZoomingEvents.js
      │   │   ├── NodeControls/
      │   │   │   ├── NodeControls.styled.js
      │   │   │   └── index.jsx
      │   │   ├── Tabs/
      │   │   │   ├── TabItem.jsx
      │   │   │   ├── Tabs.constants.js
      │   │   │   ├── Tabs.styled.js
      │   │   │   └── index.jsx
      │   │   ├── TabsDrawer/
      │   │   │   └── index.jsx
      │   │   ├── ToolsBar/
      │   │   │   ├── ToolsBar.styled.js
      │   │   │   ├── ToolsBarItemButton.jsx
      │   │   │   ├── ToolsBarItemOptionsWrapper.jsx
      │   │   │   └── index.jsx
      │   │   ├── Topbar/
      │   │   │   ├── BackButton.jsx
      │   │   │   ├── CanvasZooming.jsx
      │   │   │   ├── CloseButton.jsx
      │   │   │   ├── ConfirmationModal.jsx
      │   │   │   ├── ImageDimensionsAndDisplayToggle.jsx
      │   │   │   ├── RedoButton.jsx
      │   │   │   ├── ResetButton.jsx
      │   │   │   ├── SaveButton.jsx
      │   │   │   ├── Topbar.constants.js
      │   │   │   ├── Topbar.styled.js
      │   │   │   ├── UndoButton.jsx
      │   │   │   └── index.jsx
      │   │   ├── common/
      │   │   │   ├── AnnotationOptions/
      │   │   │   │   ├── AnnotationOptions.constants.js
      │   │   │   │   ├── AnnotationOptions.styled.js
      │   │   │   │   ├── OpacityField.jsx
      │   │   │   │   ├── PositionFields.jsx
      │   │   │   │   ├── ShadowFields.jsx
      │   │   │   │   ├── StrokeFields.jsx
      │   │   │   │   └── index.jsx
      │   │   │   ├── ButtonWithMenu/
      │   │   │   │   ├── ButtonWithMenu.styled.js
      │   │   │   │   └── index.jsx
      │   │   │   ├── Carousel/
      │   │   │   │   ├── Carousel.styled.js
      │   │   │   │   └── index.jsx
      │   │   │   ├── ColorInput/
      │   │   │   │   ├── ColorInput.styled.js
      │   │   │   │   └── index.jsx
      │   │   │   ├── ColorPickerModal/
      │   │   │   │   ├── ColorPickerModal.styled.js
      │   │   │   │   └── index.jsx
      │   │   │   ├── HiddenUploadInput/
      │   │   │   │   ├── HiddenUploadInput.styled.js
      │   │   │   │   └── index.jsx
      │   │   │   ├── Modal/
      │   │   │   │   ├── Modal.styled.js
      │   │   │   │   └── index.jsx
      │   │   │   ├── Separator/
      │   │   │   │   ├── Separator.styled.js
      │   │   │   │   └── index.jsx
      │   │   │   ├── Slider/
      │   │   │   │   ├── Slider.styled.js
      │   │   │   │   └── index.jsx
      │   │   │   └── Spinner/
      │   │   │       ├── Spinner.styled.js
      │   │   │       └── index.jsx
      │   │   └── tools/
      │   │       ├── Arrow/
      │   │       │   ├── ArrowButton.jsx
      │   │       │   ├── ArrowOptions.jsx
      │   │       │   └── index.js
      │   │       ├── Blur/
      │   │       │   ├── Blur.jsx
      │   │       │   ├── BlurOptions.jsx
      │   │       │   └── index.js
      │   │       ├── BlurAnnotation/
      │   │       │   ├── BlurAnnotation.constants.js
      │   │       │   ├── BlurAnnotationButton.jsx
      │   │       │   ├── BlurAnnotationOptions.jsx
      │   │       │   └── index.js
      │   │       ├── Brightness/
      │   │       │   ├── Brightness.jsx
      │   │       │   ├── BrightnessOptions.jsx
      │   │       │   └── index.js
      │   │       ├── Contrast/
      │   │       │   ├── Contrast.jsx
      │   │       │   ├── ContrastOptions.jsx
      │   │       │   └── index.js
      │   │       ├── Crop/
      │   │       │   ├── Crop.constants.js
      │   │       │   ├── Crop.jsx
      │   │       │   ├── Crop.styled.js
      │   │       │   ├── CropPresetGroup.jsx
      │   │       │   ├── CropPresetGroupsFolder.jsx
      │   │       │   ├── CropPresetItem.jsx
      │   │       │   ├── CropPresetsOption.jsx
      │   │       │   └── index.js
      │   │       ├── Ellipse/
      │   │       │   ├── EllipseButton.jsx
      │   │       │   ├── EllipseOptions.jsx
      │   │       │   └── index.js
      │   │       ├── Filters/
      │   │       │   ├── FilterItem.jsx
      │   │       │   ├── Filters.constants.js
      │   │       │   ├── Filters.jsx
      │   │       │   ├── Filters.styled.js
      │   │       │   └── index.js
      │   │       ├── Flip/
      │   │       │   ├── FlipX.jsx
      │   │       │   ├── FlipY.jsx
      │   │       │   └── index.js
      │   │       ├── HSV/
      │   │       │   ├── HSV.jsx
      │   │       │   ├── HSVOptions.jsx
      │   │       │   └── index.js
      │   │       ├── Image/
      │   │       │   ├── Image.styled.js
      │   │       │   ├── ImageButton.jsx
      │   │       │   ├── ImageControls.jsx
      │   │       │   ├── ImageOptions.jsx
      │   │       │   ├── ImagesGallery.jsx
      │   │       │   └── index.js
      │   │       ├── Line/
      │   │       │   ├── LineButton.jsx
      │   │       │   ├── LineOptions.jsx
      │   │       │   └── index.js
      │   │       ├── Pen/
      │   │       │   ├── PenButton.jsx
      │   │       │   ├── PenOptions.jsx
      │   │       │   └── index.js
      │   │       ├── Polygon/
      │   │       │   ├── Polygon.constants.js
      │   │       │   ├── PolygonButton.jsx
      │   │       │   ├── PolygonOptions.jsx
      │   │       │   ├── PolygonSidesField.jsx
      │   │       │   └── index.js
      │   │       ├── Rect/
      │   │       │   ├── Rect.constants.js
      │   │       │   ├── RectButton.jsx
      │   │       │   ├── RectCornerField.jsx
      │   │       │   ├── RectOptions.jsx
      │   │       │   └── index.js
      │   │       ├── Resize/
      │   │       │   ├── Resize.jsx
      │   │       │   ├── Resize.styled.js
      │   │       │   └── index.js
      │   │       ├── Rotate/
      │   │       │   ├── Rotate.styled.js
      │   │       │   ├── RotateButton.jsx
      │   │       │   ├── RotateOptions.jsx
      │   │       │   └── index.js
      │   │       ├── Text/
      │   │       │   ├── TextOptions/
      │   │       │   │   ├── TextAlignmentFields.jsx
      │   │       │   │   ├── TextControls.jsx
      │   │       │   │   ├── TextOptions.constants.js
      │   │       │   │   ├── TextOptions.styled.js
      │   │       │   │   ├── TextSpacingsFields.jsx
      │   │       │   │   ├── handleTextChangeArea.js
      │   │       │   │   └── index.jsx
      │   │       │   ├── TextButton.jsx
      │   │       │   └── index.js
      │   │       ├── Warmth/
      │   │       │   ├── Warmth.jsx
      │   │       │   ├── WarmthOptions.jsx
      │   │       │   └── index.js
      │   │       ├── Watermark/
      │   │       │   ├── Watermark.jsx
      │   │       │   ├── Watermark.styled.js
      │   │       │   ├── WatermarkPadding.jsx
      │   │       │   ├── WatermarksGallery.jsx
      │   │       │   └── index.jsx
      │   │       ├── tools.constants.js
      │   │       └── tools.styled.js
      │   ├── context/
      │   │   ├── AppContext.js
      │   │   ├── AppProvider.jsx
      │   │   ├── AppProviderOverridenValue.jsx
      │   │   ├── appReducer.js
      │   │   ├── defaultConfig.js
      │   │   ├── defaultTranslations.js
      │   │   ├── getInitialAppState.js
      │   │   └── index.js
      │   ├── custom/
      │   │   ├── filters/
      │   │   │   ├── Aden.js
      │   │   │   ├── Amaro.js
      │   │   │   ├── Ashby.js
      │   │   │   ├── BaseFilters.js
      │   │   │   ├── BlackAndWhite.js
      │   │   │   ├── Brannan.js
      │   │   │   ├── Brooklyn.js
      │   │   │   ├── Charmes.js
      │   │   │   ├── Clarendon.js
      │   │   │   ├── Crema.js
      │   │   │   ├── Dogpatch.js
      │   │   │   ├── Earlybird.js
      │   │   │   ├── Gingham.js
      │   │   │   ├── Ginza.js
      │   │   │   ├── Hefe.js
      │   │   │   ├── Helena.js
      │   │   │   ├── Hudson.js
      │   │   │   ├── Juno.js
      │   │   │   ├── Kelvin.js
      │   │   │   ├── Lark.js
      │   │   │   ├── LoFi.js
      │   │   │   ├── Ludwig.js
      │   │   │   ├── Maven.js
      │   │   │   ├── Mayfair.js
      │   │   │   ├── Moon.js
      │   │   │   ├── Nashville.js
      │   │   │   ├── NinteenSeventySeven.js
      │   │   │   ├── Perpetua.js
      │   │   │   ├── Reyes.js
      │   │   │   ├── Rise.js
      │   │   │   ├── Sierra.js
      │   │   │   ├── Skyline.js
      │   │   │   ├── Slumber.js
      │   │   │   ├── Stinson.js
      │   │   │   ├── Sutro.js
      │   │   │   ├── Toaster.js
      │   │   │   ├── Valencia.js
      │   │   │   ├── Vesper.js
      │   │   │   ├── Walden.js
      │   │   │   ├── Willow.js
      │   │   │   ├── XPro2.js
      │   │   │   └── index.js
      │   │   └── finetunes/
      │   │       ├── CustomThreshold.js
      │   │       ├── Warmth.js
      │   │       └── index.js
      │   ├── hooks/
      │   │   ├── useAnnotation/
      │   │   │   ├── getBoundingRectUnScaled.js
      │   │   │   ├── getNewAnnotationPreview.js
      │   │   │   ├── index.js
      │   │   │   └── previewThenCallAnnotationAdding.js
      │   │   ├── index.js
      │   │   ├── useAnnotationEvents.js
      │   │   ├── useAppReducer.js
      │   │   ├── useDebouncedCallback.js
      │   │   ├── useDrag.js
      │   │   ├── useFilter.js
      │   │   ├── useFinetune.js
      │   │   ├── usePhoneScreen.js
      │   │   ├── useResizeObserver.js
      │   │   ├── useStore.js
      │   │   ├── useTransformedImgData.js
      │   │   └── useUpdateEffect.js
      │   ├── utils/
      │   │   ├── assignFinetuneNamesToKonva.js
      │   │   ├── calculateZoomData.js
      │   │   ├── cloudimageQueryToDesignState.js
      │   │   ├── compareRatios.js
      │   │   ├── constants.js
      │   │   ├── cropImage.js
      │   │   ├── debounce.js
      │   │   ├── deepMerge.js
      │   │   ├── extractCurrentDesignState.js
      │   │   ├── extractNameFromUrl.js
      │   │   ├── filterStrToClass.js
      │   │   ├── finetunesStrsToClasses.js
      │   │   ├── getCenterRotatedPoint.js
      │   │   ├── getDefaultSaveQuality.js
      │   │   ├── getDimensionsMinimalRatio.js
      │   │   ├── getElemDocumentCoords.js
      │   │   ├── getFileFullName.js
      │   │   ├── getImageSealingParams.js
      │   │   ├── getPointerOffsetPositionBoundedToObject.js
      │   │   ├── getProperDimensions.js
      │   │   ├── getProperImageToCanvasSpacing.js
      │   │   ├── getScrollOffset.js
      │   │   ├── getSizeAfterRotation.js
      │   │   ├── getZoomFitFactor.js
      │   │   ├── imageToBase64.js
      │   │   ├── isDefaultZeroValuesOnly.js
      │   │   ├── isSameImage.js
      │   │   ├── loadImage.js
      │   │   ├── mapCropBox.js
      │   │   ├── mapNumber.js
      │   │   ├── mapPositionStringToPoint.js
      │   │   ├── operationsToCloudimageUrl.js
      │   │   ├── randomId.js
      │   │   ├── restrictNumber.js
      │   │   ├── rgbaToHexa.js
      │   │   ├── sha1.js
      │   │   ├── toPrecisedFloat.js
      │   │   └── translator.js
      │   ├── index.d.ts
      │   └── index.js
      ├── LICENSE
      ├── README.md
      └── package.json
public/
  ├── assets/
  │   ├── Ellipse 3.png
  │   ├── Hollow-Ellipse 3.png
  │   ├── add-annotation.svg
  │   ├── adding-icon.png
  │   ├── arrow-icon.png
  │   ├── arrow.png
  │   ├── check-icon.png
  │   ├── copy-icon.png
  │   ├── down-arrow-icon.png
  │   ├── git-stars.svg
  │   ├── github-logo.svg
  │   ├── half-circle.png
  │   ├── image-resize-mode.svg
  │   ├── loading.svg
  │   ├── scaleflex-logo.svg
  │   └── watermark-img.svg
  ├── demo-config.js
  ├── init.js
  └── style.css
.editorconfig
.env.example
.eslintrc.js
.gitignore
.prettierrc
CHANGELOG.md
DEVELOPMENT.md
LICENSE
README.md
babel.config.json
index.html
jsconfig.json
lerna.json
package.json
vite.config.js
yarn.lock
