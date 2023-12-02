const canvas = document.getElementById("snowmanCanvas");
const ctx = canvas.getContext("2d");

const items = [
  { name: "leftEye", x: 185, y: 260, radius: 3, color: "#000" },
  { name: "rightEye", x: 215, y: 260, radius: 3, color: "#000" },
  { name: "nose", x: 200, y: 270, points: [{ x: 190, y: 280 }, { x: 210, y: 280 }], color: "#ff8c00" },
  { name: "mouth", x: 200, y: 280, radius: 10, startAngle: 0.2 * Math.PI, endAngle: 0.8 * Math.PI, anticlockwise: false, color: "#000" },
  { name: "hatBase", x: 170, y: 220, width: 60, height: 20, color: "#000", draggable: true },
  { name: "hatTop", x: 185, y: 150, width: 30, height: 80, color: "#000" },
  { name: "scarf", points: [{ x: 200, y: 310 }, { x: 190, y: 330 }, { x: 210, y: 330 }], lineWidth: 5, color: "#ff0000" }
];

let selectedItem = null;
let offsetX, offsetY;

function drawItems() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  items.forEach(item => {
    ctx.beginPath();

    if (item.radius) {
      ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
    } else if (item.width && item.height) {
      ctx.fillRect(item.x, item.y, item.width, item.height);
    } else if (item.points) {
      ctx.moveTo(item.points[0].x, item.points[0].y);
      item.points.slice(1).forEach(point => ctx.lineTo(point.x, point.y));
    }

    ctx.fillStyle = item.color;
    ctx.fill();
  });
}

function handleMouseDown(e) {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  selectedItem = null;

  // Iterate items in reverse to prioritize the topmost item
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (
      mouseX > item.x &&
      mouseX < item.x + (item.width || item.radius * 2) &&
      mouseY > item.y &&
      mouseY < item.y + (item.height || item.radius * 2) &&
      item.draggable
    ) {
      selectedItem = item;
      offsetX = mouseX - item.x;
      offsetY = mouseY - item.y;
      break; // Stop iteration after finding the topmost draggable item
    }
  }
}

function handleMouseMove(e) {
  if (selectedItem) {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    selectedItem.x = mouseX - offsetX;
    selectedItem.y = mouseY - offsetY;

    drawItems();
  }
}

function handleMouseUp() {
  selectedItem = null;
}

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

setInterval(drawItems, 10);
