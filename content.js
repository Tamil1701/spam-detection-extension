let iframeContainer = null;

// Listener for showing/hiding the iframe
window.addEventListener("showIframe", createIframe);
window.addEventListener("hideIframe", removeIframe);

function createIframe() {
  // Prevent multiple instances
  if (iframeContainer) return;

  // Create the main container for iframe and header
  iframeContainer = document.createElement("div");
  iframeContainer.id = "floatingIframe";
  iframeContainer.style.position = "fixed";
  iframeContainer.style.top = "50px";
  iframeContainer.style.left = "50px";
  iframeContainer.style.width = "400px";
  iframeContainer.style.height = "600px";
  iframeContainer.style.zIndex = "9999";
  iframeContainer.style.border = "1px solid #ccc";
  iframeContainer.style.background = "#fff";
  iframeContainer.style.borderRadius = "8px";
  iframeContainer.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
  iframeContainer.style.overflow = "hidden";
  iframeContainer.style.resize = "both"; // Enable resizing
  iframeContainer.style.display = "flex";
  iframeContainer.style.flexDirection = "column";

  // Add draggable edges
  addDragEdges(iframeContainer);

  // Create the header for drag, minimize, and close
  const header = document.createElement("div");
  header.style.cssText = `
    width: 100%;
    height: 30px;
    background-color: #333;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    cursor: move;
    flex-shrink: 0;
  `;

  const title = document.createElement("span");
  title.innerText = "Spam Detector";

  // Minimize Button
  const minimizeBtn = document.createElement("button");
  minimizeBtn.innerText = "–";
  minimizeBtn.style.marginRight = "5px";
  minimizeBtn.style.padding = "0 6px";
  minimizeBtn.style.border = "none";
  minimizeBtn.style.background = "#FFC107";
  minimizeBtn.style.color = "white";
  minimizeBtn.style.cursor = "pointer";
  minimizeBtn.style.borderRadius = "4px";
  minimizeBtn.onclick = () => {
    if (iframe.style.display !== "none") {
      iframe.style.display = "none";
      minimizeBtn.innerText = "▢"; // Maximize icon
      iframeContainer.style.height = "40px"; // Minimized height
    } else {
      iframe.style.display = "block";
      minimizeBtn.innerText = "–";
      iframeContainer.style.height = "600px"; // Original height
    }
  };

  // Close Button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "✖";
  closeBtn.style.padding = "0 6px";
  closeBtn.style.border = "none";
  closeBtn.style.background = "#FF5C5C";
  closeBtn.style.color = "white";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.borderRadius = "4px";
  closeBtn.onclick = removeIframe;

  // Append title and buttons to header
  header.appendChild(title);
  header.appendChild(minimizeBtn);
  header.appendChild(closeBtn);
  iframeContainer.appendChild(header);

  // Create the iframe element
  const iframe = document.createElement("iframe");
  iframe.src = "http://127.0.0.1:5000/"; // Replace with your URL
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.flexGrow = "1"; // Make iframe take up all remaining space
  iframe.style.overflow = "auto"; // Enable scroll within iframe
  iframeContainer.appendChild(iframe);

  // Append the iframe container to the body
  document.body.appendChild(iframeContainer);

  // Inject padding CSS into iframe content
  iframe.onload = () => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const style = iframeDoc.createElement("style");
    style.innerHTML = `
      body {
        padding: 20px;
        box-sizing: border-box;
      }
    `;
    iframeDoc.head.appendChild(style);
  };
}

function addDragEdges(container) {
  const edges = ['top', 'right', 'bottom', 'left'];
  edges.forEach(edge => {
    const dragEdge = document.createElement("div");
    dragEdge.style.position = "absolute";
    dragEdge.style[edge] = "0";
    dragEdge.style.cursor = "move";
    dragEdge.style.width = edge === "left" || edge === "right" ? "10px" : "100%";
    dragEdge.style.height = edge === "top" || edge === "bottom" ? "10px" : "100%";
    dragEdge.style.backgroundColor = "transparent";

    let offsetX, offsetY;
    dragEdge.addEventListener("mousedown", (e) => {
      offsetX = e.clientX - container.getBoundingClientRect().left;
      offsetY = e.clientY - container.getBoundingClientRect().top;
      document.addEventListener("mousemove", dragContainer);
    });

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", dragContainer);
    });

    function dragContainer(e) {
      container.style.left = `${e.clientX - offsetX}px`;
      container.style.top = `${e.clientY - offsetY}px`;
    }

    container.appendChild(dragEdge);
  });
}

function removeIframe() {
  if (iframeContainer) {
    iframeContainer.remove();
    iframeContainer = null;
  }
}
