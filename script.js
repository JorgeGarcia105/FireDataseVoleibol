// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let voted = localStorage.getItem("voted") || false;

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


function vote(name) {
    if (!voted) {
        let docRef = db.collection("nombres").doc(name);
        docRef.get().then((doc) => {
            if (doc.exists) {
                let newVotes = doc.data().votos + 1;
                docRef.update({ votos: newVotes }).then(() => {
                    localStorage.setItem("voted", true);
                    voted = true;
                    renderNames();
                });
            }
        });
    } else {
        alert("Ya has votado");
    }
}

function renderNames() {
    let list = document.getElementById("nameList");
    list.innerHTML = "";
    db.collection("nombres").orderBy("votos", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let li = document.createElement("li");
            li.innerHTML = `${doc.id} - ${doc.data().votos} votos <button onclick="vote('${doc.id}')">Votar</button>`;
            list.appendChild(li);
        });
    });
}

renderNames();