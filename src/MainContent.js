import FlipCard from "./FlipCard";
import Pagination from "./Pagination";
import React, { useState, useEffect } from "react";
import "./MainContent.css";
import Papa from "papaparse";

function MainContent({ username, file }) {
  const [selections, setSelections] = useState({});
  const [dataRows, setDataRows] = useState([]);
  const [cardOrders, setCardOrders] = useState({});
  const [outputCSV, setOutputCSV] = useState("");
  const [committedSelections, setCommittedSelections] = useState({});

  const handleRadioChange = (rowId, conversationId, event) => {
    const newSelection = event.target.value;
    setSelections((prev) => ({
      ...prev,
      [`${rowId}-${conversationId}`]: newSelection,
    }));
    setCommittedSelections((prev) => ({
      ...prev,
      [`${rowId}-${conversationId}`]: newSelection,
    }));
  };

  const handleSubmit = () => {
    const headers = "RowID,ConversationID,Selection\n";
    const finalCSVContent = dataRows
      .map((row) => {
        const selectionKey = `${row.id}-${row.conversation_id}`;
        const selection = committedSelections[selectionKey] || ""; // Use committed selections
        return `${row.id},${row.conversation_id},${selection}`;
      })
      .join("\n");

    setOutputCSV(headers + finalCSVContent);
    downloadCSV(headers + finalCSVContent, `${username}_selections.csv`);
    // Optionally reset state here if needed
    setSelections({});
  };

  const downloadCSV = (csvString, filename) => {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          setDataRows(
            results.data.map((row, index) => ({
              ...row,
              id: index + 1,
            }))
          );
        },
        header: true,
      });
    }
  }, [file]);

  useEffect(() => {
    if (dataRows.length > 0) {
      const headers = "RowID,ConversationID,Selection\n";
      const initialCSVContent = dataRows
        .map((row) => `${row.id},${row.conversation_id},`)
        .join("\n");
      setOutputCSV(headers + initialCSVContent);
    }
  }, [dataRows]);

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
          <div className="last-column">
            <div className="row-id-info">row_id:{row.id}</div>
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
                  value="D"
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
        </div>
      ))}
      <div className="bottom-controls">
        <button className="submit-button" onClick={handleSubmit}>
          Submit and Download CSV
        </button>
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
