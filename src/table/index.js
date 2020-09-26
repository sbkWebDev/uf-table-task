import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

import service from "../service.js";

import "./table.css";

function Table() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const fetchRecords = () => {
    setIsLoading(true);
    service(
      `shipments?_page=${page}&_limit=${limit}&q=${searchQuery}&_sort=${sortColumn}&_order=${sortOrder}`
    )
      .then((res) => {
        setTotalRecords(parseInt(res.headers.get("X-Total-Count")));
        return res.json();
      })
      .then((jsonResponse) => {
        setErrorMsg("");
        setRecords(jsonResponse);
      })
      .catch((err) => {
        setErrorMsg(err.message || "Something went wrong, try again later");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const SortArrows = ({ columnName }) => (
    <span className="sort-arrows">
      <FontAwesomeIcon
        icon={faArrowUp}
        title="ASC"
        onClick={() => {
          setSortColumn(columnName);
          setSortOrder("asc");
        }}
      />
      <FontAwesomeIcon
        icon={faArrowDown}
        title="DESC"
        onClick={() => {
          setSortColumn(columnName);
          setSortOrder("desc");
        }}
      />
    </span>
  );

  const getTable = () => {
    if (isLoading) {
      return <img src={`${process.env.PUBLIC_URL}/assets/loader.gif`} alt="" />;
    }
    if (records.length) {
      return (
        <table>
          <thead>
            <tr>
              <th>
                {" "}
                ID <SortArrows columnName={"id"} />{" "}
              </th>
              <th>
                {" "}
                Mode <SortArrows columnName={"mode"} />{" "}
              </th>
              <th>
                {" "}
                Name <SortArrows columnName={"name"} />{" "}
              </th>
              <th>
                {" "}
                Origin <SortArrows columnName={"origin"} />{" "}
              </th>
              <th>
                {" "}
                Status <SortArrows columnName={"status"} />{" "}
              </th>
              <th>
                {" "}
                Total <SortArrows columnName={"total"} />{" "}
              </th>
              <th>
                {" "}
                Type <SortArrows columnName={"type"} />{" "}
              </th>
              <th>
                {" "}
                User ID <SortArrows columnName={"userId"} />{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td> {record.id} </td>
                <td> {record.mode} </td>
                <td> {record.name} </td>
                <td> {record.origin} </td>
                <td> {record.status} </td>
                <td> {record.total} </td>
                <td> {record.type} </td>
                <td> {record.userId} </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return <h1>No record found</h1>;
  };

  useEffect(() => {
    fetchRecords();
  }, [page, limit, sortColumn, sortOrder]);

  return (
    <div className="records-page">
      <div className="table-container">
        <div className="table-controls">
          <input
            type="text"
            placeholder={"Search"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                fetchRecords();
              }
            }}
          />
          <select
            value={limit}
            onChange={(e) => {
              setLimit(e.target.value);
            }}
            title="Pagination limit"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
        {errorMsg && <div className="error-message">{errorMsg}</div>}
        {getTable()}
      </div>
      {totalRecords !== 0 && (
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={totalRecords / limit}
          marginPagesDisplayed={1}
          pageRangeDisplayed={5}
          onPageChange={(obj) => setPage(obj.selected + 1)}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      )}
    </div>
  );
}

export default Table;
