
let text = "";

let pageContent = "Waiting...";

const gptbtn = document.getElementById('gpt');
const outText = document.getElementById("out");

// Retrieve the count from storage if it exists (BAD)
browser.storage.local.get('count')
  .then(result => {
    text = result.count ?? text;
    pageContent = result.pageContent ?? pageContent;

  })
  .catch(error => {
    console.error('Error retrieving count from storage:', error);
  });

  browser.tabs.query({ active: true, currentWindow: true })
  .then(tabs => {
    const activeTab = tabs[0];


    browser.tabs.sendMessage(activeTab.id, { action: "getContent" })
      .then(response => {
        const content = response.content;
        console.log("Page content:", content);

        pageContent = content;
      })
      .catch(error => {
        console.error("Error reading page content:", error);
      });
  })
  .catch(error => {
    console.error("Error getting active tab:", error);
  });

gptbtn.addEventListener('click', () => {
interactWithChatGPT();

  browser.storage.local.set({ text: text, pageContent: pageContent })
    .catch(error => {
      console.error('Error saving count to storage:', error);
    });
});


function interactWithChatGPT() {
    const token = "nice try";
  

    fetch('https://api.openai.com/v1/engines/davinci/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        prompt: `Summarize this in point form: ${pageContent}`,
        max_tokens: 1000
      })
    })
      .then(response => response.json())
      .then(data => {

        // console.log(data);
        console.log('ChatGPT response:', data.choices[0].text);

        outText.innerHTML = data.choices[0].text;

      })
      .catch(error => {
        console.error('Error interacting with ChatGPT:', error);
      });
  }

