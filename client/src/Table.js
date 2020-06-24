import React from "react";
import { useTable } from "react-table";
import { CSSTransition } from "react-transition-group";
import './Table.css'

export default function Table({ columns, data, newId }) {

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  console.log(data)
  // Render the UI for your table
  return (

    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {rows.map((row, i) => {
        prepareRow(row)
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map((cell, j)  => {
              return (
                <CSSTransition
                  in={cell.row.id == newId}
                  appear={true}
                  timeout={3000}
                  classNames="fade"
                  key={Date.now() + cell.column.id}
                >
                  <td  {...cell.getCellProps()}>{cell.render('Cell')}</td>
                </CSSTransition>
              )
            })}
          </tr>
        )
      })}

      </tbody>
    </table>
  )
}