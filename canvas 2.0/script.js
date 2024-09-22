document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  const image = new Image();
  const drawnCircles = [];
  const CIRCLE_RADIUS = 15;
  const CIRCLE_COLOR = "rgba(255, 0, 0, 1)";
  const HOVER_COLOR = "rgba(255, 0, 0, 0.5)"; // Cor mais clara para hover
  const areas = document.querySelectorAll("area");
  let hoveredCircle = null;

  image.src = "carro2.jpg";

  // Carregar imagem e ajustar tamanho do canvas
  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
  };

  // Desenhar círculo
  function drawCircle(x, y, color = CIRCLE_COLOR) {
    ctx.beginPath();
    ctx.arc(x, y, CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  // Limpar círculo
  function clearCircle(x, y) {
    ctx.clearRect(
      x - CIRCLE_RADIUS,
      y - CIRCLE_RADIUS,
      CIRCLE_RADIUS * 2,
      CIRCLE_RADIUS * 2
    );
    ctx.drawImage(
      image,
      x - CIRCLE_RADIUS,
      y - CIRCLE_RADIUS,
      CIRCLE_RADIUS * 2,
      CIRCLE_RADIUS * 2,
      x - CIRCLE_RADIUS,
      y - CIRCLE_RADIUS,
      CIRCLE_RADIUS * 2,
      CIRCLE_RADIUS * 2
    );
  }

  // Verificar se o clique está dentro do círculo
  function isClickInCircle(mouseX, mouseY, x, y) {
    return (
      mouseX >= x - CIRCLE_RADIUS &&
      mouseX <= x + CIRCLE_RADIUS &&
      mouseY >= y - CIRCLE_RADIUS &&
      mouseY <= y + CIRCLE_RADIUS
    );
  }

  // Lidar com o clique no canvas
  canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    areas.forEach(function (area) {
      const [x, y] = area.coords.split(",").map(Number);
      const dataKey = area.getAttribute("data-key");

      if (isClickInCircle(mouseX, mouseY, x, y)) {
        const circleIndex = drawnCircles.findIndex(
          (circle) => circle.x === x && circle.y === y
        );
        if (circleIndex !== -1) {
          clearCircle(x, y);
          drawnCircles.splice(circleIndex, 1);
        } else {
          drawCircle(x, y);
          drawnCircles.push({ x, y });
        }

        // Marcar/desmarcar a checkbox correspondente
        const checkbox = document.querySelector(
          `input[type="checkbox"][data-key="${dataKey}"]`
        );
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      }
    });
  });

  // Lidar com o hover
  canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    let found = false;

    // console.log("Mouse X:", mouseX, "Mouse Y:", mouseY);

    areas.forEach(function (area) {
      const [x, y] = area.coords.split(",").map(Number);

      if (isClickInCircle(mouseX, mouseY, x, y)) {
        canvas.style.cursor = "pointer"; // Mudar o cursor para pointer
        if (hoveredCircle === null || hoveredCircle.x !== x || hoveredCircle.y !== y) {
          if (hoveredCircle) {
            clearCircle(hoveredCircle.x, hoveredCircle.y); // Limpar o círculo anterior
            // Redesenha o círculo original, se já estiver desenhado
            const isAlreadyDrawn = drawnCircles.some(
              (circle) => circle.x === hoveredCircle.x && circle.y === hoveredCircle.y
            );
            if (isAlreadyDrawn) {
              drawCircle(hoveredCircle.x, hoveredCircle.y);
            }
          }

          drawCircle(x, y, HOVER_COLOR); // Desenhar o círculo de hover
          hoveredCircle = { x, y };
        }
        found = true;
      }
    });

    if (!found && hoveredCircle) {
      clearCircle(hoveredCircle.x, hoveredCircle.y); // Limpar o círculo de hover
      // Redesenha o círculo original, se já estiver desenhado
      const isAlreadyDrawn = drawnCircles.some(
        (circle) => circle.x === hoveredCircle.x && circle.y === hoveredCircle.y
      );
      if (isAlreadyDrawn) {
        drawCircle(hoveredCircle.x, hoveredCircle.y);
      }
      hoveredCircle = null;
      canvas.style.cursor = "default"; // Voltar o cursor ao normal
    }
  });

  // Lidar com a mudança na checkbox
  function updateCanvasFromCheckbox(checkbox) {
    const isChecked = checkbox.checked;
    const dataKey = checkbox.getAttribute("data-key");

    areas.forEach(function (area) {
      if (area.getAttribute("data-key") === dataKey) {
        const [x, y] = area.coords.split(",").map(Number);
        if (isChecked) {
          drawCircle(x, y);
          drawnCircles.push({ x, y });
        } else {
          const circleIndex = drawnCircles.findIndex(
            (circle) => circle.x === x && circle.y === y
          );
          if (circleIndex !== -1) {
            clearCircle(x, y);
            drawnCircles.splice(circleIndex, 1);
          }
        }
      }
    });
  }

  // Lidar com mudanças nas checkboxes
  document.querySelectorAll('input[type="checkbox"]')
    .forEach(function (checkbox) {
      checkbox.addEventListener("change", function () {
        updateCanvasFromCheckbox(checkbox);
      });
    });
});
