/**
 * Summary:
 * This script allows searching through multiple XML files for a specified text.
 * If the search text is found in a document, it highlights **all occurrences** of the matched text
 * and displays the document's content in a readable format.
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
 * Loads an XML file from the given file path and retrieves its raw text content.
 *
 * @param {string} filePath - The path to the XML file.
 * @returns {string|null} - The raw text content of the XML or null if loading failed.
 */
async function loadXML(filePath) {
    const response = await fetch(filePath); // Fetch the XML file
    if (!response.ok) {
        console.error(`❌ Failed to load XML file: ${filePath}`);
        return null; // Return null if loading failed
    }
    return await response.text(); // Return the raw XML text
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
 * If any match is found, it displays the **entire document** with all matches highlighted.
 */
async function searchXML() {
    let input = document.getElementById('searchInput').value.toLowerCase(); // Get the search input
    let resultsDiv = document.getElementById('results'); // Get the results div
    resultsDiv.innerHTML = ''; // Clear previous results

    console.log(`🔎 Searching for: ${input}`);

    const folders = await loadFolders(); // Load the folders configuration

    // Iterate over all folders and files
    for (let folder of folders) {
        for (let file of folder.files) {
            console.log(`🔎 Searching in file: ${file}`);  // <-- LOGGING EACH FILE

            const rawXML = await loadXML(file); // Load the raw XML text
            if (!rawXML) {
                console.error(`❌ Failed to load ${file}`);
                continue;
            }

            // Check if the search term exists in the entire XML document
            if (rawXML.toLowerCase().includes(input)) {
                console.log(`✅ Match found in ${file}`);

                // Highlight all occurrences
                const highlightedText = highlightAllOccurrences(rawXML, input);

                // Create result HTML
                let resultContent = `<strong>File:</strong> <a href="${file}" target="_blank">${file}</a> <br>`;
                resultContent += `<pre>${highlightedText}</pre><hr>`;

                // Create and append the result div
                let result = document.createElement('div');
                result.className = 'result';
                result.innerHTML = resultContent;
                resultsDiv.appendChild(result);
            } else {
                console.log(`🚫 No matches found in ${file}`);
            }
        }
    }
}
