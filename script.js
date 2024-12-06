let activeBox = null;
let dragOffset = { x: 0, y: 0 };

// Add the box to the container and attach necessary event listeners
function addBox(container, defaultText = "new box") {
  const textBox = document.createElement('div');
  const textId = `text-box-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  textBox.id = textId;
  textBox.contentEditable = true;
  textBox.innerText = defaultText;
  textBox.className = 'text-box';
  textBox.style.position = 'absolute';
  textBox.style.backgroundColor = 'rgba(255,255,255,0.3)';
  textBox.style.top = '50px';
  textBox.style.left = '50px';
  textBox.style.fontFamily = 'Arial';
  textBox.style.fontSize = '16px';
  textBox.style.border = '1px solid #ccc';
  textBox.style.padding = '5px';
  textBox.style.maxWidth = '300px';
  textBox.style.maxHeight = '200px';
  textBox.style.wordWrap = 'break-word';
  textBox.style.whiteSpace = 'normal';
  textBox.style.overflow = 'auto';
  textBox.addEventListener('click', () => setActiveBox(textId));
  textBox.addEventListener('mousedown', dragStart);

  container.appendChild(textBox);
  setActiveBox(textId);
}

// Toggle the style of the active text box
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

  // After toggling, update the button styles to reflect changes
  updateButtonStyles();
}

// Update the button styles based on active text box styles
function updateButtonStyles() {
  if (!activeBox) return;

  const fontWeight = activeBox.element.style.fontWeight === 'bold';
  const fontStyle = activeBox.element.style.fontStyle === 'italic';
  const textDecoration = activeBox.element.style.textDecoration === 'underline';

  const boldButton = document.querySelector("button[onclick=\"toggleStyle('fontWeight')\"]");
  const italicButton = document.querySelector("button[onclick=\"toggleStyle('fontStyle')\"]");
  const underlineButton = document.querySelector("button[onclick=\"toggleStyle('textDecoration')\"]");

  // Apply 'button-active' class if the style is applied to the text box
  if (fontWeight) {
    boldButton.classList.add('button-active');
  } else {
    boldButton.classList.remove('button-active');
  }

  if (fontStyle) {
    italicButton.classList.add('button-active');
  } else {
    italicButton.classList.remove('button-active');
  }

  if (textDecoration) {
    underlineButton.classList.add('button-active');
  } else {
    underlineButton.classList.remove('button-active');
  }
}

// Set the active text box and update its border
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

  // Update button styles based on the active box's current styles
  updateButtonStyles();

  // Show the delete button in the footer
  const footer = activeBox.element.closest('.container').querySelector('footer');
  const deleteButton = footer.querySelector('.delete-btn');
  deleteButton.style.display = 'inline-block'; // Make the delete button visible
}

// Start dragging the active box
function dragStart(e) {
  const rect = activeBox.element.getBoundingClientRect();
  dragOffset.x = e.clientX - rect.left;
  dragOffset.y = e.clientY - rect.top;

  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
}

// Move the box during drag
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

// End dragging the active box
function dragEnd() {
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', dragEnd);
}

// Update text box styles such as font family and size
function updateTextBox(updates) {
  if (!activeBox) return;
  const { element } = activeBox;
  if (updates.fontFamily) element.style.fontFamily = updates.fontFamily;
  if (updates.fontSize) element.style.fontSize = `${updates.fontSize}px`;
  if (updates.color) element.style.color = updates.color;
}

// Delete the active text box
function deleteTextBox() {
  if (activeBox) {
    const element = activeBox.element;
    element.remove();
    activeBox = null; // Clear the active box
    // Hide the delete button in the footer after deletion
    const footer = document.querySelector('footer');
    const deleteButton = footer.querySelector('.delete-btn');
    deleteButton.style.display = 'none';
  }
}

// Dynamically create slides with text box and footer containing buttons
const images = ['p1.jpg', 'p2.jpg', 'p3.jpg'];
const swiperWrapper = document.getElementById('swiper-wrapper');

// Add unique default texts for each box
const defaultTexts = ["Text for slide 1", "Text for slide 2", "Text for slide 3"];

images.forEach((src, index) => {
  const slide = document.createElement('div');
  slide.className = 'swiper-slide';
  slide.innerHTML = `
    <div class="container">
      <h1>Text Editor with Swiper</h1>
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
    <input
      type="color"
      class="buttons"
      onchange="updateTextBox({ color: this.value })"
      title="Change Font Color"
    />
    <button class="buttons" onclick="toggleStyle('fontWeight')"><b>B</b></button>
    <button class="buttons" onclick="toggleStyle('fontStyle')"><i>I</i></button>
    <button class="buttons" onclick="toggleStyle('textDecoration')"><u>U</u></button>
    <button class="buttons" onclick="addBox(document.getElementById('img-cont-${src}'))">+ Add text box</button>
    <button class="buttons delete-btn" onclick="deleteTextBox()" style="display: none;">Delete</button>
  </div>
</footer>
    </div>
  `;
  swiperWrapper.appendChild(slide);

  // Add a default text box with unique text to each page
  const imgContainer = document.getElementById(`img-cont-${src}`);
  addBox(imgContainer, defaultTexts[index]);
});

// Initialize Swiper with disabled dragging
const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
  loop: true,
  simulateTouch: false, // Disable dragging/swiping
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});
