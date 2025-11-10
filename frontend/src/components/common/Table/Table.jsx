// src/components/common/Table/Table.jsx
import './Table.css';

/**
 * Reusable Table Component
 * @param {Object} props
 * @param {Array} props.columns - Array of {key, label, align} objects
 * @param {Array} props.data - Array of data objects
 * @param {string} props.emptyMessage - Message when no data
 * @param {Function} props.renderRow - Custom row renderer (optional)
 * @param {string} props.className - Additional CSS classes
 */
export default function Table({
  columns = [],
  data = [],
  emptyMessage = 'No data available',
  renderRow,
  className = '',
  ...rest
}) {
  const tableClasses = [
    'table-container',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={tableClasses} {...rest}>
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`table-header-cell ${column.align ? `text-${column.align}` : ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="table-empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              renderRow ? (
                renderRow(row, rowIndex)
              ) : (
                <tr key={rowIndex} className="table-row">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`table-cell ${column.align ? `text-${column.align}` : ''}`}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              )
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}