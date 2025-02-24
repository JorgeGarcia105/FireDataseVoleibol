import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDocs, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let voted = localStorage.getItem("voted") || false;

document.getElementById("addNameBtn").addEventListener("click", async () => {
    let newName = document.getElementById("newName").value.trim();
    if (newName) {
        await setDoc(doc(db, "nombres", newName), { votos: 0 }, { merge: true });
        document.getElementById("newName").value = "";
        renderNames();
    }
});

async function vote(name) {
    if (!voted) {
        const nameDoc = doc(db, "nombres", name);
        const snapshot = await getDocs(collection(db, "nombres"));
        snapshot.forEach(async (docSnap) => {
            if (docSnap.id === name) {
                let newVotes = docSnap.data().votos + 1;
                await updateDoc(nameDoc, { votos: newVotes });
                localStorage.setItem("voted", true);
                voted = true;
                renderNames();
            }
        });
    } else {
        alert("Ya has votado");
    }
}

async function renderNames() {
    let list = document.getElementById("nameList");
    list.innerHTML = "";
    const snapshot = await getDocs(collection(db, "nombres"));
    snapshot.forEach((docSnap) => {
        let li = document.createElement("li");
        li.innerHTML = `${docSnap.id} - ${docSnap.data().votos} votos <button onclick="vote('${docSnap.id}')">Votar</button>`;
        list.appendChild(li);
    });
}

renderNames();
