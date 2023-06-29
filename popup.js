// Initialize count variable
let count = 0;

let pageContent = "Waiting...";

// Get the button element
const main = document.getElementById('main');

// Retrieve the count from storage if it exists
browser.storage.local.get('count')
  .then(result => {
    count = result.count ?? count;
    pageContent = result.pageContent ?? pageContent;

    updateButton();
  })
  .catch(error => {
    console.error('Error retrieving count from storage:', error);
  });

  browser.tabs.query({ active: true, currentWindow: true })
  .then(tabs => {
    const activeTab = tabs[0];

    // Read the content of the active tab
    browser.tabs.sendMessage(activeTab.id, { action: "getContent" })
      .then(response => {
        const content = response.content;
        console.log("Page content:", content);

        pageContent = content;
        updateButton();
      })
      .catch(error => {
        console.error("Error reading page content:", error);
      });
  })
  .catch(error => {
    console.error("Error getting active tab:", error);
  });

// Update count and button text when the button is clicked
main.addEventListener('click', () => {
  count++;
  updateButton();

  // Save the updated count to storage
  browser.storage.local.set({ count: count, pageContent: pageContent })
    .catch(error => {
      console.error('Error saving count to storage:', error);
    });
});

// Function to update the button text
function updateButton() {
  main.textContent = `Count: ${count} I ate a ${pageContent}`;
}