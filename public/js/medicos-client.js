const medicoForm = document.getElementById('medico-form');
const tableBody = document.querySelector('#medicos-table tbody');

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

async function cargarMedicos() {
    try {
        const res = await fetch('/api/medicos', { headers: getHeaders() });
        const medicos = await res.json();
        
        tableBody.innerHTML = '';
        medicos.forEach(m => {
            tableBody.innerHTML += `
                <tr>
                    <td>${m.nombre}</td>
                    <td>${m.especialidad}</td>
                    <td>${m.codigo_colegiado}</td>
                    <td>
                        ${localStorage.getItem('rol') === 'ADMIN' ? 
                          `<button onclick="eliminarMedico(${m.id})" class="btn-delete">Eliminar</button>` : 
                          '<span class="badge-public">Solo lectura</span>'}
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar médicos:", error);
    }
}

if (medicoForm) {
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
                headers: getHeaders(),
                body: JSON.stringify(datos)
            });

            if (response.ok) {
                alert("Médico registrado exitosamente");
                medicoForm.reset();
                cargarMedicos();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            alert("Error al conectar con el servidor");
        }
    });
}

async function eliminarMedico(id) {
    if (confirm('¿Estás seguro de eliminar a este médico?')) {
        try {
            const response = await fetch(`/api/medicos/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (response.ok) {
                alert("Médico eliminado");
                cargarMedicos();
            } else {
                const errorData = await response.json();
                alert(errorData.error);
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}

cargarMedicos();