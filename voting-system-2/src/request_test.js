async function viewPoll(_pollId) {
    const pollId = { pollId: _pollId }; // Replace with an actual poll ID

    try {
        const response = await fetch('http://localhost:5000/view_poll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pollId),
        });

        const data = await response.json();

        console.log("Response Status:", response.status);
        console.log("Response Data:", data.message);

        if (response.ok) {
            console.log("Request was successful!");
        } else {
            console.error("Request failed!");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

viewPoll("9aaad641f66735b9c8879a0e8fa85089ed492003fe3eb8efafbdd03b050c1973");
