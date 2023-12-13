const templateString = document.getElementById("myEJSTemplate").innerHTML;
const compiledTemplate = ejs.compile(templateString);

const data = {
  title: "Hello, EJS!",
  content: "This is a sample EJS template rendered on the client side.",
};

const renderedHTML = compiledTemplate(data);

// Now you can insert the renderedHTML into the DOM or perform any other action
document.getElementById("output").innerHTML = renderedHTML;
