// Function to handle language selection
const changeLanguage = (selectedLanguage) => {
  // Remove all existing 'no-display' classes
  document.querySelectorAll(".lang2, .lang1").forEach((element) => {
    element.classList.remove("no-display");
  });

  // If not 'bilingual', add 'no-display' to elements of the non-selected language
  if (selectedLanguage !== "bilingual") {
    const nonSelectedLanguage = selectedLanguage === "lang1" ? "lang2" : "lang1";
    document.querySelectorAll(`.${nonSelectedLanguage}`).forEach((element) => {
      element.classList.add("no-display");
    });
  }
};

const copyToClipboard = (prependText = false, textareaValue = "") => {
  // Format the selected text with two line breaks if needed
  const formattedSelectedText = prependText ? textareaValue + "\n\n" : "";

  // Initialize displayed content with the formatted selected text
  let displayedContent = formattedSelectedText;

  // Append other content to displayed content
  document.querySelectorAll(".p:not(.no-display)").forEach((element) => {
    displayedContent += element.textContent.trim() + "\n\n";
  });
  // document.querySelectorAll(".p:not(.no-display), .article-title:not(.no-display)").forEach((element) => {
  //   displayedContent += element.textContent.trim() + "\n\n";
  // });

  // Copy content to clipboard
  navigator.clipboard
    .writeText(displayedContent)
    .then(() => {
      // Show tooltip
      const tooltip = document.getElementById("copyTooltip");
      tooltip.style.display = "inline-block";

      // Hide tooltip after 2 seconds
      setTimeout(() => {
        tooltip.style.display = "none";
      }, 2000);

      console.log("Content copied to clipboard!");
    })
    .catch((error) => {
      console.error("Unable to copy to clipboard", error);
    });
};
