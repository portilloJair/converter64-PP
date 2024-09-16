let mainJSON = "";

function updateTheme() {
  const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

    console.log(colorMode)
  if (colorMode == 'dark') {
    document.getElementById("iconSun").style.display = "";
    document.getElementById("iconMoon").style.display = "none";
  } else {
    document.getElementById("iconMoon").style.display = "";
    document.getElementById("iconSun").style.display = "none";
  }
  document.querySelector("html").setAttribute("data-bs-theme", colorMode);
}

updateTheme();

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", updateTheme);

window.onload = function () {
  console.log("La pagina cargo");
};

function toggleTheme(){
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme','light')
        document.getElementById("iconSun").style.display = "none"
        document.getElementById("iconMoon").style.display = ""
    }
    else {
        document.documentElement.setAttribute('data-bs-theme','dark')
        document.getElementById("iconMoon").style.display = "none"
        document.getElementById("iconSun").style.display = ""
    }
}

function scanJson() {
    const $fileSection = document.getElementById("files-section");

    mainJSON = "";
    $fileSection.innerHTML = "";
    const $txtArea = document.getElementById("txtArea");

    if (!validateJson($txtArea.value)) {
        alert("❌ JSON NO VALIDO!");
        return;
    }

    mainJSON = JSON.parse($txtArea.value);

    if (mainJSON.archivos <= 0) {
        alert("❌ El json no contiene archivos para analizar");
        return;
    }

    for (const archivo of mainJSON.archivos) {
        const extension = archivo.nombre.substring(archivo.nombre.lastIndexOf('.') + 1);
        const $newDiv = document.createElement("div");
        $newDiv.id = "file-container";
        $newDiv.className = "list-group-item list-group-item-light list-group-item-action d-flex justify-content-between";

        const $newSpan = document.createElement("span")
        
        if(extension.toLowerCase() == "pdf"){
            $newSpan.className = "badge text-bg-danger";
            $newSpan.textContent = "PDF";
        }else if(extension.toLowerCase() == "zip"){
            $newSpan.className = "badge text-bg-success";
            $newSpan.textContent = "ZIP";
        }else if(extension.toLowerCase() == "docx"){
            $newSpan.className = "badge text-bg-primary";
            $newSpan.textContent = "WORD";
        }else{
            $newSpan.className = "badge text-bg-primary";
            $newSpan.textContent = "OTHER";
        }

        const $newLabel = document.createElement("label");
        const textNode = document.createTextNode(" "+archivo.nombre);
        $newLabel.appendChild($newSpan);
        $newLabel.appendChild(textNode);

        // $newLabel.textContent = archivo.nombre.length > 80 ? archivo.nombre.substring(0, 80) + ".." : archivo.nombre;

        const $newInput = document.createElement("input");
        $newInput.type = "file";
        $newInput.id = archivo.nombre;

        $newDiv.appendChild($newLabel);
        $newDiv.appendChild($newInput);

        $fileSection.appendChild($newDiv);

        $newInput.addEventListener("change", (e) => {
            // console.log('OBTENIENDO BASE 64 DE ' + archivo.nombre)
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function (event) {
                    const base64String = event.target.result.split(",")[1];
                    archivo.archivoBase64 = base64String;
                };

                reader.readAsDataURL(file);
            } else {
            }
        });
    }
    // archivo.archivoBase64 = "Prueba"
}

function generateJson() {
    if (mainJSON == "") {
        alert("❌ No hay ningun JSON para generar.");
        return;
    }
    console.log(mainJSON.archivos);
    const newJson = JSON.stringify(mainJSON, null, 2);
    const blob = new Blob([newJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newRequest.json";
    a.click();
    URL.revokeObjectURL(url);
}

// Utility
function validateJson(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (e) {
        return false;
    }
}
