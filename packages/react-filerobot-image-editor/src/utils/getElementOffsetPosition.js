const getElementOffsetPosition = (event, element) => {
  const targetEvent = event.evt || event;
  let offsetX;
  let offsetY;

  if (targetEvent.type.includes('touch')) {
    // For touch events, calculate offsetX and offsetY manually
    const touch = targetEvent.touches[0] || targetEvent.changedTouches[0];
    const rect = element.getBoundingClientRect();

    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;
  } else {
    // For mouse events, use offsetX and offsetY directly
    offsetX = targetEvent.offsetX;
    offsetY = targetEvent.offsetY;
  }

  return { offsetX, offsetY };
};

export default getElementOffsetPosition;
