let pickerApiLoaded = false;

function onApiLoad() {
  gapi.load("auth", { callback: onAuthApiLoad });
  gapi.load("picker", { callback: onPickerApiLoad });
}

function onAuthApiLoad() {
  gapi.auth.setToken({ access_token: TOKEN });
  createPicker();
}

function onPickerApiLoad() {
  pickerApiLoaded = true;
  createPicker();
}

// function createPicker() {
//   if (pickerApiLoaded && TOKEN) {
//     var picker = new google.picker.PickerBuilder()
//       .addView(google.picker.ViewId.DOCS)
//       .addView(google.picker.ViewId.FOLDERS)
//       .setOAuthToken(TOKEN)
//       .setDeveloperKey(API_KEY)
//       .setCallback(pickerCallback)
//       .build();
//     picker.setVisible(true);
//   }
// }

// function createPicker() {
//   if (pickerApiLoaded && TOKEN) {
//     var picker = new google.picker.PickerBuilder()
//       .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
//       .setOAuthToken(TOKEN)
//       .setDeveloperKey(API_KEY)
//       .setCallback(pickerCallback)
//       .addView(google.picker.ViewId.DOCS)
//       .addView(google.picker.ViewId.FOLDERS)
//       .addView(new google.picker.DocsView()) // For viewing all types of documents
//       .addView(new google.picker.DocsUploadView()) // For uploading documents
//       .build();
//     picker.setVisible(true);
//   }
// }

function createPicker() {
  if (pickerApiLoaded && TOKEN) {
    // var uploadView = new google.picker.DocsUploadView().setIncludeFolders(true); // Allows users to see and select folders
    var uploadView = new google.picker.DocsUploadView()
      .setParent()
      .setIncludeFolders(true);
    // var uploadView = new google.picker.DocsUploadView();
    // var folderId = "1-DDeqhkO_ePNTd2_1KkI2TvveyfSCb9u"; // Miscel
    // uploadView.setParent(folderId);

    // new google.picker.DocsView().setIncludeFolders(true).setOwnedByMe(true);

    // let docsView = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
    //   .setParent("root")
    //   .setSelectFolderEnabled(true);

    // New stuff
    // var docsView = new google.picker.DocsView()
    //   .setIncludeFolders(true)
    //   .setSelectFolderEnabled(true);

    // var picker = new google.picker.PickerBuilder()
    //   .enableFeature(google.picker.Feature.MINE_ONLY)
    //   .enableFeature(google.picker.Feature.NAV_HIDDEN)
    //   .setAppId(appId)
    //   .setOAuthToken(oauthToken)
    //   .setDeveloperKey(developerKey)
    //   .addView(docsView)
    //   .setCallback(pickerCallback)
    //   .build();
    // picker.setVisible(true);
    // end new stuff

    var picker = new google.picker.PickerBuilder()
      .setOAuthToken(TOKEN)
      .setDeveloperKey(API_KEY)
      .addView(
        new google.picker.DocsView().setIncludeFolders(true).setOwnedByMe(true)
      )
      // .addView(new google.picker.DocsView().setSelectFolderEnabled(true)) // For viewing all types of documents

      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)

      .setCallback(pickerCallback)
      .addView(uploadView) // For uploading documents to a specific folder
      .build();
    picker.setVisible(true);

    debugger;
  }
}

function pickerCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    debugger;
    // url = doc[google.picker.Document.URL];
    console.log("The user selected: " + fileId);
    if (data.viewToken[0] !== "upload") {
      let url = data.docs[0].url;
      window.open(url, "_blank");
    }
  }
}

document.getElementById("pick-button").addEventListener("click", onApiLoad);
