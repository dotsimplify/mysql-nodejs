console.log("working");

/**
 * Sorts a HTML table.
 *
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */
function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  // Sort each row
  const sortedRows = rows.sort((a, b) => {
    const aColText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bColText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
  });

  // Remove all existing TRs from the table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Re-add the newly sorted rows
  tBody.append(...sortedRows);

  // Remember how the column is currently sorted
  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".table-sortable th").forEach((headerCell) => {
  headerCell.addEventListener("click", () => {
    const tableElement = headerCell.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(
      headerCell.parentElement.children,
      headerCell
    );
    const currentIsAscending = headerCell.classList.contains("th-sort-asc");

    sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
  });
});

//Pagination

function addPagerToTables(tables, rowsPerPage = 10) {
  tables =
    typeof tables == "string" ? document.querySelectorAll(tables) : tables;

  for (let table of tables) addPagerToTable(table, rowsPerPage);
}

function addPagerToTable(table, rowsPerPage = 10) {
  let tBodyRows = table.querySelectorAll("tBody tr");
  let numPages = Math.ceil(tBodyRows.length / rowsPerPage);

  let colCount = [].slice
    .call(table.querySelector("tr").cells)
    .reduce((a, b) => a + parseInt(b.colSpan), 0);

  table
    .createTFoot()
    .insertRow().innerHTML = `<td colspan=${colCount}><div class="nav p-2 bg-gray-300 text-center text-xl text-blue-700"></div></td>`;

  if (numPages == 1) return;

  for (i = 0; i < numPages; i++) {
    let pageNum = i + 1;

    table
      .querySelector(".nav")
      .insertAdjacentHTML(
        "beforeend",
        `<a href="#" rel="${i}">${pageNum}</a> `
      );
  }
  //   console.log(tBodyRows);
  changeToPage(table, 1, rowsPerPage);

  for (let navA of table.querySelectorAll(".nav a"))
    navA.addEventListener("click", (e) =>
      changeToPage(table, parseInt(e.target.innerHTML), rowsPerPage)
    );
}

function changeToPage(table, page, rowsPerPage) {
  let startItem = (page - 1) * rowsPerPage;
  let endItem = startItem + rowsPerPage;
  let navAs = table.querySelectorAll(".nav a");
  let tBodyRows = table.querySelectorAll("tBody tr");

  for (let nix = 0; nix < navAs.length; nix++) {
    if (nix == page - 1) navAs[nix].classList.add("active");
    else navAs[nix].classList.remove("active");

    for (let trix = 0; trix < tBodyRows.length; trix++)
      tBodyRows[trix].style.display =
        trix >= startItem && trix < endItem ? "table-row" : "none";
  }
}

addPagerToTables("#my-table", 10);
