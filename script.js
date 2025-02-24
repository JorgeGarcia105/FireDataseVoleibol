import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Firebase

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let voted = localStorage.getItem("voted") || false;

function addName() {
    let newName = document.getElementById("newName").value.trim();
    if (newName) {
        db.collection("nombres").doc(newName).set({ votos: 0 }, { merge: true })
        .then(() => {
            document.getElementById("newName").value = "";
            renderNames();
        });
    }
}

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