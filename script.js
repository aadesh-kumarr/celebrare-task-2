let activeBox = null;
let dragOffset = { x: 0, y: 0 };

function addBox(container) {
  const textBox = document.createElement('div');
  const textId = `text-box-${Date.now()}`;
  textBox.id = textId;
  textBox.contentEditable = true;
  textBox.className = 'text-box';
  textBox.style.position = 'absolute';
  textBox.style.top = '50px';
  textBox.style.left = '50px';
  textBox.style.fontFamily = 'Arial';
  textBox.style.fontSize = '16px';
  textBox.style.border = '1px solid #ccc';
  textBox.style.padding = '5px';

  textBox.addEventListener('click', () => setActiveBox(textId));
  textBox.addEventListener('mousedown', dragStart);

  container.appendChild(textBox);
  setActiveBox(textId);
}

function setActiveBox(id) {
  if (activeBox) {
    document.getElementById(activeBox.id).style.border = '1px solid #ccc';
  }
  activeBox = {
    id: id,
    element: document.getElementById(id),
    fontSize: parseInt(document.getElementById(id).style.fontSize, 10),
  };
  activeBox.element.style.border = '2px solid blue';
}

function dragStart(e) {
  const rect = activeBox.element.getBoundingClientRect();
  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;

  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
}

function dragMove(e) {
  if (!activeBox) return;

  const canvasRect = activeBox.element.parentElement.getBoundingClientRect();
  let newX = e.clientX - dragOffset.x;
  let newY = e.clientY - dragOffset.y;

  newX = Math.max(canvasRect.left, Math.min(canvasRect.right - activeBox.element.offsetWidth, newX));
  newY = Math.max(canvasRect.top, Math.min(canvasRect.bottom - activeBox.element.offsetHeight, newY));

  activeBox.element.style.left = `${newX - canvasRect.left}px`;
  activeBox.element.style.top = `${newY - canvasRect.top}px`;
}

function dragEnd() {
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', dragEnd);
}

function updateTextBox(updates) {
  if (!activeBox) return;
  const { element } = activeBox;
  if (updates.fontFamily) element.style.fontFamily = updates.fontFamily;
  if (updates.fontSize) element.style.fontSize = `${updates.fontSize}px`;
}

function toggleStyle(style) {
  if (!activeBox) return;

  const currentStyle = activeBox.element.style[style];
  if (style === 'fontWeight') {
    activeBox.element.style.fontWeight = currentStyle === 'bold' ? 'normal' : 'bold';
  } else if (style === 'fontStyle') {
    activeBox.element.style.fontStyle = currentStyle === 'italic' ? 'normal' : 'italic';
  } else if (style === 'textDecoration') {
    activeBox.element.style.textDecoration = currentStyle === 'underline' ? 'none' : 'underline';
  }
}

// Dynamic Slide Creation
const images = ['p1.jpg', 'p2.jpg', 'p3.jpg'];
const swiperWrapper = document.getElementById('swiper-wrapper');

images.forEach((src) => {
  const slide = document.createElement('div');
  slide.className = 'swiper-slide';
  slide.innerHTML = `
    <div class="container">
      <h1>celebrere</h1>
      <div class="img-cont" id="img-cont-${src}">
        <img src="${src}" alt="Image">
      </div>
      <footer>
      <div>
        <select class="buttons" onchange="updateTextBox({ fontFamily: this.value })">
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
        </select>
        <input
          type="number"
          class="buttons"
          min="8"
          max="72"
          value="16"
          onchange="updateTextBox({ fontSize: parseInt(this.value, 10) })"
        />
        <button class="buttons" onclick="toggleStyle('fontWeight')"><b>B</b></button>
        <button class="buttons" onclick="toggleStyle('fontStyle')"><i>I</i></button>
        <button class="buttons" onclick="toggleStyle('textDecoration')"><u>U</u></button>
        </div>
        <button class="buttons" onclick="addBox(document.getElementById('img-cont-${src}'))">+ Add text box</button>
      </footer>
    </div>
  `;
  swiperWrapper.appendChild(slide);
});

// Initialize Swiper
const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});
