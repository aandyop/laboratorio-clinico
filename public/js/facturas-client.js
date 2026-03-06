const form = document.getElementById('factura-form');
const selectPaciente = document.getElementById('paciente_id');
const tableBody = document.querySelector('#facturas-table tbody');

async function cargarPacientes() {
    const res = await fetch('/api/pacientes');
    const pacientes = await res.json();
    pacientes.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nombre;
        selectPaciente.appendChild(option);
    });
}

async function cargarFacturas() {
    const res = await fetch('/api/facturas');
    const facturas = await res.json();
    tableBody.innerHTML = '';
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
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        paciente_id: selectPaciente.value,
        monto_total: document.getElementById('monto_total').value,
        metodo_pago: document.getElementById('metodo_pago').value
    };

    await fetch('/api/facturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    form.reset();
    cargarFacturas();
});

cargarPacientes();
cargarFacturas();