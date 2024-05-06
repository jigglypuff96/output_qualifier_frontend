import FlipCard from "./FlipCard";
import Pagination from "./Pagination";
import Popup from "./Popup";
import React, { useState, useEffect } from "react";
import "./MainContent.css";
import Papa from "papaparse";

function MainContent({ username, file }) {
  const [showPopup, setShowPopup] = useState(true);

  const [selections, setSelections] = useState({});
  const [dataRows, setDataRows] = useState([]);
  const [cardOrders, setCardOrders] = useState({});
  const [outputCSV, setOutputCSV] = useState("");
  const [committedSelections, setCommittedSelections] = useState({});
  const [inputFirstShown, setInputFirstShown] = useState({});
  const [necessityChoices, setNecessityChoices] = useState({});

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
  const handleNecessityChange = (rowId, conversationId, event) => {
    const necessity = event.target.value;
    setNecessityChoices((prev) => ({
      ...prev,
      [`${rowId}-${conversationId}`]: necessity,
    }));
  };

  const handleSubmit = () => {
    const headers =
      "RowID,ConversationID,Sequence,Selection,Necessity,TextToReplace\n";
    const finalCSVContent = dataRows
      .map((row) => {
        const selectionKey = `${row.id}-${row.conversation_id}`;
        const selection = selections[selectionKey] || "";
        const necessity = necessityChoices[selectionKey] || "";
        return `${row.id},${row.conversation_id},${row.sequence},${selection},${necessity},${row.text_to_replace}`;
      })
      .join("\n");

    setOutputCSV(headers + finalCSVContent);
    downloadCSV(headers + finalCSVContent, `${username}_selections.csv`);
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
          const uniqueKeys = new Set(); // To track unique combinations
          const filteredAndMappedData = results.data
            .filter((row) => {
              const key = `${row.conversation_id}-${row.text_to_replace}`;
              if (
                row.conversation_id &&
                row.conversation_id.length > 0 &&
                !uniqueKeys.has(key)
              ) {
                uniqueKeys.add(key);
                return true;
              }
              return false;
            })
            .map((row, index) => ({
              ...row,
              id: index + 1,
            }));

          setDataRows(filteredAndMappedData);
        },
        header: true,
      });
    }
  }, [file]);

  useEffect(() => {
    if (dataRows.length > 0) {
      const newInputMessage = [];
      dataRows.forEach((row, index) => {
        if (
          (index > 0 && row.input !== dataRows[index - 1].input) ||
          index === 0
        ) {
          newInputMessage[row.id] = true;
        }
      });
      setInputFirstShown(newInputMessage);
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

  const options = [
    { value: "A", label: "Answer 1 is much better" },
    { value: "B", label: "Answer 2 is much better" },
    { value: "C", label: "Answer 1 is slightly better" },
    { value: "D", label: "Answer 2 is slightly better" },
    { value: "E", label: "Answer 1 and 2 are similar" },
  ];

  return (
    <div className="main-content">
      <Popup isOpen={showPopup} onClose={() => setShowPopup(false)}>
        <p>
          Info:
          <br />
          1st column card is the input message.
          <br />
          Flip 2nd and 3rd column cards to see answer 1 and 2 of the input
          message.
          <br />
          Red card = place you need to decide whether the PII redaction is
          necessary. redaction is necessary. Flip that red card to see the
          redacted inpu. Make your selections in the last column. Once you made
          your selection, the card will turn green.
          <br />
          Only flip 1st column card when seeing rows asking whether the PII
          redaction is necessary.
          <br />
          Remember to click "Submit and Download CSV" button to save your
          responses!
        </p>
      </Popup>
      {currentRows.map((row) => (
        <div key={row.id} className="row">
          <FlipCard
            frontContent={
              inputFirstShown[row.id] ? (
                <>
                  <span style={{ color: "red" }}>{"[NEW INPUT!]"}</span>
                  <br />
                  {row.input}
                </>
              ) : (
                <>
                  {"[SAME AS ABOVE]"}
                  <br />
                  {row.input}
                </>
              )
            }
            backContent={
              <>
                {"REDACTED INPUT:"}
                <br />
                {row.redacted_input}
                <br />
                <br />
                {"PII:"}
                <br />
                {row.text_to_replace}
              </>
            }
            additionalStyles={{
              backgroundColor: necessityChoices[
                `${row.id}-${row.conversation_id}`
              ]
                ? "#cbeebf"
                : "transparent",
            }}
          />
          {row.sequence === "AB" ? (
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
            <div className="row-id-info">#{row.id}</div>
            <div className="comparison-button radio-group">
              {options.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name={`response-${row.id}`}
                    value={option.value}
                    checked={
                      selections[`${row.id}-${row.conversation_id}`] ===
                      option.value
                    }
                    onChange={(event) =>
                      handleRadioChange(row.id, row.conversation_id, event)
                    }
                  />{" "}
                  {option.label}
                </label>
              ))}
            </div>
            <div className="necessary-question">
              Is the PII redaction necessary?
            </div>
            <div className="necessary-buttons radio-group">
              <label>
                <input
                  type="radio"
                  name={`decision-${row.id}`}
                  value="necessary"
                  checked={
                    necessityChoices[`${row.id}-${row.conversation_id}`] ===
                    "necessary"
                  }
                  onChange={(event) =>
                    handleNecessityChange(row.id, row.conversation_id, event)
                  }
                />{" "}
                Necessary
              </label>
              <label>
                <input
                  type="radio"
                  name={`decision-${row.id}`}
                  value="unnecessary"
                  checked={
                    necessityChoices[`${row.id}-${row.conversation_id}`] ===
                    "unnecessary"
                  }
                  onChange={(event) =>
                    handleNecessityChange(row.id, row.conversation_id, event)
                  }
                />{" "}
                Unnecessary
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
