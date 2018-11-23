// Utils para manejar los requests y responses de la API

export default class APIHandler {
    constructor(){
        
    }
    // Función asíncrona para manejar requests de tipo GET
    async getFromAPI(url) {
        try {const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    // Función asíncrona para manejar requests de tipo POST
    async postToAPI(url, body) {
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        return data;
    }

    // Función asíncrona para manejar requests de tipo PUT
    async putToAPI(url, body) {
        let response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let data = await response.json();
        return data;
    }
}