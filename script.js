document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("bpmButton");
    const backButton = document.getElementById("backButton");
    const inputField = document.getElementById("playlistUrl");
    const table = document.querySelector("table");
    const resultsHeading = document.getElementById("resultsHeading");

    button.addEventListener("click", async () => {
        const playlistUrl = inputField.value;
        if (!playlistUrl) return alert("Por favor, insira um link válido!");

        document.getElementById("loading").style.display = "block";

        try {
            const response = await fetch(`http://localhost:3000/playlist/bpm?playlistUrl=${playlistUrl}`);
            const data = await response.json();

            const tableBody = table.querySelector("tbody");
            tableBody.innerHTML = "";

            data.forEach(track => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${track.name}</td><td>${track.bpm}</td>`;
                tableBody.appendChild(row);
            });

            table.style.display = "table";
            backButton.style.display = "block";
            resultsHeading.style.display = "block";
            inputField.style.display = "none";
            button.style.display = "none";
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            document.getElementById("loading").style.display = "none";
        }
    });

    backButton.addEventListener("click", () => {
        table.style.display = "none";
        backButton.style.display = "none";
        resultsHeading.style.display = "none";
        inputField.style.display = "block";
        inputField.value = "";
        button.style.display = "block";
    });
});
