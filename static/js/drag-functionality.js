// Chat Widget Drag and Drop Functionality

function initializeDragFunctionality() {
  const chatWidget = document.getElementById('chatWidget');
  const dragHandle = document.querySelector('.drag-handle');

  if (!dragHandle || !chatWidget) return;

  dragHandle.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);

  // Touch events for mobile
  dragHandle.addEventListener('touchstart', startDragTouch, { passive: false });
  document.addEventListener('touchmove', dragTouch, { passive: false });
  document.addEventListener('touchend', stopDrag);
}

function startDrag(e) {
  e.preventDefault();
  e.stopPropagation();

  const chatWidget = document.getElementById('chatWidget');
  const rect = chatWidget.getBoundingClientRect();

  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  chatStartX = rect.left;
  chatStartY = rect.top;

  chatWidget.classList.add('dragging');
  chatWidget.style.position = 'fixed';
  chatWidget.style.left = chatStartX + 'px';
  chatWidget.style.top = chatStartY + 'px';
  chatWidget.style.right = 'auto';
  chatWidget.style.bottom = 'auto';
}

function startDragTouch(e) {
  e.preventDefault();
  e.stopPropagation();

  const touch = e.touches[0];
  const chatWidget = document.getElementById('chatWidget');
  const rect = chatWidget.getBoundingClientRect();

  isDragging = true;
  dragStartX = touch.clientX;
  dragStartY = touch.clientY;
  chatStartX = rect.left;
  chatStartY = rect.top;

  chatWidget.classList.add('dragging');
  chatWidget.style.position = 'fixed';
  chatWidget.style.left = chatStartX + 'px';
  chatWidget.style.top = chatStartY + 'px';
  chatWidget.style.right = 'auto';
  chatWidget.style.bottom = 'auto';
}

function drag(e) {
  if (!isDragging) return;

  e.preventDefault();

  const chatWidget = document.getElementById('chatWidget');
  const deltaX = e.clientX - dragStartX;
  const deltaY = e.clientY - dragStartY;

  let newX = chatStartX + deltaX;
  let newY = chatStartY + deltaY;

  // Keep widget within viewport bounds
  const maxX = window.innerWidth - chatWidget.offsetWidth;
  const maxY = window.innerHeight - chatWidget.offsetHeight;

  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));

  chatWidget.style.left = newX + 'px';
  chatWidget.style.top = newY + 'px';
}

function dragTouch(e) {
  if (!isDragging) return;

  e.preventDefault();

  const touch = e.touches[0];
  const chatWidget = document.getElementById('chatWidget');
  const deltaX = touch.clientX - dragStartX;
  const deltaY = touch.clientY - dragStartY;

  let newX = chatStartX + deltaX;
  let newY = chatStartY + deltaY;

  // Keep widget within viewport bounds
  const maxX = window.innerWidth - chatWidget.offsetWidth;
  const maxY = window.innerHeight - chatWidget.offsetHeight;

  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));

  chatWidget.style.left = newX + 'px';
  chatWidget.style.top = newY + 'px';
}

function stopDrag() {
  if (!isDragging) return;

  isDragging = false;
  const chatWidget = document.getElementById('chatWidget');
  chatWidget.classList.remove('dragging');
}

function resetChatPosition() {
  const chatWidget = document.getElementById('chatWidget');
  chatWidget.style.position = 'fixed';
  chatWidget.style.right = '30px';
  chatWidget.style.bottom = '30px';
  chatWidget.style.left = 'auto';
  chatWidget.style.top = 'auto';
}