
const urlBase = 'https://utn-lubnan-api-1.herokuapp.com/api';

/// obtener los datos de companias y employee
function getData(url){
return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.onload = () => {
        if(request.readyState == 4 && request.status == 200){
            resolve(request.response);
        }else{
            reject(request.status);
        }
    }

    request.onerror = () => {
        reject('ONERROR, algo salio mal');
    }

    request.send();
})
}

/* getData(urlBase + '/Employee')
.then((response)=>{
    console.log(response);
})
.catch((reason)=>{
    console.log('algo salio mal: ' + reason);
})

getData(urlBase + '/Company')
.then((response)=>{
    console.log(response);
})
.catch((reason)=>{
    console.log('algo salio mal: ' + reason);
}) */

    // hago las 2 peticiones a la api. si tengo datos enteriores los elimino y llamo a otra funcion para cargar datos
async function loadEmployeeWithCompanies(){

    var table = document.getElementById('tableEmployee');
    var tbody = table.getElementsByTagName('tbody')[0];
    if(tbody){tbody.remove();}
    
    var employee = await getData(urlBase + '/Employee');
    var companies = await getData(urlBase + '/Company');

    table.appendChild(insertDataTable(employee,companies));


    //table.appendChild(insertDataTableIdPar(employee, companies));
    //table.appendChild(insertDataTableForCompany(employee,companies));

  /*// CARGO LOS DATOS EN LA TABLA POR ORDEN DE APELLIDO
    var employeeOrdered = orderEmployee(employee);
    table.appendChild(insertDataTable(employeeOrdered, companies)) */

}

// inserto los datos en la tabla
function insertDataTable(employee, companies){

    var tbody = document.createElement('tbody');

    employee.forEach(element => {
        tbody.innerHTML += `
        <tr>
        <th scope="col">${element.employeeId}</th>
        <th scope="col">${element.firstName}</th>
        <th scope="col">${element.lastName}</th>
        <th scope="col">${element.email}</th>
        <th scope="col">${element.companyId}</th>
        <th scope="col">${companies[element.companyId-1].name}</th>
        <th scope="col"><button type="button" class="btn btn-danger" onClick="deleteEmployee(${element.employeeId})">delete</button></th>
        </tr>
        `
    });

    return tbody;
}

/// inserto los empleados de la company 5
function insertDataTableForCompany(employee, companies){

    var tbody = document.createElement('tbody');

    employee.forEach(element => {
        if(element.companyId == 5){
            tbody.innerHTML += `
            <tr>
            <th scope="col">${element.employeeId}</th>
            <th scope="col">${element.firstName}</th>
            <th scope="col">${element.lastName}</th>
            <th scope="col">${element.email}</th>
            <th scope="col">${element.companyId}</th>
            <th scope="col">${companies[element.companyId-1].name}</th>
            <th scope="col"><button type="button" class="btn btn-danger" onClick="deleteEmployee(${element.employeeId})">delete</button></th>
            </tr>
            `
        }
       
    });

    return tbody;
}

// inserta los emploados que tienen un id par
function insertDataTableIdPar(employee,companies){
    var tbody = document.createElement('tbody');

    employee.forEach(element => {
        if(element.employeeId % 2 == 0){
            tbody.innerHTML += `
            <tr>
            <th scope='col'>${element.employeeId}</th>
            <th scope='col'>${element.firstName}</th>
            <th scope='col'>${element.lastName}</th>
            <th scope='col'>${element.email}</th>
            <th scope='col'>${element.companyId}</th>
            <th scope='col'>${companies[element.companyId-1].name}</th>
            <th scope='col'><button type="button" class="btn btn-danger" onClick="deleteEmployee(${element.employeeId})">delete</button></th>
            </tr>
            `
        }
    })
    return tbody;
}

//funcion para ordenar los datos por lastName 
function orderEmployee (employees){

   employees.sort(function(a,b){
    return a.lastName.localeCompare(b.lastName);
   });

    return employees;
}


function deleteMethod(url){
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open('DELETE', url);
        request.onload = () =>{
            if(request.status == 200){
                resolve(request.response);
            }else{
                reject(request.status);
            }
        }
    
        request.send();
    })
    }



function deleteEmployee(id){
    
    console.log(id);
    var p = document.getElementById('mensagge');
    p.innerText = '';

    deleteMethod(urlBase + '/Employee/' + id)
    .then((response)=>{
        p.innerHTML = 'EMPLOYEE DELECTED SUCCESFULLY';
        p.style.color = 'green';
        loadEmployeeWithCompanies();
    })
    .catch((reason)=>{
        p.innerHTML = 'ERROR DELET';
        p.style.color = 'red';
    })
}