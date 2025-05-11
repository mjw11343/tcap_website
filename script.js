/**
 * Summary:
 * This script allows searching through multiple XML files for a specified text.
 * If the search text is found in a document, it highlights the matched text and 
 * displays the document's content with bolded headings. The results are displayed 
 * on the search.xml page.
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
 * Recursively searches through all text elements of the given element to check if 
 * the search text is present.
 *
 * @param {Node} element - The XML element to search within.
 * @param {string} searchText - The text to search for.
 * @returns {boolean} - True if the search text is found, otherwise false.
 */
function searchInTextElements(element, searchText) {
    if (element.nodeName === "text" && element.textContent.toLowerCase().includes(searchText)) {
        return true; // Check if text element contains search text
    }

    // Recursively search child nodes
    for (let i = 0; i < element.childNodes.length; i++) {
        if (searchInTextElements(element.childNodes[i], searchText)) {
            return true;
        }
    }

    return false; // Return false if search text is not found
}

/**
 * Summary:
 * Highlights the search text within the given text by wrapping the matched part 
 * with a span element that has a background color.
 *
 * @param {string} text - The text to highlight within.
 * @param {string} searchText - The text to highlight.
 * @returns {string} - The text with highlighted search text.
 */
function highlightText(text, searchText) {
    const index = text.toLowerCase().indexOf(searchText); // Find the index of the search text
    if (index === -1) return text; // Return original text if search text is not found

    const beforeMatch = text.substring(0, index); // Text before the match
    const match = text.substring(index, index + searchText.length); // The matched text
    const afterMatch = text.substring(index + searchText.length); // Text after the match

    return `${beforeMatch}<span style="background-color: yellow;">${match}</span>${afterMatch}`; // Return highlighted text
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
            console.log(file)
            if (!xml) {
                console.log('Failed loading.')
                continue; // Skip if loading failed
            }

            let found = false; // Flag to indicate if search text is found in the document
            let resultContent = `<strong>File:</strong> <a href="${file}" target="_blank">${file}</a> <br>`; // Initialize result content with link to file

            let items = xml.getElementsByTagName('*'); // Get all elements in the document
            for (let i = 0; i < items.length; i++) {
                // Skip elements within <nav> tags
                if (items[i].closest('nav')) {
                    continue;
                }

                if (searchInTextElements(items[i], input)) {
                    found = true; // Set flag to true if search text is found
                    let heading = items[i].parentNode.getElementsByTagName('heading')[0]?.textContent;
                    let text = items[i].textContent;
                    if (heading && text) {
                        resultContent += `<strong>${heading}:</strong> ${highlightText(text, input)}<br>`; // Add highlighted content
                    }
                    break; // Stop searching once a match is found
                }
            }

            if (found) {
                let result = document.createElement('div'); // Create a result div
                result.className = 'result'; // Set class name for styling
                result.innerHTML = resultContent; // Set the inner HTML
                resultsDiv.appendChild(result); // Append result to results div
            }
        }
    }
}
