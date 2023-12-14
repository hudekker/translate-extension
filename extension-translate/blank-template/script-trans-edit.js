let editIcon = document.querySelector("#edit-icon");
let saveIcon = document.querySelector("#save-icon");

let editParagraphs = (action) => {
  switch (action) {
    case "edit":
      saveIcon.classList.toggle("no-display");
      editIcon.classList.toggle("no-display");
      toggleEdit();

      break;
    case "save":
      saveIcon.classList.toggle("no-display");
      editIcon.classList.toggle("no-display");
      deleteSelectedItems();
      toggleEdit();

      break;
    case "exit":
      saveIcon.classList.toggle("no-display");
      editIcon.classList.toggle("no-display");
      resetEdit();

      break;

    default:
      break;
  }
};

let deleteSelectedItems = () => {
  document.querySelectorAll(`.to-be-deleted`).forEach((element) => {
    // let paragraph = element.parentNode;
    element.remove();
  });
};

let resetEdit = () => {
  document.querySelectorAll("[data-to-be-deleted]").forEach((element) => {
    element.classList.add("no-display");
  });

  document.querySelectorAll("[data-index]").forEach((element) => {
    element.classList.remove("to-be-deleted");
  });
};

let toggleEdit = () => {
  document.querySelectorAll("[data-to-be-deleted]").forEach((element) => {
    element.classList.toggle("no-display");
  });
};

let toggleStrikethrough = (index) => {
  document.querySelectorAll(`[data-index="${index}"]`).forEach((element) => {
    element.parentElement.classList.toggle("to-be-deleted");
  });
};
let currentSize = "medium";

let toggleTextSize = () => {
  // Toggle between sizes
  switch (currentSize) {
    case "medium":
      currentSize = "big";
      break;
    case "big":
      currentSize = "small";
      break;
    case "small":
      currentSize = "medium";
      break;
  }

  let paragraphs = document.querySelectorAll(".p.p");

  paragraphs.forEach((paragraph) => {
    switch (currentSize) {
      case "medium":
        paragraph.classList.remove("big", "small");
        break;
      case "big":
        paragraph.classList.remove("small");
        paragraph.classList.add("big");
        break;
      case "small":
        paragraph.classList.remove("big");
        paragraph.classList.add("small");
        break;
    }
  });
};

function exportToPDF() {
  // Loop through all paragraphs and update styles
  let ptags = document.querySelectorAll(".p.p");
  let htags = document.querySelectorAll("h1, h2, h3");

  ptags.forEach((el) => el.classList.add("pdf"));
  htags.forEach((el) => el.classList.add("pdf"));
  document.querySelector("body").classList.add("pdf");
  document.querySelector("#icon-container").classList.add("pdf");

  window.print();

  ptags.forEach((el) => el.classList.remove("pdf"));
  htags.forEach((el) => el.classList.remove("pdf"));
  document.querySelector("body").classList.remove("pdf");
  document.querySelector("#icon-container").classList.remove("pdf");
}
