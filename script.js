// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBn6X6t3pKH8zwH_xCbfKcawGvCjq0gcUE",
  authDomain: "empresasgarcia-49301.firebaseapp.com",
  projectId: "empresasgarcia-49301",
  storageBucket: "empresasgarcia-49301.firebasestorage.app",
  messagingSenderId: "479782174196",
  appId: "1:479782174196:web:989b36ebec3ae2d0a24da1",
  measurementId: "G-Y9ZBCE6ZW4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Verificar si el usuario ya votó
let voted = localStorage.getItem("voted") === "true"; // Asegura que sea booleano

// Agregar un nuevo nombre a la lista
document.getElementById("addNameBtn").addEventListener("click", async () => {
    let newName = document.getElementById("newName").value.trim();
    if (newName) {
        try {
            await setDoc(doc(db, "nombres", newName), { votos: 0 }, { merge: true });
            console.log("✅ Documento creado:", newName);
            document.getElementById("newName").value = "";
            renderNames();
        } catch (error) {
            console.error("❌ Error al guardar:", error);
        }
    }
});

// Función para votar
async function vote(name) {
    if (!voted) {
        let docRef = doc(db, "nombres", name);

        try {
            let docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let newVotes = (docSnap.data().votos || 0) + 1;
                await updateDoc(docRef, { votos: newVotes });

                localStorage.setItem("voted", "true"); // Guarda correctamente
                voted = true;
                renderNames();
            }
        } catch (error) {
            console.error("❌ Error al votar:", error);
        }
    } else {
        alert("Ya has votado");
    }
}

// Hacer accesible la función vote() en los botones
window.vote = vote;

// Función para mostrar los nombres y votos
async function renderNames() {
    let list = document.getElementById("nameList");
    list.innerHTML = "";

    try {
        const querySnapshot = await getDocs(query(collection(db, "nombres"), orderBy("votos", "desc")));
        querySnapshot.forEach((doc) => {
            let li = document.createElement("li");
            li.innerHTML = `${doc.id} - ${doc.data().votos} votos <button onclick="vote('${doc.id}')">Votar</button>`;
            list.appendChild(li);
        });
    } catch (error) {
        console.error("❌ Error al obtener los nombres:", error);
    }
}

// Cargar la lista al inicio
renderNames();
