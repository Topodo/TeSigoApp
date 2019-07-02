// Utils para manejar los requests y responses de la API
import { SecureStore } from 'expo'

export default class APIHandler {
    constructor() {

    }
    // Función asíncrona para manejar requests de tipo GET
    async getFromAPI(url) {
        // Se obtiene el JWT obtenido desde el backend
        const token = await SecureStore.getItemAsync('api_tesigoapp_token')
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': token
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            const response = await fetch(url, {
                headers: {
                    'Authorization': token
                }
            });
            const data = await response.json();
            return data;
        }
    }

    // Función asíncrona para manejar requests de tipo POST
    async postToAPI(url, body) {
        // Se obtiene el JWT obtenido desde el backend
        const token = await SecureStore.getItemAsync('api_tesigoapp_token')
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const data = await response.json();
            return data;
        }
    }

    // Función que obtiene el token desde backend
    async getToken(uid) {
        try {
            const response = await fetch('http://206.189.195.214:8080/api/get_token?firebaseID=' + uid, {
                method: 'POST',
                body: JSON.stringify({}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            return data.token
        } catch (error) {
            const response = await fetch('http://206.189.195.214:8080/api/get_token?firebaseID=' + uid, {
                method: 'POST',
                body: JSON.stringify({}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            return data.token
        }
    }

    // Función asíncrona para manejar requests de tipo PUT
    async putToAPI(url, body) {
        // Se obtiene el JWT obtenido desde el backend
        const token = await SecureStore.getItemAsync('api_tesigoapp_token')
        try {
            const response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const data = await response.json();
            return data;
        } catch (error) {
            const response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const data = await response.json();
            return data;
        }
    }
}