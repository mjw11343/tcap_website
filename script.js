/**
 * Summary:
 * This script allows searching through multiple XML files for a specified text.
 * If the search text is found in a document, it highlights **all occurrences** of the matched text
 * and displays the document's content in a readable format with proper sectioning.
 */

/**
 * Summary:
 * Loads the JSON configuration file for folders.
 *
 * @returns {Array} - The array of folder configurations.
 */
async function loadFolders() {
    const response = await fetch('folders.json'); // Fetch the JSON configuration file
    if (!response.ok) {
        console.error('Failed to load folders.json'); // Log error if fetch fails
        return []; // Return empty array if loading failed
    }
    return await response.json(); // Parse and return the JSON content
}

/**
 * Summary:
 * Loads an XML file from the given file path and parses it into a DOM object.
 *
 * @param {string} filePath - The path to the XML file.
 * @returns {Document|null} - The parsed XML document or null if loading failed.
 */
async function loadXML(filePath) {
    const response = await fetch(filePath); // Fetch the XML file
    if (!response.ok) {
        console.error(`Failed to load XML file: ${filePath}`); // Log error if fetch fails
        return null; // Return null if loading failed
    }
    const text = await response.text(); // Get the response text
    return (new window.DOMParser()).parseFromString(text, "application/xml"); // Parse and return the XML document
}

/**
 * Summary:
 * Highlights **all occurrences** of the search text within the given text by wrapping 
 * the matched part with a span element that has a background color.
 *
 * @param {string} text - The text to highlight within.
 * @param {string} searchText - The text to highlight.
 * @returns {string} - The text with all occurrences of the search text highlighted.
 */
function highlightAllOccurrences(text, searchText) {
    const regex = new RegExp(searchText, 'gi');
    return text.replace(regex, `<span style="background-color: yellow;">$&</span>`);
}

/**
 * Summary:
 * Searches through all XML files listed in the folders array for the specified text.
 * Displays documents containing the search text with the text highlighted and headings bolded.
 */
async function searchXML() {
    let input = document.getElementById('searchInput').value.toLowerCase(); // Get the search input
    let resultsDiv = document.getElementById('results'); // Get the results div
    resultsDiv.innerHTML = ''; // Clear previous results

    console.log(`Searching for: ${input}`);

    const folders = await loadFolders(); // Load the folders configuration

    // Iterate over all folders and files
    for (let folder of folders) {
        for (let file of folder.files) {
            const xml = await loadXML(file); // Load the XML file
            console.log(`🔎 Searching in file: ${file}`);
            if (!xml) {
                console.log('Failed loading.');
                continue; // Skip if loading failed
            }

            let resultContent = `<strong>File:</strong> <a href="${file}" target="_blank">${file}</a> <br>`; // Initialize result content with link to file
            let items = xml.getElementsByTagName('*'); // Get all elements in the document
            let found = false; // Flag to indicate if search text is found in the document

            for (let i = 0; i < items.length; i++) {
                // Skip elements within <nav> tags
                if (items[i].closest('nav')) {
                    continue;
                }

                // Only look for <text> elements that match
                if (items[i].nodeName === "text" && items[i].textContent.toLowerCase().includes(input)) {
                    found = true;

                    let parentElement = items[i].parentNode;
                    let heading = parentElement.getElementsByTagName('heading')[0]?.textContent;
                    let text = items[i].textContent;

                    if (heading && text) {
                        resultContent += `<strong>${heading}:</strong><br>`; // Display the heading
                        resultContent += `${highlightAllOccurrences(text, input)}<br><hr>`; // Display and highlight all instances of the term
                    }
                }
            }

            // Only append if at least one match was found in the file
            if (found) {
                let result = document.createElement('div'); // Create a result div
                result.className = 'result'; // Set class name for styling
                result.innerHTML = resultContent; // Set the inner HTML
                resultsDiv.appendChild(result); // Append result to results div
            }
        }
    }
}
