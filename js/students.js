document.addEventListener('DOMContentLoaded', function () {
  fetch(localStorage.getItem('server_url') + 'api/all/checkuser', {
      headers: { Authentication: 'Bearer ' + sessionStorage.getItem('token') }
    }).then(function (response) {
      // The API call was successful!
      return response.json();
    }).then(function (data) {
      if (data.error) {
        swal(data.message, data.icon);
        location.href = data.route
      }else{
        document.getElementById("main").classList.remove("d-none")
      }
    }).catch(function (err) {
      // There was an error
      console.warn('Something went wrong.', err);
    });

}, false);

function fillStudentsTable() {
  fetch(localStorage.getItem('server_url') + 'api/admin/lecturers/students', {
    headers: { Authentication: 'Bearer ' + sessionStorage.getItem('token') }
  }).then(function (response) {
    // The API call was successful!
    return response.json();
  }).then(function (data) {
    if (data.error) {
      swal(data.message, data.icon);
      location.href = data.route
    }
    // This is the JSON from our response
    document.getElementById('students_list').innerHTML = ""
    data.forEach(element => {
      document.getElementById('students_list').innerHTML = document.getElementById('students_list').innerHTML + lineStudents(element.id, element.name, element.status ? '<i class="bg-success"></i> Active' : '<i class="bg-danger"></i> Disabled', element.updated_at, element.status, element.notes)
    });
    fillUserRoleSelect()
  }).catch(function (err) {
    // There was an error
    console.warn('Something went wrong.', err);
  });
}

function fillUserRoleSelect() {

  fetch(localStorage.getItem('server_url') + 'api/admin/lecturers/semester', {
    headers: { Authentication: 'Bearer ' + sessionStorage.getItem('token') }
  }).then(function (response) {
    // The API call was successful!
    return response.json();
  }).then(function (data) {
    if (data.error) {
      swal(data.message, data.icon);
      location.href = data.route
    }
    // This is the JSON from our response
    document.querySelectorAll('select').forEach((item) => {
      item.innerHTML = ""
      data.forEach(element => {
        item.innerHTML = item.innerHTML + `<option value="${element.id}">${element.name}</option>`
        item.onchange = function () {
          if (item.dataset.id) {
            try {
              document.querySelector(`#note_${item.dataset.id}`).value = (document.querySelector(`#semester_${item.value}_${item.dataset.id}`).value)
            } catch (error) { document.querySelector(`#note_${item.dataset.id}`).value = "" }
          }
        }
        if (item.dataset.id) {
          try {
            document.querySelector(`#note_${item.dataset.id}`).value = (document.querySelector(`#semester_${item.value}_${item.dataset.id}`).value)
          } catch (error) { document.querySelector(`#note_${item.dataset.id}`).value = "" }
        }
      });
    });

    document.querySelector('#principal-select').onchange = () => {
      document.querySelectorAll('select').forEach((item) => {
        item.value = document.querySelector('#principal-select').value
        if (item.dataset.id) {
          try {
            document.querySelector(`#note_${item.dataset.id}`).value = (document.querySelector(`#semester_${item.value}_${item.dataset.id}`).value)
          } catch (error) {
            document.querySelector(`#note_${item.dataset.id}`).value = ""
          }
        }
      });
    }

  }).catch(function (err) {
    // There was an error
    console.warn('Something went wrong.', err);
  });

}

function preSubmitForm(id, btn_id, form_id) {
  document.querySelector(`#input_semester_id_${form_id}`).value = document.querySelector(`#semester_id_${form_id}`).value
  document.querySelector(`#input_note_${form_id}`).value = document.querySelector(`#note_${form_id}`).value
  submitForm(id, btn_id);
}

function lineStudents(id, name, status, updated_at, state, notes) {
  bloc_note = ''
  notes.forEach(element => {
    bloc_note += `<input type="hidden" id="semester_${element.semester_id}_${id}"  value="${element.note}" />`
  });
  console.log(bloc_note)
  return `
  <tr>
<td>
  <a class="text-heading font-semibold" href="#">
    ${id}
  </a>
</td>
<td>${name}</td>
<td>${name}</td>
<td>
<select id="semester_id_${id}" data-id="${id}"></select>
${bloc_note}
</td>
<td>
  <input type="text" class="note_" id="note_${id}" value=""  />
</td>
<td>${updated_at}</td>
<td class="text-end d-flex">
<form id="save_note${id}" data-action="api/admin/lecturers/notes" method="POST">
<input type="hidden" id="input_note_${id}" name="note" value=""  />
<input type="hidden" id="input_semester_id_${id}" name="semester_id" value=""  />
  <input type="hidden" name="student_id" value="${id}" />
  <input type="hidden" name="lecturer_id" value="1" />
  <button id="btn_save_note${id}"
    type="button" onclick="preSubmitForm('save_note${id}', 'btn_save_note${id}', ${id});"
    class="btn btn-sm btn-square btn-neutral text-danger-hover"
  >
  <i class="bi bi-pencil"></i>
  </button>
  </form>

  </td>
</tr>`
}

function fillNotes(id, lecture, semester, note, updated_at) {
  return `
  <tr>
    <td>
      <a class="text-heading font-semibold" href="#">
        ${id}
      </a>
    </td>
    <td>${lecture}</td>
    <td>${semester}</td>
    <td>${note}</td>
    <td>${updated_at}</td>
  </tr>`
}

