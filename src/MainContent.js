import FlipCard from "./FlipCard";
import Pagination from "./Pagination";
import React, { useState, useEffect } from "react";
import "./MainContent.css";

function MainContent({ username }) {
  const [selections, setSelections] = useState({});
  const [dataRows, setDataRows] = useState([]);
  const [cardOrders, setCardOrders] = useState({});

  const handleRadioChange = (rowId, conversationId, event) => {
    const selection = event.target.value;
    setSelections((prev) => ({
      ...prev,
      [rowId]: { [conversationId]: selection },
    }));
  };

  const handleSubmit = () => {
    const formattedSelections = Object.keys(selections).flatMap((rowId) => {
      return Object.keys(selections[rowId]).map((conversationId) => {
        return {
          rowId,
          conversationId,
          selection: selections[rowId][conversationId],
        };
      });
    });

    fetch("http://localhost:8888/submitSelections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        selections: formattedSelections,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetch("http://localhost:8888/dataRows")
      .then((response) => response.json())
      .then((data) => {
        setDataRows(
          data.map((row, index) => ({
            ...row,
            id: index + 1,
          }))
        );
        const orders = {};
        data.forEach((row, index) => {
          // Decide order here: 50% chance for either order
          orders[row.id] = Math.random() > 0.5 ? "normal" : "reversed";
        });
        setCardOrders(orders);
      })
      // .then((data) => {
      //   const firstFiveRows = data.slice(0, 5).map((row, index) => ({
      //     ...row,
      //     id: index + 1,
      //   }));
      //   setDataRows(firstFiveRows);
      // })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Calculate total pages
  const totalPages = Math.ceil(dataRows.length / rowsPerPage);

  // Change Page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Slice data for current page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = dataRows.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="main-content">
      {currentRows.map((row) => (
        <div key={row.id} className="row">
          <FlipCard
            frontContent={row.input}
            backContent={row.text_to_replace}
          />
          {cardOrders[row.id] === "normal" ? (
            <>
              <FlipCard frontContent=" " backContent={row.output} />
              <FlipCard
                frontContent=" "
                backContent={row.convert_back_output}
              />
            </>
          ) : (
            <>
              <FlipCard
                frontContent=" "
                backContent={row.convert_back_output}
              />
              <FlipCard frontContent=" " backContent={row.output} />
            </>
          )}
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name={`response-${row.id}`}
                value="A"
                onChange={(event) =>
                  handleRadioChange(row.id, row.conversation_id, event)
                }
              />{" "}
              Answer 1 is much better
            </label>
            <label>
              <input
                type="radio"
                name={`response-${row.id}`}
                value="B"
                onChange={(event) =>
                  handleRadioChange(row.id, row.conversation_id, event)
                }
              />{" "}
              Answer 2 is much better
            </label>
            <label>
              <input
                type="radio"
                name={`response-${row.id}`}
                value="C"
                onChange={(event) =>
                  handleRadioChange(row.id, row.conversation_id, event)
                }
              />{" "}
              Answer 1 is slightly better
            </label>
            <label>
              <input
                type="radio"
                name={`response-${row.id}`}
                value="B"
                onChange={(event) =>
                  handleRadioChange(row.id, row.conversation_id, event)
                }
              />{" "}
              Answer 2 is slightly better
            </label>
            <label>
              <input
                type="radio"
                name={`response-${row.id}`}
                value="E"
                onChange={(event) =>
                  handleRadioChange(row.id, row.conversation_id, event)
                }
              />{" "}
              Answer 1 and 2 are similar
            </label>
          </div>
        </div>
      ))}
      <div className="bottom-controls">
        {currentPage < totalPages && (
          <button className="submit-button" onClick={handleSubmit}>
            Submit and Next Page
          </button>
        )}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={goToPage}
        />
      </div>
    </div>
  );
}

export default MainContent;
