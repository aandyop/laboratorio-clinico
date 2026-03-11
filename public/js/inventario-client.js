const form = document.getElementById('inventario-form');
const tableBody = document.querySelector('#inventario-table tbody');

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

async function cargarInventario() {
    try {
        const res = await fetch('/api/inventario', { headers: getHeaders() });
        
        if (res.status === 401 || res.status === 403) {
            window.location.href = '/login';
            return;
        }

        const items = await res.json();
        
        tableBody.innerHTML = '';
        
        if (!Array.isArray(items) || items.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No hay insumos en inventario.</td></tr>';
            return;
        }

        items.forEach(item => {
            const status = item.cantidad_stock < 10 ? '⚠️ Bajo' : '✅ OK';
            
            const esAdmin = localStorage.getItem('rol') === 'ADMIN';
            const acciones = esAdmin ? 
                `<button onclick="eliminarInsumo(${item.id})" class="btn-delete">Eliminar</button>` : 
                '<span>Solo lectura</span>';

            tableBody.innerHTML += `
                <tr>
                    <td>${item.nombre_insumo}</td>
                    <td>${item.cantidad_stock}</td>
                    <td>${item.unidad_medida}</td>
                    <td>${item.fecha_vencimiento ? new Date(item.fecha_vencimiento).toLocaleDateString() : 'N/A'}</td>
                    <td>${status}</td>
                    <td>${acciones}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar inventario:", error);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        nombre_insumo: document.getElementById('nombre_insumo').value,
        cantidad_stock: document.getElementById('cantidad_stock').value,
        unidad_medida: document.getElementById('unidad_medida').value,
        fecha_vencimiento: document.getElementById('fecha_vencimiento').value
    };

    try {
        const response = await fetch('/api/inventario', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("Insumo agregado con éxito");
            form.reset();
            cargarInventario();
        } else {
            const errorData = await response.json();
            alert("Error: " + (errorData.error || "No se pudo agregar el insumo"));
        }
    } catch (error) {
        console.error("Error en el envío:", error);
        alert("Error de comunicación con el servidor");
    }
});

async function eliminarInsumo(id) {
    if (confirm('¿Eliminar este insumo del inventario?')) {
        const res = await fetch(`/api/inventario/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (res.ok) {
            cargarInventario();
        } else {
            const error = await res.json();
            alert(error.error);
        }
    }
}

cargarInventario();