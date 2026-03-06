const pacienteForm = document.getElementById('paciente-form');
const selectMedicos = document.getElementById('medico_id');
const tableBody = document.querySelector('#pacientes-table tbody');

async function cargarSelectMedicos() {
    try {
        const res = await fetch('/api/medicos');
        const medicos = await res.json();

        selectMedicos.innerHTML = '<option value="">-- Seleccione Médico (Opcional) --</option>';
        
        medicos.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id;
            option.textContent = m.nombre;
            selectMedicos.appendChild(option);
        });
        console.log("Médicos cargados en el selector");
    } catch (error) {
        console.error("Error al cargar select de médicos:", error);
    }
}

async function cargarPacientes() {
    try {
        const res = await fetch('/api/pacientes');
        const pacientes = await res.json();
        
        tableBody.innerHTML = '';
        pacientes.forEach(p => {
            tableBody.innerHTML += `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.cedula}</td>
                    <td>${p.telefono}</td>
                    <td>${p.medico_nombre || 'Sin asignar'}</td>
                    <td>
                        <button onclick="eliminarPaciente(${p.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar la lista de pacientes:", error);
        tableBody.innerHTML = '<tr><td colspan="5">Error al cargar datos</td></tr>';
    }
}

pacienteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        nombre: document.getElementById('nombre').value,
        cedula: document.getElementById('cedula').value,
        telefono: document.getElementById('telefono').value,
        medico_id: selectMedicos.value || null 
    };

    try {
        const response = await fetch('/api/pacientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("Paciente guardado");
            pacienteForm.reset();
            cargarPacientes();
        }
    } catch (error) {
        alert("Error al guardar paciente");
    }
});

async function eliminarPaciente(id) {
    if (confirm('¿Eliminar paciente y sus exámenes?')) {
        await fetch(`/api/pacientes/${id}`, { method: 'DELETE' });
        cargarPacientes();
    }
}

async function inicializar() {
    await cargarSelectMedicos();
    await cargarPacientes();
}

inicializar();