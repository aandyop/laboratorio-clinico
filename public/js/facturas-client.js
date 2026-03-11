const form = document.getElementById('factura-form');
const selectPaciente = document.getElementById('paciente_id');
const tableBody = document.querySelector('#facturas-table tbody');

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

async function cargarPacientes() {
    try {
        const res = await fetch('/api/pacientes', { headers: getHeaders() });
        
        if (res.status === 401 || res.status === 403) {
            window.location.href = '/login';
            return;
        }

        const pacientes = await res.json();
        
        selectPaciente.innerHTML = '<option value="">-- Seleccione Paciente --</option>';
        pacientes.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.nombre;
            selectPaciente.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar pacientes para factura:", error);
    }
}

async function cargarFacturas() {
    try {
        const res = await fetch('/api/facturas', { headers: getHeaders() });
        const facturas = await res.json();
        
        tableBody.innerHTML = '';

        if (!Array.isArray(facturas) || facturas.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">No hay facturas registradas.</td></tr>';
            return;
        }

        facturas.forEach(f => {
            tableBody.innerHTML += `
                <tr>
                    <td>${new Date(f.fecha).toLocaleString()}</td>
                    <td>${f.paciente_nombre}</td>
                    <td>$${f.monto_total}</td>
                    <td>${f.metodo_pago}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar facturas:", error);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        paciente_id: selectPaciente.value,
        monto_total: document.getElementById('monto_total').value,
        metodo_pago: document.getElementById('metodo_pago').value
    };

    try {
        const response = await fetch('/api/facturas', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("Factura generada con éxito");
            form.reset();
            cargarFacturas();
        } else {
            const errorMsg = await response.json();
            alert("Error: " + (errorMsg.error || "No se pudo generar la factura"));
        }
    } catch (error) {
        console.error("Error en el envío de factura:", error);
        alert("Fallo de comunicación con el servidor");
    }
});

cargarPacientes();
cargarFacturas();