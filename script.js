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
    console.log("🔄 Attempting to load folders.json...");
    try {
        const response = await fetch('folders.json');
        if (!response.ok) {
            console.error(`❌ Failed to load folders.json - Status: ${response.status}`);
            return [];
        }
        const data = await response.json();
        console.log("✅ Successfully loaded folders.json:", data);
        return data;
    } catch (error) {
        console.error("❌ Error while loading folders.json:", error);
        return [];
    }
}

/**
 * Summary:
 * Loads an XML file from the given file path and retrieves its raw text content.
 *
 * @param {string} filePath - The path to the XML file.
 * @returns {string|null} - The raw text content of the XML or null if loading failed.
 */
async function loadXML(filePath) {
    console.log(`🔄 Attempting to load file: ${filePath}`);
    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            console.error(`❌ Failed to load XML file: ${filePath} - Status: ${response.status}`);
            if (response.status === 404) {
                console.warn(`📁 404 Error: File not found at path: ${filePath}`);
            } else if (response.status === 500) {
                console.warn(`🔎 500 Error: Server issue for file: ${filePath}`);
            }
            return null;
        }

        console.log(`✅ Successfully loaded: ${filePath}`);
        return await response.text();
    } catch (error) {
        console.error(`❌ Exception thrown when loading ${filePath}:`, error);
        return null;
    }
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
    if (!text) return text;
    const regex = new RegExp(searchText, 'gi');
    return text.replace(regex, `<span style="background-color: yellow;">$&</span>`);
}

/**
 * Summary:
 * Searches through all XML files listed in the folders array for the specified text.
 * If any match is found, it displays the **entire document** with all matches highlighted.
 */
async function searchXML() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (!input) {
        console.warn("⚠️ Search term is empty. Please enter a value.");
        resultsDiv.innerHTML = `<p>Please enter a search term.</p>`;
        return;
    }

    console.log(`🔎 Searching for: ${input}`);
    
    const folders = await loadFolders();

    if (folders.length === 0) {
        console.error("🚫 No folders found. Check if folders.json is loaded correctly.");
        resultsDiv.innerHTML = `<p>Error loading folder configuration. Please check the console.</p>`;
        return;
    }

    let resultsFound = false;

    // Iterate over all folders and files
    for (let folder of folders) {
        for (let file of folder.files) {
            console.log(`🔄 Searching in file: ${file}`);

            const rawXML = await loadXML(file); 
            if (!rawXML) {
                console.error(`❌ Loading failed for: ${file}`);
                continue;
            }

            // **Debugging line to show raw content**
            console.log(`📝 Loaded content for ${file}:`, rawXML.slice(0, 200) + "...");

            // Check if the search term exists in the entire XML document
            if (rawXML.toLowerCase().includes(input)) {
                console.log(`✅ Match found in ${file}`);

                // Highlight all occurrences
                const highlightedText = highlightAllOccurrences(rawXML, input);

                // Format the XML:
                // - Make <heading> tags bold
                // - Reduce unnecessary line breaks
                const formattedText = highlightedText
                    .replace(/<heading>(.*?)<\/heading>/gi, '<strong>$1</strong>')
                    .replace(/\n\s*\n/g, '\n');  // Remove extra line breaks

                // Create result HTML
                let resultContent = `
                    <div class="result">
                        <strong>File:</strong> <a href="${file}" target="_blank">${file}</a><br>
                        <pre style="white-space: pre-wrap; font-size: 12px;">${formattedText}</pre>
                        <hr>
                    </div>
                `;

                // Append to results
                resultsDiv.innerHTML += resultContent;
                resultsFound = true;
            } else {
                console.log(`🚫 No matches found in ${file}`);
            }
        }
    }

    if (!resultsFound) {
        console.log("🚫 No matches found in any files.");
        resultsDiv.innerHTML = `<p>No matches found.</p>`;
    }
}
