const folders = [
    { year: 2018, files: ['collection/2018/18-AC-002.xml'] }
    // Add more years and file paths as needed
];

async function loadXML(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        console.error(`Failed to load XML file: ${filePath}`);
        return null;
    }
    const text = await response.text();
    return (new window.DOMParser()).parseFromString(text, "application/xml");
}

function searchInElement(element, searchText) {
    if (element.nodeType === Node.TEXT_NODE) {
        return element.nodeValue.toLowerCase().includes(searchText);
    }

    for (let i = 0; i < element.childNodes.length; i++) {
        if (searchInElement(element.childNodes[i], searchText)) {
            return true;
        }
    }

    return false;
}

async function searchXML() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    console.log(`Searching for: ${input}`);

    for (let folder of folders) {
        for (let file of folder.files) {
            const xml = await loadXML(file);
            if (!xml) {
                continue;
            }

            let items = xml.getElementsByTagName('*'); // Get all elements in the document
            for (let i = 0; i < items.length; i++) {
                if (searchInElement(items[i], input)) {
                    let result = document.createElement('div');
                    result.className = 'result';
                    result.innerHTML = `<strong>File:</strong> ${file} <br> <strong>Element:</strong> ${items[i].nodeName} <br> <strong>Content:</strong> ${items[i].textContent}`;
                    resultsDiv.appendChild(result);
                    break; // Once found, break to avoid duplicate results
                }
            }
        }
    }
}
