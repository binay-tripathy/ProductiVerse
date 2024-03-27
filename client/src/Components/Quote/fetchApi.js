async function fetchApi() {
    try {
        let proxyUrl = 'https://api.allorigins.win/get?url=';
        let apiUrl = 'https://zenquotes.io/api/random/';
        let response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        let data = await response.json();
        
        let responseData = JSON.parse(data.contents);
        
        return responseData;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Optionally rethrow the error if needed
    }
}

export default fetchApi;
