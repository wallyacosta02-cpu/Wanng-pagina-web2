let carrito = [];

const panelCarrito = document.getElementById("carrito");
const overlay = document.getElementById("overlayCarrito");
const abrir = document.getElementById("abrirCarrito");
const cerrar = document.getElementById("cerrarCarrito");
const contador = document.getElementById("contador");
const lista = document.getElementById("itemsCarrito");
const subtotalHTML = document.getElementById("subtotal");
const envioHTML = document.getElementById("envioTotal");
const totalHTML = document.getElementById("total");
const selectorEnvio = document.getElementById("tipoEnvio");
const btnWhatsApp = document.getElementById("btnWhatsApp");

function formato(numero) {
  return numero.toLocaleString("es-DO");
}

function abrirCarrito() {
  panelCarrito.classList.add("activo");
  overlay.classList.add("activo");
  document.body.classList.add("carrito-abierto");
}

function cerrarCarrito() {
  panelCarrito.classList.remove("activo");
  overlay.classList.remove("activo");
  document.body.classList.remove("carrito-abierto");
}

function guardarCarrito() {
  localStorage.setItem("waang-carrito", JSON.stringify(carrito));
  localStorage.setItem("waang-envio", selectorEnvio.value);
}

function calcularSubtotal() {
  let cantidad = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  let subtotal = 0;

  while (cantidad >= 3) {
    subtotal += 2200;
    cantidad -= 3;
  }

  if (cantidad === 2) subtotal += 1500;
  if (cantidad === 1) subtotal += 1000;

  return subtotal;
}

function calcularTotal() {
  const subtotal = calcularSubtotal();
  const envio = Number(selectorEnvio.value);

  subtotalHTML.textContent = formato(subtotal);
  envioHTML.textContent = formato(envio);
  totalHTML.textContent = formato(subtotal + envio);
  guardarCarrito();
}

function mostrarToast(texto) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = texto;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("mostrar"));

  setTimeout(() => {
    toast.classList.remove("mostrar");
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function animarContador() {
  contador.classList.add("animar");
  setTimeout(() => contador.classList.remove("animar"), 250);
}

function actualizarCarrito() {
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
  }

  carrito.forEach((producto, index) => {
    lista.innerHTML += `
      <article class="item-carrito">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="item-info">
          <div class="item-top">
            <div>
              <h4>${producto.nombre}</h4>
              <p>Talla: ${producto.talla}</p>
              <p>RD$${formato(producto.precio)}</p>
            </div>
            <button class="btn-eliminar" type="button" onclick="eliminarProducto(${index})" aria-label="Eliminar ${producto.nombre}">
              ×
            </button>
          </div>
          <div class="cantidad" aria-label="Cantidad">
            <button type="button" onclick="cambiarCantidad(${index}, -1)">−</button>
            <span>${producto.cantidad}</span>
            <button type="button" onclick="cambiarCantidad(${index}, 1)">+</button>
          </div>
        </div>
      </article>
    `;
  });

  const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
  contador.textContent = totalProductos;
  animarContador();
  calcularTotal();
}

function agregarProducto(id) {
  const producto = productos.find((item) => item.id === id);
  const talla = document.getElementById(`talla${id}`).value;
  const existe = carrito.find((item) => item.id === id && item.talla === talla);

  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      talla,
      cantidad: 1
    });
  }

  actualizarCarrito();
  abrirCarrito();
  mostrarToast("Producto agregado al carrito");
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  actualizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
}

function cargarCarrito() {
  const datos = localStorage.getItem("waang-carrito");
  const envio = localStorage.getItem("waang-envio");

  if (datos) carrito = JSON.parse(datos);
  if (envio) selectorEnvio.value = envio;

  actualizarCarrito();
}

function validarPedido() {
  if (carrito.length === 0) {
    alert("Agrega al menos un producto al carrito.");
    return false;
  }

  const campos = [
    { id: "nombre", mensaje: "Ingresa tu nombre." },
    { id: "telefono", mensaje: "Ingresa tu teléfono." },
    { id: "direccion", mensaje: "Ingresa tu dirección." }
  ];

  for (const campo of campos) {
    const elemento = document.getElementById(campo.id);
    if (elemento.value.trim() === "") {
      alert(campo.mensaje);
      elemento.focus();
      return false;
    }
  }

  if (selectorEnvio.value === "") {
    alert("Selecciona un método de entrega.");
    selectorEnvio.focus();
    return false;
  }

  return true;
}

function enviarWhatsApp() {
  if (!validarPedido()) return;

  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const referencia = document.getElementById("referencia").value.trim() || "No indicada";
  const subtotal = calcularSubtotal();
  const envio = Number(selectorEnvio.value);
  const total = subtotal + envio;
  const metodo = selectorEnvio.options[selectorEnvio.selectedIndex].text;

  const detalle = carrito.map((producto) => (
    `• ${producto.nombre}\nTalla: ${producto.talla}\nCantidad: ${producto.cantidad}`
  )).join("\n\n");

  const mensaje = `*NUEVO PEDIDO WAANG*

*Cliente*
${nombre}

*Teléfono*
${telefono}

*Dirección*
${direccion}

*Referencia*
${referencia}

*Productos*
${detalle}

*Subtotal:* RD$${formato(subtotal)}
*Envío:* RD$${formato(envio)}
*Total:* RD$${formato(total)}

*Método de entrega*
${metodo}

Instagram: @waangrd`;

  window.open(`https://wa.me/18097084033?text=${encodeURIComponent(mensaje)}`, "_blank");
}

abrir?.addEventListener("click", abrirCarrito);
cerrar?.addEventListener("click", cerrarCarrito);
overlay?.addEventListener("click", cerrarCarrito);
selectorEnvio?.addEventListener("change", calcularTotal);
btnWhatsApp?.addEventListener("click", enviarWhatsApp);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") cerrarCarrito();
});

window.addEventListener("load", () => {
  document.getElementById("loader")?.classList.add("oculto");
});

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) entrada.target.classList.add("visible");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".beneficio,.producto,.card-info,.promo-card,.paso,.envio,.faq-item").forEach((elemento) => {
  elemento.classList.add("fade-up");
  observador.observe(elemento);
});

const volver = document.createElement("button");
volver.innerHTML = "↑";
volver.className = "btn-top";
volver.type = "button";
volver.setAttribute("aria-label", "Volver arriba");
document.body.appendChild(volver);

window.addEventListener("scroll", () => {
  document.querySelector(".header")?.classList.toggle("scrolled", window.scrollY > 80);
  volver.classList.toggle("mostrar", window.scrollY > 600);
});

volver.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

productos.forEach((producto) => {
  const img = new Image();
  img.src = producto.imagen;
});

cargarCarrito();
