import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

function StartFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyDKWKb6KTSrboFu2oxfcn8nzswWrLkrSBk",
        authDomain: "duchanhdental-aaed2.firebaseapp.com",
        databaseURL: "https://duchanhdental-aaed2-default-rtdb.firebaseio.com",
        projectId: "duchanhdental-aaed2",
        storageBucket: "duchanhdental-aaed2.appspot.com",
        messagingSenderId: "143973671748",
        appId: "1:143973671748:web:74826637868fc27ed1ad11",
        measurementId: "G-0N4DDX0WJ9"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    return getDatabase(app);
}

export default StartFirebase;