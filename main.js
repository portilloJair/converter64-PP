let mainJSON = "";

window.onload = function () {
    console.log("La pagina cargo");
};

function scanJson() {
    const $fileSection = document.getElementById("files-section");

    mainJSON = "";
    $fileSection.innerHTML = "";
    const $txtArea = document.getElementById("txtArea");

    if (!validateJson($txtArea.value)) {
        alert("JSON NO VALIDO!");
        return;
    }

    mainJSON = JSON.parse($txtArea.value);

    if (mainJSON.archivos <= 0) {
        alert("El json no contiene archivos para analizar");
        return;
    }

    for (const archivo of mainJSON.archivos) {
        const $newDiv = document.createElement("div");
        $newDiv.id = "file-container";

        const $newLabel = document.createElement("label");
        $newLabel.textContent = archivo.nombre.substring(0, 6) + "..";

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
        alert("No hay ningun JSON para generar.");
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
