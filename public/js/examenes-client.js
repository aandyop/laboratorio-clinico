const examenForm = document.getElementById('examen-form');
const selectPaciente = document.getElementById('paciente_id');
const tableBody = document.querySelector('#examenes-table tbody');

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

async function cargarHistorialGlobal() {
    try {
        const res = await fetch('/api/examenes', { headers: getHeaders() });
        
        if (res.status === 401 || res.status === 403) {
            window.location.href = '/login';
            return;
        }

        const examenes = await res.json();
        renderizarTabla(examenes);
    } catch (error) {
        console.error("Error al cargar historial:", error);
    }
}

function renderizarTabla(examenes) {
    tableBody.innerHTML = '';
    
    if (!Array.isArray(examenes) || examenes.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No hay registros o no tienes permiso para verlos.</td></tr>';
        return;
    }

    examenes.forEach(e => {
        tableBody.innerHTML += `
            <tr>
                <td>${e.paciente_nombre || 'N/A'}</td> 
                <td>${e.tipo_examen}</td>
                <td>${e.resultado}</td>
                <td>${new Date(e.fecha).toLocaleDateString()}</td>
                <td>
                    ${localStorage.getItem('rol') === 'ADMIN' ? `<button onclick="eliminarExamen(${e.id})">Eliminar</button>` : 'Solo lectura'}
                </td>
            </tr>
        `;
    });
}

async function cargarSelectPacientes() {
    try {
        const res = await fetch('/api/pacientes', { headers: getHeaders() });
        if (!res.ok) throw new Error("No se pudieron cargar los pacientes");
        
        const pacientes = await res.json();
        
        selectPaciente.innerHTML = '<option value="">-- Seleccione Paciente --</option>';
        
        pacientes.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.nombre;
            selectPaciente.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar select de pacientes:", error);
    }
}

examenForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        paciente_id: selectPaciente.value,
        tipo_examen: document.getElementById('tipo_examen').value,
        resultado: document.getElementById('resultado').value,
        fecha: document.getElementById('fecha').value
    };

    try {
        const response = await fetch('/api/examenes', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("Examen registrado");
            examenForm.reset();
            cargarHistorialGlobal();
        } else {
            const errorMsg = await response.json();
            alert("Error: " + (errorMsg.error || "No se pudo registrar"));
        }
    } catch (error) {
        console.error("Error en el envío:", error);
        alert("Error de conexión al guardar");
    }
});

cargarSelectPacientes();
cargarHistorialGlobal();