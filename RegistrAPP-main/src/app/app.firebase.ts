import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";

//Importaciones base de datos Firestore
import { doc, getFirestore, setDoc } from "firebase/firestore";

//uuid: generación de id
import { v4 as uuidv4 } from 'uuid';

export class Firebase {

    firebaseInit() {
        const firebaseConfig = {
            apiKey: "AIzaSyANcK22181t9V1MryxPhA-OSxbnk8k4HEA",
            authDomain: "registrapp-e0992.firebaseapp.com",
            projectId: "registrapp-e0992",
            storageBucket: "registrapp-e0992.appspot.com",
            messagingSenderId: "395703734187",
            appId: "1:395703734187:web:1788a80cdbca430622ccee",
            measurementId: "G-95DZ03J7V2"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        getAnalytics(app);
    }

    async signinUser(email: string, password: string) {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
        } catch (error) {
            return false;
        }
        return true;
    }

    async sigoutUser() {
        try {
            await signOut(getAuth());
        } catch (error) {
            console.log('Ocurrió un error al salir de la sesión' + error)
        }
    }

    obtenerInfoUserActivo() {
        const auth = getAuth();
        const user = auth.currentUser;

        if(user != null) {
            return user.uid;
        } else {
            console.log('Ningun usuario inició sesión')
            return 'none'
        }
    }

    async recuperarContrasena(email: string) {
        try {
            await sendPasswordResetEmail(getAuth(), email)
        } catch (error) {
            return false;
        }
        return true;
    }

    //CRUD FireStore
    async registrarAsistencia(id_user: string, sigla_asignatura: string) {
        let referencia = doc(getFirestore(), 'asistencia', uuidv4());
        try {
            await setDoc(referencia, {
                alumno: `usuario/${id_user}`,
                asignatura: `asignatura/${sigla_asignatura}`,
                asistencia: 'Presente',
                fecha_inicio: new Date().toLocaleDateString()
            });
        } catch (error) {
            console.log(error);
            return false;
        }
        return true;
    }

}