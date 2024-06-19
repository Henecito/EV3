import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const getDocumento = (id) => getDoc(doc(db, "stdi", id));

export const update = (id, tec) => {
    updateDoc(doc(db, "stdi", id), tec);
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const clientForm = document.getElementById('clientForm');
const recordsBody = document.createElement('tbody'); 
const add = document.getElementById('btnadd');

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
        card.id = 'registros'
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
                <button class="btn btn-success btn-sm" onclick="deliverRecord('${doc.id}')">Entregar</button>
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

add.addEventListener('click', () => {
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

window.deliverRecord = async (id) => {
    const result = await Swal.fire({
        title: '¿Entregar este registro?',
        text: "Este registro se moverá a los entregados.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, entregarlo',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const docRef = doc(db, "stdi", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const deliveredRef = collection(db, "entregados");
                await addDoc(deliveredRef, docSnap.data());

                await deleteDoc(docRef);

                Swal.fire('Entregado', 'El registro ha sido entregado exitosamente', 'success');
                loadRecords(); 
            } else {
                Swal.fire('Error', 'El registro no existe en la base de datos', 'error');
            }
        } catch (e) {
            console.error("Error al entregar el registro: ", e);
            Swal.fire('Error', 'Hubo un problema al entregar el registro', 'error');
        }
    }
};

const fillEditForm = (record) => {
    clientForm.clientName.value = record.clientName;
    clientForm.nContact.value = record.nContact;
    clientForm.serviceDate.value = record.serviceDate;
    clientForm.phoneType.value = record.phoneType;
    clientForm.repairDetails.value = record.repairDetails;
    clientForm.servicePrice.value = record.servicePrice;
    clientForm.partName.value = record.partName;
    clientForm.tName.value = record.tName;
};

window.editRecord = (id, clientName, nContact, serviceDate, phoneType, repairDetails, servicePrice, partName, tName) => {

    const registros = document.querySelector('.swal2-container');
    registros.classList.add('showRegistros');
    const btnSaveToUp = document.getElementById('btnSaveToUp');
    btnSaveToUp.innerHTML = `
        <div class="col-md-6 d-grid">
            <button type="submit" class="btn btn-primary" id="btnUp">Actualizar</button>
        </div>
        <div class="col-md-6 d-grid">
            <button type="button" class="btn btn-secondary" id="clearBtn">Limpiar</button>
        </div>
    `;

    const btnUp = document.getElementById('btnUp');
    btnUp.addEventListener('click', async () => {
        const d = document.getElementById('serviceDate').value;

        const record = {
            clientName: clientForm.clientName.value,
            nContact: clientForm.nContact.value,
            phoneType: clientForm.phoneType.value,
            repairDetails: clientForm.repairDetails.value,
            servicePrice: clientForm.servicePrice.value,
            partName: clientForm.partName.value,
            tName: clientForm.tName.value,
            serviceDate: d
        };

        btnSaveToUp.innerHTML = `
            <div class="col-md-6 d-grid">
                <button type="submit" class="btn btn-primary" id="btnadd">Guardar</button>
            </div>
            <div class="col-md-6 d-grid">
                <button type="button" class="btn btn-secondary" id="clearBtn">Limpiar</button>
            </div>
        `;

        await update(id, record);

        Swal.fire({
            title: 'Actualización exitosa',
            text: 'El registro ha sido actualizado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false
        });

        clientForm.reset();
    });

    const record = {
        clientName,
        nContact,
        serviceDate,
        phoneType,
        repairDetails,
        servicePrice,
        partName,
        tName
    };

    fillEditForm(record);
};


window.addEventListener('load', loadRecords);
