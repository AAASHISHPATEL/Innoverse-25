import React, { useState, useEffect } from "react";
import "./WinnerPage.css";

function WinnerPage() {
  const [passcodeInput, setPasscodeInput] = useState("");
  const [winner, setWinner] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [message, setMessage] = useState("");

  const correctPasscode = "WINNER";

  // Fetch winner from backend when component mounts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/winner/")
      .then((response) => response.json())
      .then((data) => {
        if (data.winner) {
          setWinner(true);

          setWinnerName(data.winner);
          console.log(data.winner);
          setMessage(`Winner already declared: ${data.winner}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching winner:", error);
      });
  }, []);

  const handleSubmit = () => {
    // If a winner already exists, prevent another submission
    if (winner) {
      setMessage(`Passcode already claimed by ${winnerName}`);
      return;
    }
    if (passcodeInput === correctPasscode) {
      // Post winner to backend (you can replace "Winner" with a dynamic name if needed)
      fetch("http://127.0.0.1:8000/api/winner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ winner: "Winner" }),
      })
        .then((response) => response.json())
        .then((data) => {
          setWinner(true);
          setWinnerName(data.winner);
          setMessage("Hurray! You won!");
        })
        .catch((error) => {
          console.error("Error saving winner:", error);
          setMessage("Error saving winner. Try again!");
        });
    } else {
      setMessage("Incorrect passcode. Try again!");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative mt-12">
      <div className="img-container bg-black relative z-10">
        <img src="../../../../TreasurePhotopng1.png" alt="TreasurePhoto" />
        {winner && (
          <div className="winner-overlay">
            <h1 className="winner-text">{message}</h1>
          </div>
        )}
      </div>
      <div className="row mt-4">
        {message && (
          <div className="message mt-4">
            <p className="text-white">{message}</p>
          </div>
        )}
        <span>
          <input
            className="gate"
            id="element"
            type="text"
            placeholder="Enter PassCode to Win"
            value={passcodeInput}
            onChange={(e) => setPasscodeInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <label htmlFor="element">PassCode</label>
        </span>
        <button className="btn bg-[#377d6a]" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default WinnerPage;
