// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBn6X6t3pKH8zwH_xCbfKcawGvCjq0gcUE",
  authDomain: "empresasgarcia-49301.firebaseapp.com",
  projectId: "empresasgarcia-49301",
  storageBucket: "empresasgarcia-49301.firebasestorage.app",
  messagingSenderId: "479782174196",
  appId: "1:479782174196:web:989b36ebec3ae2d0a24da1",
  measurementId: "G-Y9ZBCE6ZW4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configurar horario de votación (10:00 AM - 10:00 PM)
const START_HOUR = 10;  // 10:00 AM
const END_HOUR = 22;   // 10:00 PM

let voted = localStorage.getItem("voted") === "true";

// Función para verificar si se puede votar
function isVotingAllowed() {
    let currentHour = new Date().getHours();
    return currentHour >= START_HOUR && currentHour < END_HOUR;
}

// Actualizar mensaje de estado
function updateStatusMessage() {
    let statusMessage = document.getElementById("statusMessage");
    let horario = `🕒 Horario de votación: ${START_HOUR}:00 AM - ${END_HOUR}:00 PM`;

    if (isVotingAllowed()) {
        statusMessage.innerHTML = `✅ La votación está abierta. <br> ${horario}`;
        statusMessage.style.color = "green";
    } else {
        statusMessage.innerHTML = `⏳ La votación está cerrada. <br> ${horario}`;
        statusMessage.style.color = "red";
    }
}

// Agregar un nuevo nombre (sin restricción horaria)
document.getElementById("addNameBtn").addEventListener("click", async () => {
    let newName = document.getElementById("newName").value.trim();
    if (newName) {
        try {
            await setDoc(doc(db, "nombres", newName), { votos: 0 });
            console.log("✅ Nombre agregado:", newName);
            document.getElementById("newName").value = "";
            renderNames();
        } catch (error) {
            console.error("❌ Error al guardar:", error);
        }
    }
});

// Función para votar
async function vote(name) {
    if (!isVotingAllowed()) {
        alert("❌ La votación solo está disponible de 10:00 AM a 10:00 PM.");
        return;
    }

    if (!voted) {
        let docRef = doc(db, "nombres", name);
        try {
            let docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let newVotes = (docSnap.data().votos || 0) + 1;
                await updateDoc(docRef, { votos: newVotes });

                localStorage.setItem("voted", "true");
                voted = true;
                renderNames();
            }
        } catch (error) {
            console.error("❌ Error al votar:", error);
        }
    } else {
        alert("⚠️ Ya has votado.");
    }
}

// Hacer accesible la función vote()
window.vote = vote;

// Renderizar lista de nombres y votos
async function renderNames() {
    let list = document.getElementById("nameList");
    list.innerHTML = "";

    try {
        const querySnapshot = await getDocs(query(collection(db, "nombres"), orderBy("votos", "desc")));
        querySnapshot.forEach((doc) => {
            let isEnabled = isVotingAllowed();
            let li = document.createElement("li");
            li.innerHTML = `<span>${doc.id} - ${doc.data().votos} votos</span> 
                <button onclick="vote('${doc.id}')" ${isEnabled ? "" : "disabled"}>${isEnabled ? "Votar" : "⏳ Cerrado"}</button>`;
            list.appendChild(li);
        });
    } catch (error) {
        console.error("❌ Error al obtener los nombres:", error);
    }
}

// Actualizar la lista y mensaje cada minuto
renderNames();
updateStatusMessage();
setInterval(() => {
    renderNames();
    updateStatusMessage();
}, 60000);
