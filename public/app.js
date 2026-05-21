const btnMensajes = document.getElementById("btnMensajes")
const btnCalendario = document.getElementById("btnCalendario")
const btnResumen = document.getElementById("btnResumen")

const contenedorMensajes = document.getElementById("contenedorMensajes")
const contenedorCalendario = document.getElementById("contenedorCalendario")
const contenedorResumen = document.getElementById("contenedorResumen")

// Theme toggle: aplica tema guardado o según preferencia del sistema
const themeToggle = document.getElementById("themeToggle")
function applyTheme(theme) {
  if (!themeToggle) return
  if (theme === "dark") {
    document.body.classList.add("dark")
    themeToggle.textContent = "☀️"
    themeToggle.setAttribute("aria-label", "Cambiar a tema claro")
  } else {
    document.body.classList.remove("dark")
    themeToggle.textContent = "🌙"
    themeToggle.setAttribute("aria-label", "Cambiar a tema oscuro")
  }
}

const savedTheme = localStorage.getItem("theme") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
applyTheme(savedTheme)

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = document.body.classList.contains("dark") ? "light" : "dark"
    applyTheme(next)
    localStorage.setItem("theme", next)
  })
}

btnMensajes.addEventListener("click", () => {
  cargarMensajes()
})

btnCalendario.addEventListener("click", () => {
  cargarCalendario()
})

btnResumen.addEventListener("click", () => {
  cargarResumen()
})

async function cargarMensajes() {
  try {
    const respuesta = await fetch("/api/mensajes")
    const todosLosMensajes = await respuesta.json()
    
    // LÍNEA 25: Creamos la variable 'mensajes' filtrando solo los aprobados
    const mensajes = todosLosMensajes.filter(m => m.revisionEditorial === "aprobada");

    contenedorMensajes.innerHTML = ""

     for (const mensaje of mensajes) {
      const tarjeta = document.createElement("article")
      tarjeta.classList.add("tarjeta-mensaje")

      tarjeta.innerHTML = `
        <h3>${mensaje.titulo}</h3>
        <p>${mensaje.mensaje}</p>

        <p>
          <span class="etiqueta">Categoría: ${mensaje.categoria}</span>
          <span class="etiqueta">Audiencia: ${mensaje.audiencia}</span>
          <span class="etiqueta">Tono: ${mensaje.tono}</span>
        </p>

        <p><strong>Llamado a la acción:</strong> ${mensaje.llamadoAccion}</p>
        <p class="texto-secundario"><strong>Fuente:</strong> ${mensaje.fuente}</p>
      `

      contenedorMensajes.appendChild(tarjeta)
    }
  } catch (error) {
    contenedorMensajes.textContent = "No fue posible cargar los mensajes. Revisa que el servidor esté funcionando."
  }
}

async function cargarCalendario() {
  try {
    const respuesta = await fetch("/api/calendario")
    const calendario = await respuesta.json()

    contenedorCalendario.innerHTML = ""

    for (const pieza of calendario) {
      const tarjeta = document.createElement("article")
      tarjeta.classList.add("tarjeta-mensaje")

      tarjeta.innerHTML = `
        <h3>Semana ${pieza.semana} - ${pieza.dia}</h3>
        <p><strong>Tema:</strong> ${pieza.tema}</p>
        <p><strong>Pieza:</strong> ${pieza.pieza}</p>
        <p><strong>Canal:</strong> ${pieza.canal}</p>
        <p><strong>Público objetivo:</strong> ${pieza.publicoObjetivo}</p>
        <p><strong>Propósito:</strong> ${pieza.proposito}</p>
        <p><strong>Llamado a la acción:</strong> ${pieza.llamadoAccion}</p>
        <p class="texto-secundario"><strong>Fuente:</strong> ${pieza.fuente}</p>
      `

      contenedorCalendario.appendChild(tarjeta)
    }
  } catch (error) {
    contenedorCalendario.textContent = "No fue posible cargar el calendario editorial. Revisa que el servidor esté funcionando."
  }
}

async function cargarResumen() {
  try {
    const respuesta = await fetch("/api/resumen")
    const resumen = await respuesta.json()

    contenedorResumen.innerHTML = ""

    const tarjeta = document.createElement("article")
    tarjeta.classList.add("tarjeta-mensaje")

    tarjeta.innerHTML = `
      <h3>Resumen del proyecto</h3>
      <p>Total de mensajes: ${resumen.totalMensajes}</p>
      <p>Total de piezas del calendario: ${resumen.totalPiezasCalendario}</p>
      <p>Categorías encontradas: ${resumen.categoriasMensajes.join(", ")}</p>
      <p>${resumen.mensaje}</p>
    `

    contenedorResumen.appendChild(tarjeta)
  } catch (error) {
    contenedorResumen.textContent = "No fue posible cargar el resumen. Revisa que el servidor esté funcionando."
  }
}
