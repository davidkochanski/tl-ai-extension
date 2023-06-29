
browser.runtime.onMessage.addListener(request => {
    if (request.action === "getContent") {
      // Retrieve the page content
      const content = document.documentElement.innerText;
  
      // Send the content back to the extension
      return Promise.resolve({ content });
    }
  });