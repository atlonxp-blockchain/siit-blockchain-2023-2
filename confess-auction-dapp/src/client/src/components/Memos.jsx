import { useState, useEffect } from "react";
import "./Memos.css"; // Make sure this path is correct

const Memos = ({ state }) => {
    const [memos, setMemos] = useState([]);
    const { contract } = state;

    useEffect(() => {
        const fetchMemos = async () => {
          if (contract) {
            const fetchedMemos = await contract.getMemos();
            setMemos(fetchedMemos);
          }
        };
        fetchMemos();
    }, [contract]);

    return (
        <div className="memos-container">
            <h3 className="memos-title">Confessed List</h3>
            <table className="memos-table">
                <tbody>
                    {memos.map((memo) => (
                        <tr key={memo.id}> {/* Assuming each memo has a unique 'id' */}
                            <td className="memo-name">{memo.name}</td>
                            <td className="memo-timestamp">{new Date(memo.timestamp * 1000).toLocaleString()}</td>
                            <td className="memo-message">{memo.message}</td>
                            <td className="memo-from">{memo.from}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Memos;
