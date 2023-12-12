let editIcon = document.querySelector('#edit-icon');
let saveIcon = document.querySelector('#save-icon');


let editParagraphs = (action) => {
  switch (action) {
    case 'edit':
      saveIcon.classList.toggle('no-display')
      editIcon.classList.toggle('no-display')
      toggleEdit();

      break;
    case 'save':
      saveIcon.classList.toggle('no-display')
      editIcon.classList.toggle('no-display')
      deleteSelectedItems();
      toggleEdit();

      break;
    case 'exit':
      saveIcon.classList.toggle('no-display')
      editIcon.classList.toggle('no-display')
      resetEdit();

      break;

    default:
      break;
  }
}

let deleteSelectedItems = () => {
  document.querySelectorAll(`.to-be-deleted`).forEach(element => {
    // let paragraph = element.parentNode;
    element.remove();
  });
}

let resetEdit = () => {
  document.querySelectorAll('[data-to-be-deleted]').forEach(element => {
    element.classList.add('no-display');
  });

  document.querySelectorAll('[data-index]').forEach(element => {
    element.classList.remove('to-be-deleted');
  });
}

let toggleEdit = () => {
  document.querySelectorAll('[data-to-be-deleted]').forEach(element => {
    element.classList.toggle('no-display');
  });
}

let toggleStrikethrough = (index) => {
  document.querySelectorAll(`[data-index="${index}"]`).forEach(element => {
    element.parentElement.classList.toggle('to-be-deleted');
  });
}