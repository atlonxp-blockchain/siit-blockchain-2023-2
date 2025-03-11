if (typeof web3 !== 'undefined') {
  const loginButton = document.getElementById('connect-metamask'); //เอาไว้ Bind กับปุ่มสำหรับ connect metamask กดปุ๊ปมันจะ Trigger Metamask ให้เอง

  loginButton.addEventListener('click', async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];

      // Create a new XMLHttpRequest object
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/authenticate', true); //อันนี้เอาไว้ส่ง Address เข้า Endpoint เผื่อเอาไว้ใช้ต่อเช่นทำ Session, คำนวณหาจำนวน ETH, และอื่นๆตามที่ต้องการ
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

      // Create a JSON object with the user's Ethereum address
      const userData = { userAddress };

      // Send the Ethereum address as JSON in the request body
      xhr.send(JSON.stringify(userData));

      // Redirect the user after the request is sent
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          window.location.href = 'officer_homepage'; //อันนี้เวลาถ้า Log in ผ่าน Metamask สำเร็จแล้วจะให้ Redirect ไปหน้าไหน endpoint ไหน
          console.log(`Logged in with address: ${userAddress}`);
        }
      };
    } catch (error) {
      console.error('Error logging in with MetaMask:', error);
    }
  });
} else {
  console.error('MetaMask is not installed.');
}
