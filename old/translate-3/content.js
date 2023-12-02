const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};



chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('inside content onMessage');

  if (request.action === "getSelectedContent") {
    // Get the selected content and its structure
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const clonedRange = range.cloneRange();

    // Create a temporary div to extract the selected content
    const tempDiv = document.createElement("div");
    tempDiv.appendChild(clonedRange.cloneContents());


    const formattedContent = (tempDiv.innerHTML).replace(/<\/p>/g, '\n');

    // Display the formatted content in a textarea
    const textarea = document.createElement('textarea');
    textarea.value = formattedContent;

    debugger;

    // Send the selected content to the background script
    chrome.runtime.sendMessage({
      action: "translateSelection",
      selectedContent: tempDiv.innerHTML
    });
  }

});

