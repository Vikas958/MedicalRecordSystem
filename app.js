let url = "https://66c4a1afb026f3cc6cf023e7.mockapi.io/patients";
const outercon = document.querySelector('.outer');
const addButton = document.querySelector('.btn-primary');
const formContainer = document.querySelector('.addUser');

addButton.addEventListener('click', function() {
    formContainer.style.display = 'block';
    outercon.style.display = 'none';
});

function handleFormSubmission(event) {
    // console.log(event);
    event.preventDefault();

    const pname = document.getElementById('pname').value;
    const dob = document.getElementById('dob').value;
    const mh = document.getElementById('mh').value;
    const dname = document.getElementById('dname').value;

    const patientData = {
        name: pname,
        dob: dob, 
        medicalHistory: mh,
        doctor: dname
    };

    const form = event.target;
    const patientId = form.getAttribute('data-id');

    if (patientId) {
        updatePatientData(patientId, patientData);
    } else {
        sendPatientData(patientData);
    }
}

function sendPatientData(data) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onload = function() {
        if (xhr.status === 201) {
            alert('Patient data saved successfully!');
            document.getElementById('myForm').reset();
            formContainer.style.display = 'none';
            outercon.style.display = 'block';
            updatePatientList();
        } else {
            alert('Error saving data. Please try again.');
        }
    };

    xhr.onerror = function() {
        alert('Request failed.');
    };

    xhr.send(JSON.stringify(data));
}

function updatePatientList() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const patients = JSON.parse(xhr.responseText);
            const innerTable = document.getElementById('innerTable');

            innerTable.innerHTML =`
                <div class="tableHeading">
                    <div style="padding-left: 5px;">No.</div>
                    <div>Patient Name</div>
                    <div>Date of Birth</div>
                    <div>Medical History</div>
                    <div>Doctor</div>
                    <div style="margin-left:40px">Actions</div>
                </div>
            `;

            patients.forEach((patient, index) => {
                const row = document.createElement('div');
                row.classList.add('tableRow');
                row.innerHTML = `
                    <div style="padding-left: 5px;">${index + 1}</div>
                    <div>${patient.name}</div>
                    <div>${patient.dob}</div>
                    <div>${patient.medicalHistory}</div>
                    <div>${patient.doctor}</div>
                    <div style="margin-left: 40px;">
                        <button class="btn btn-primary editBtn" data-id="${patient.id}" style="margin-top: 10px; margin-bottom: 10px;">Edit</button>
                        <button class="btn btn-danger deleteBtn" data-id="${patient.id}" style="margin-top: 10px; margin-bottom: 10px;">Delete</button>
                    </div>
                `;
                innerTable.appendChild(row);

                // Attach event listeners for edit and delete
                row.querySelector('.editBtn').addEventListener('click', function() {
                    handleEdit(this);
                });
                row.querySelector('.deleteBtn').addEventListener('click', function() {
                    handleDelete(this);
                });
            });
        } else {
            alert('Error fetching data.');
        }
    };

    xhr.send();
}

function handleEdit(button) {
    const patientId = button.getAttribute('data-id');
    
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${url}/${patientId}`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const patient = JSON.parse(xhr.responseText);
            
            document.getElementById('pname').value = patient.name;
            document.getElementById('dob').value = patient.dob;
            document.getElementById('mh').value = patient.medicalHistory;
            document.getElementById('dname').value = patient.doctor;
            
            formContainer.style.display = 'block';
            const btnid=document.getElementById("addBth");
            btnid.value="Edit details";
            outercon.style.display = 'none';
            
            const form = document.getElementById('myForm');
            form.setAttribute('data-id', patientId);
        } else {
            console.error('Failed to fetch patient details');
        }
    };
    xhr.send();
}

function updatePatientData(patientId, data) {
    const xhrUpdate = new XMLHttpRequest();
    xhrUpdate.open("PUT", `${url}/${patientId}`, true);
    xhrUpdate.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhrUpdate.onload = function() {
        if (xhrUpdate.status === 200) {
            console.log('Patient details updated successfully');
            document.getElementById('myForm').reset();
            formContainer.style.display = 'none';
            outercon.style.display = 'block';
            updatePatientList();
        } else {
            console.error('Failed to update patient details');
        }
    };
    xhrUpdate.send(JSON.stringify(data));
}

function handleDelete(button) {
    const patientId = button.getAttribute('data-id');
    
    if (!confirm("Are you sure you want to delete this patient?")) {
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `${url}/${patientId}`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Patient deleted successfully');
            updatePatientList(); 
        } else {
            console.error('Failed to delete patient');
        }
    };
    xhr.send();
}


document.getElementById('myForm').addEventListener('submit', handleFormSubmission);
updatePatientList(); 


const backButton = document.getElementById('backButton');

backButton.addEventListener('click', function() {
    formContainer.style.display = 'none'; 
    outercon.style.display = 'block'; 
});



