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
 * @returns {Document|null} - The parsed XML document or null if loading failed.
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
        const text = await response.text();
        return (new window.DOMParser()).parseFromString(text, "application/xml");
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
 * Displays the matching **elements only**, grouped by file path with bold headings and highlighted text.
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

    // 🗂️ **Group results by file path**
    const groupedResults = {};

    // Iterate over all folders and files
    for (let folder of folders) {
        for (let file of folder.files) {
            console.log(`🔄 Searching in file: ${file}`);

            const xmlDoc = await loadXML(file);
            if (!xmlDoc) {
                console.error(`❌ Loading failed for: ${file}`);
                continue;
            }

            const textElements = xmlDoc.getElementsByTagName('text');

            for (let element of textElements) {
                if (element.textContent.toLowerCase().includes(input)) {
                    console.log(`✅ Match found in ${file}`);
                    
                    const parent = element.parentNode;
                    const heading = parent.getElementsByTagName('heading')[0]?.textContent || "No Heading";
                    const highlightedText = highlightAllOccurrences(element.textContent, input);

                    if (!groupedResults[file]) {
                        groupedResults[file] = [];
                    }

                    groupedResults[file].push(`
                        <strong>${heading}</strong><br>
                        <pre style="white-space: pre-wrap; font-size: 12px;">${highlightedText}</pre>
                        <hr>
                    `);

                    resultsFound = true;
                }
            }
        }
    }

    // 📝 **Render Grouped Results**
    Object.keys(groupedResults).forEach((file) => {
        const combinedResults = groupedResults[file].join("");
        let resultContent = `
            <div class="result">
                <strong>File:</strong> <a href="${file}" target="_blank">${file}</a><br>
                ${combinedResults}
            </div>
        `;
        resultsDiv.innerHTML += resultContent;
    });

    if (!resultsFound) {
        console.log("🚫 No matches found in any files.");
        resultsDiv.innerHTML = `<p>No matches found.</p>`;
    }
}

/**
 * Summary:
 * Downloads the search results as a `.txt` file.
 */
function downloadResults() {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv.innerHTML.trim()) {
        alert("No results to download!");
        return;
    }

    let textContent = "";
    const results = resultsDiv.querySelectorAll(".result");

    results.forEach((result) => {
        const filePath = result.querySelector("a").textContent;
        textContent += `===========================\n`;
        textContent += `File: ${filePath}\n`;
        textContent += `===========================\n\n`;

        // Grab all the sections within the result
        const sections = result.querySelectorAll("pre");
        sections.forEach((section) => {
            textContent += section.textContent + "\n\n";
        });
    });

    // Create a downloadable file
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `Search_Results.txt`;
    link.click();

    // Clean up the object URL
    URL.revokeObjectURL(url);
}
