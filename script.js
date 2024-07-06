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

function highlightText(text, searchText) {
    const index = text.toLowerCase().indexOf(searchText);
    if (index === -1) return text;

    const beforeMatch = text.substring(0, index);
    const match = text.substring(index, index + searchText.length);
    const afterMatch = text.substring(index + searchText.length);

    return `${beforeMatch}<span style="background-color: yellow;">${match}</span>${afterMatch}`;
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
                    let content = '';

                    for (let child of items[i].childNodes) {
                        if (child.nodeType === Node.ELEMENT_NODE) {
                            content += `<strong>${child.nodeName}:</strong> ${highlightText(child.textContent, input)}<br>`;
                        }
                    }

                    result.innerHTML = `<strong>File:</strong> ${file} <br><strong>Element:</strong> ${items[i].nodeName} <br> ${content}`;
                    resultsDiv.appendChild(result);
                }
            }
        }
    }
}
