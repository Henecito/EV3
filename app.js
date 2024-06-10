import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDjCvtyvnE416LBPq_k_QTFTLzH9kvaSc8",
    authDomain: "stdi-solutions-ev3-ce0fe.firebaseapp.com",
    projectId: "stdi-solutions-ev3-ce0fe",
    storageBucket: "stdi-solutions-ev3-ce0fe.appspot.com",
    messagingSenderId: "381912565465",
    appId: "1:381912565465:web:3c6c5e44d5c23229ef60c8",
    measurementId: "G-SFJ9JLQV53"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const clientForm = document.getElementById('clientForm');
const recordsBody = document.createElement('tbody'); 

const addRecord = async (record) => {
    try {
        await addDoc(collection(db, "stdi"), record);
        Swal.fire('Éxito', 'El registro ha sido guardado exitosamente', 'success');
        loadRecords();
    } catch (e) {
        console.error("Error al agregar el registro: ", e);
        Swal.fire('Error', 'Hubo un problema al guardar el registro', 'error');
    }
};

const loadRecords = async () => {
    recordsBody.innerHTML = '';

    const querySnapshot = await getDocs(collection(db, "stdi"));
    querySnapshot.forEach((doc) => {
        const record = doc.data();
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');

        card.innerHTML = `
            <div class="card-body">
                <p class="card-title"><strong>Nombre del cliente:</strong> ${record.clientName}<p>
                <p class="card-text"><strong>Nº Contacto:</strong> ${record.nContact}</p>
                <p class="card-text"><strong>Fecha Ingreso:</strong> ${record.serviceDate}</p>
                <p class="card-text"><strong>Tipo de Teléfono:</strong> ${record.phoneType}</p>
                <p class="card-text"><strong>Detalles:</strong> ${record.repairDetails}</p>
                <p class="card-text"><strong>Precio:</strong> ${record.servicePrice}</p>
                <p class="card-text"><strong>Repuesto:</strong> ${record.partName}</p>
                <p class="card-text"><strong>Nombre del Técnico:</strong> ${record.tName}</p>
                <button class="btn btn-danger btn-sm" onclick="deleteRecord('${doc.id}')">Eliminar</button>
                <button class="btn btn-warning btn-sm" onclick="editRecord('${doc.id}', '${record.clientName}', '${record.nContact}', '${record.serviceDate}', '${record.phoneType}', '${record.repairDetails}', '${record.servicePrice}', '${record.partName}', '${record.tName}')">Editar</button>
            </div>
        `;

        recordsBody.appendChild(card);
    });
};

window.deleteRecord = async (id) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            await deleteDoc(doc(db, "stdi", id));
            Swal.fire('Eliminado', 'El registro ha sido eliminado exitosamente', 'success');
            loadRecords();
        } catch (e) {
            console.error("Error al eliminar el registro: ", e);
            Swal.fire('Error', 'Hubo un problema al eliminar el registro', 'error');
        }
    }
};


window.editRecord = (id, clientName, nContact, serviceDate, phoneType, repairDetails, servicePrice, partName, tName) => {
    clientForm.clientName.value = clientName;
    clientForm.nContact.value = nContact;
    clientForm.serviceDate.value = serviceDate;
    clientForm.phoneType.value = phoneType;
    clientForm.repairDetails.value = repairDetails;
    clientForm.servicePrice.value = servicePrice;
    clientForm.partName.value = partName;
    clientForm.tName.value = tName;
    document.getElementById('saveBtn').setAttribute('data-id', id);
};

clientForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split('T')[0];
    const selectedDate = clientForm.serviceDate.value;

    if (selectedDate < currentDate) {
        Swal.fire('Error', 'La fecha del servicio no puede ser anterior a la fecha actual', 'error');
        return; 
    }

    const record = {
        clientName: clientForm.clientName.value,
        nContact: clientForm.nContact.value,
        serviceDate: selectedDate,
        phoneType: clientForm.phoneType.value,
        repairDetails: clientForm.repairDetails.value,
        servicePrice: clientForm.servicePrice.value,
        partName: clientForm.partName.value,
        tName: clientForm.tName.value
    };
    addRecord(record);
    clientForm.reset();
});


document.addEventListener('DOMContentLoaded', () => {
    const clientNameInput = document.getElementById('clientName');
    const nContactInput = document.getElementById('nContact');

    clientNameInput.addEventListener('input', () => {
        clientNameInput.value = clientNameInput.value.replace(/[^a-zA-Z\s]/g, '');
    });

    nContactInput.addEventListener('input', () => {
        nContactInput.value = nContactInput.value.replace(/\D/g, ''); 
    });
});

document.getElementById('clearBtn').addEventListener('click', () => {
    clientForm.reset();
});

document.getElementById('showRecordsBtn').addEventListener('click', async () => {
    await loadRecords(); 
    const recordsTableHtml = `

            ${recordsBody.outerHTML}
    `;

    Swal.fire({
        title: '<span style="color: cyan;">Registros</span>',
        html: recordsTableHtml,
        customClass: {
            popup: 'swal-wide',
            title: 'swal-title-custom',
            htmlContainer: 'swal-html-container-custom'
        },
        showCloseButton: true,
        showConfirmButton: false,
        background: 'rgba(0, 0, 0, 0.5)',
        backdrop: `
            rgba(0, 0, 0, 0.4)
        `,
        width: '60%',
        scrollbarPadding: true,
        backdropFilter: 'blur(10px)'
    });  
});

window.addEventListener('load', loadRecords);
