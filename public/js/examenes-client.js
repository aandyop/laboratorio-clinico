const examenForm = document.getElementById('examen-form');
const selectPaciente = document.getElementById('paciente_id');
const tableBody = document.querySelector('#examenes-table tbody');

async function cargarHistorialGlobal() {
    const res = await fetch('/api/examenes');
    const examenes = await res.json();
    renderizarTabla(examenes);
}

function renderizarTabla(examenes) {
    tableBody.innerHTML = '';
    
    if (examenes.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No hay registros.</td></tr>';
        return;
    }

    examenes.forEach(e => {
        tableBody.innerHTML += `
            <tr>
                <td>${e.paciente_nombre || 'N/A'}</td> 
                <td>${e.tipo_examen}</td>
                <td>${e.resultado}</td>
                <td>${new Date(e.fecha).toLocaleDateString()}</td>
            </tr>
        `;
    });
}

async function cargarSelectPacientes() {
    const res = await fetch('/api/pacientes');
    const pacientes = await res.json();
    pacientes.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nombre;
        selectPaciente.appendChild(option);
    });
}

examenForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        paciente_id: selectPaciente.value,
        tipo_examen: document.getElementById('tipo_examen').value,
        resultado: document.getElementById('resultado').value,
        fecha: document.getElementById('fecha').value
    };

    const response = await fetch('/api/examenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    if (response.ok) {
        alert("Examen registrado");
        examenForm.reset();
        cargarHistorialGlobal();
    }
});

cargarSelectPacientes();
cargarHistorialGlobal();