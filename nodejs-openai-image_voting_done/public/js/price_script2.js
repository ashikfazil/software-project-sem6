fetch('https://api.coincap.io/v2/assets?limit=10')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch cryptocurrency data');
        }
        return response.json();
    })
    .then(data => {
        const cryptoList = document.getElementById('cryptoList');

        data.data.forEach(crypto => {
            const cryptoItem = document.createElement('div');
            cryptoItem.classList.add('crypto-item');
            cryptoItem.innerHTML = `
                <h2>${crypto.name}</h2>
                <p>Symbol: ${crypto.symbol}</p>
                <p>Price: $${parseFloat(crypto.priceUsd).toFixed(2)}</p>
                <p>Market Cap: $${parseFloat(crypto.marketCapUsd).toFixed(2)}</p>
            `;
            cryptoList.appendChild(cryptoItem);
        });
    })
    .catch(error => console.error('Error fetching cryptocurrency data:', error));
