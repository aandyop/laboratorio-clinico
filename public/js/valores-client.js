const form = document.getElementById('valores-form');
const tableBody = document.querySelector('#valores-table tbody');

function getHeaders() {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

async function cargarValores() {
    try {
        const res = await fetch('/api/valores-referencia', { headers: getHeaders() });
        const valores = await res.json();
        
        tableBody.innerHTML = '';
        
        if (!Array.isArray(valores) || valores.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">No hay valores de referencia registrados.</td></tr>';
            return;
        }

        valores.forEach(v => {
            const esAdmin = localStorage.getItem('rol') === 'ADMIN';
            const btnEliminar = esAdmin ? 
                `<td><button onclick="eliminarRango(${v.id})" class="btn-delete">Eliminar</button></td>` : 
                '<td><span class="badge-public">Informativo</span></td>';

            tableBody.innerHTML += `
                <tr>
                    <td>${v.nombre_examen}</td>
                    <td>${v.valor_minimo} - ${v.valor_maximo}</td>
                    <td>${v.unit || v.unidad}</td>
                    ${btnEliminar}
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar valores:", error);
    }
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = {
            nombre_examen: document.getElementById('nombre_examen').value,
            valor_minimo: document.getElementById('valor_minimo').value,
            valor_maximo: document.getElementById('valor_maximo').value,
            unidad: document.getElementById('unidad').value
        };

        try {
            const response = await fetch('/api/valores-referencia', {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(datos)
            });

            if (response.ok) {
                alert("Rango guardado correctamente");
                form.reset();
                cargarValores();
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.error || "No autorizado"));
            }
        } catch (error) {
            alert("Error al conectar con el servidor");
        }
    });
}

async function eliminarRango(id) {
    if (confirm('¿Desea eliminar este rango de referencia?')) {
        const res = await fetch(`/api/valores-referencia/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (res.ok) cargarValores();
        else alert("No tienes permisos para realizar esta acción");
    }
}

cargarValores();