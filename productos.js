const productos = [
  {
    id: 1,
    nombre: "Olive",
    precio: 1000,
    imagen: "img/t-shirt1.jpeg",
    descripcion: "Oversized color oliva con estampado exclusivo WAANG.",
    nuevo: true
  },
  {
    id: 2,
    nombre: "Black",
    precio: 1000,
    imagen: "img/t-shirt2.jpeg",
    descripcion: "Oversized negra para cualquier ocasión.",
    nuevo: true
  },
  {
    id: 3,
    nombre: "Brown",
    precio: 1000,
    imagen: "img/t-shirt3.jpeg",
    descripcion: "Diseño café minimalista.",
    nuevo: false
  },
  {
    id: 4,
    nombre: "Beige",
    precio: 1000,
    imagen: "img/t-shirt4.jpeg",
    descripcion: "Oversized beige con acabado premium.",
    nuevo: false
  },
  {
    id: 5,
    nombre: "White Flowers",
    precio: 1000,
    imagen: "img/t-shirt5.jpeg",
    descripcion: "Diseño floral blanco.",
    nuevo: true
  },
  {
    id: 6,
    nombre: "Celeste",
    precio: 1000,
    imagen: "img/t-shirt6.jpeg",
    descripcion: "Color celeste con estampado exclusivo.",
    nuevo: false
  },
  {
    id: 7,
    nombre: "White Ocean",
    precio: 1000,
    imagen: "img/t-shirt7.jpeg",
    descripcion: "Inspirado en el océano.",
    nuevo: true
  },
  {
    id: 8,
    nombre: "Red Flowers",
    precio: 1000,
    imagen: "img/t-shirt8.jpeg",
    descripcion: "Diseño floral rojo.",
    nuevo: true
  }
];

const contenedorProductos = document.getElementById("productos");

if (contenedorProductos) {
  contenedorProductos.innerHTML = productos.map((producto) => `
    <article class="producto">
      <div class="producto-imagen">
        <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
        ${producto.nuevo ? '<span class="badge">NUEVO</span>' : ""}
      </div>
      <div class="producto-info">
        <h3>${producto.nombre}</h3>
        <span>Oversized WAANG</span>
        <p class="precio">RD$${producto.precio.toLocaleString()}</p>
        <p class="descripcion">${producto.descripcion}</p>
        <label class="talla-label" for="talla${producto.id}">Talla</label>
        <select id="talla${producto.id}" class="selector-talla">
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
        <button class="btn-comprar" type="button" onclick="agregarProducto(${producto.id})">
          Agregar al carrito
        </button>
      </div>
    </article>
  `).join("");
}
