const medicoForm = document.getElementById('medico-form');
const tableBody = document.querySelector('#medicos-table tbody');

async function cargarMedicos() {
    try {
        const res = await fetch('/api/medicos');
        const medicos = await res.json();
        
        tableBody.innerHTML = '';
        medicos.forEach(m => {
            tableBody.innerHTML += `
                <tr>
                    <td>${m.nombre}</td>
                    <td>${m.especialidad}</td>
                    <td>${m.codigo_colegiado}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar médicos:", error);
    }
}

medicoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById('nombre').value,
        especialidad: document.getElementById('especialidad').value,
        codigo_colegiado: document.getElementById('codigo_colegiado').value
    };

    try {
        const response = await fetch('/api/medicos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("Médico registrado exitosamente");
            medicoForm.reset();
            cargarMedicos();
        }
    } catch (error) {
        alert("Error al conectar con el servidor");
    }
});

cargarMedicos();