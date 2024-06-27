document.addEventListener('DOMContentLoaded', function() {
  const bookForm = document.getElementById('book-form');
  const bookTableBody = document.getElementById('book-table-body');
  let editedRow = null; // Variable para almacenar la fila editada

  bookForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores del formulario
    const title = bookForm.title.value.trim();
    const author = bookForm.author.value.trim();
    const publicationDate = bookForm['publication-date'].value;
    const price = parseFloat(bookForm.price.value);
    const rating = parseInt(bookForm.rating.value);
    const used = bookForm.used.value;
    const cover = bookForm.cover.value;
    const email = bookForm.email.value.trim();

    // Validar campos requeridos y formatos
    let isValid = true;

    if (title === '') {
      showError(bookForm.title, 'Por favor ingrese el título del libro.');
      isValid = false;
    } else {
      showSuccess(bookForm.title);
    }

    if (author === '') {
      showError(bookForm.author, 'Por favor ingrese el nombre del autor.');
      isValid = false;
    } else {
      showSuccess(bookForm.author);
    }

    if (publicationDate === '') {
      showError(bookForm['publication-date'], 'Por favor seleccione la fecha de publicación.');
      isValid = false;
    } else {
      showSuccess(bookForm['publication-date']);
    }

    if (price < 9990 || isNaN(price)) {
      showError(bookForm.price, 'El precio mínimo es 9990.');
      isValid = false;
    } else {
      showSuccess(bookForm.price);
    }

    if (rating < 1 || rating > 5 || isNaN(rating)) {
      showError(bookForm.rating, 'La valoración debe ser un número entre 1 y 5.');
      isValid = false;
    } else {
      showSuccess(bookForm.rating);
    }

    if (!emailIsValid(email)) {
      showError(bookForm.email, 'Por favor ingrese un correo electrónico válido.');
      isValid = false;
    } else {
      showSuccess(bookForm.email);
    }

    if (isValid) {
      if (editedRow === null) {
        // Agregar nuevo libro a la tabla
        addBookToTable(title, author, publicationDate, price, rating, used, cover);
      } else {
        // Actualizar libro en la tabla (modo edición)
        updateBookInTable(title, author, publicationDate, price, rating, used, cover);
      }

      // Limpiar formulario y reiniciar variables de edición
      bookForm.reset();
      editedRow = null;
    }
  });

  bookForm.addEventListener('reset', function() {
    // Limpiar formulario y reiniciar variables de edición
    bookForm.querySelectorAll('.form-control').forEach(control => {
      clearControlValidation(control);
    });
    editedRow = null;
  });

  function addBookToTable(title, author, publicationDate, price, rating, used, cover) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${title}</td>
      <td>${author}</td>
      <td>${publicationDate}</td>
      <td>${price}</td>
      <td>${rating}</td>
      <td>${used}</td>
      <td>${cover}</td>
      <td>
        <button class="edit-button">Editar</button>
        <button class="delete-button">Eliminar</button>
      </td>
    `;

    // Agregar evento de editar
    newRow.querySelector('.edit-button').addEventListener('click', function() {
      editBook(newRow);
    });

    // Agregar evento de eliminar
    newRow.querySelector('.delete-button').addEventListener('click', function() {
      newRow.remove();
    });

    bookTableBody.appendChild(newRow);
  }

  function updateBookInTable(title, author, publicationDate, price, rating, used, cover) {
    if (editedRow !== null) {
      editedRow.children[0].textContent = title;
      editedRow.children[1].textContent = author;
      editedRow.children[2].textContent = publicationDate;
      editedRow.children[3].textContent = price;
      editedRow.children[4].textContent = rating;
      editedRow.children[5].textContent = used;
      editedRow.children[6].textContent = cover;
    }
  }

  function editBook(row) {
    editedRow = row;
    bookForm.title.value = row.children[0].textContent;
    bookForm.author.value = row.children[1].textContent;
    bookForm['publication-date'].value = row.children[2].textContent;
    bookForm.price.value = row.children[3].textContent;
    bookForm.rating.value = row.children[4].textContent;
    const usedRadio = row.children[5].textContent === 'Sí' ? document.getElementById('usedYes') : document.getElementById('usedNo');
    usedRadio.checked = true;
    const coverRadio = row.children[6].textContent === 'Tapa Blanda' ? document.getElementById('softcover') : document.getElementById('hardcover');
    coverRadio.checked = true;
  }

  function showError(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    small.innerText = message;
    formControl.classList.remove('success');
    formControl.classList.add('error');
  }

  function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.classList.remove('error');
    formControl.classList.add('success');
  }

  function clearControlValidation(control) {
    control.classList.remove('error', 'success');
    control.querySelector('small').innerText = '';
  }

  function emailIsValid(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
