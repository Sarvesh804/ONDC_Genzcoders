function sendPin() {
    var pin = parseInt(document.getElementById("pinInput").value);

    // Check if the pin is 6 digits
    if (/^\d{6}$/.test(pin)) {
        // Send the pin to the backend
        fetch('http://localhost:3000/check-serviceability', {
            method: 'POST',
            body: JSON.stringify({ pincode: pin }), // Corrected key name to match server-side
            headers: {
                'Content-Type': 'application/json'
            }
        })
            // .then(response => response.json())
            // .then(data => {
            //     console.log(data); // Log the response data


            //     // Parse the inner JSON string

            //     document.getElementById("response").textContent = response;
            // })
            .then(response => response.json())
            .then(data => {
                console.log(data); // Log the response data

                // Parse the JSON string within the "results" property
                const results = JSON.parse(data.results);

                // Create a table to display the merchants
                let tableHTML = '<table>';
                tableHTML += '<tr><th>Merchants</th></tr>';
                results.merchants.forEach(merchant => {
                    tableHTML += `<tr><td>${merchant}</td></tr>`;
                });
                tableHTML += '</table>';

                // Display the table in the response element
                document.getElementById("response").innerHTML = tableHTML;
            })



            .catch(error => console.error('Error:', error));
    } else {
        // If not 6 digits, show error message
        document.getElementById("response").textContent = "Please enter a 6-digit pin code.";
    }
    console.log(typeof (pin));
}
