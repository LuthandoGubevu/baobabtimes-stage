import { cn } from "../../../utils/cn";

/**
 * AdminTable component for displaying and managing data in the admin panel
 * @param {Object} props
 * @param {Array} props.columns
 * @param {Array} props.data
 * @param {string} props.className
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 * @param {Function} props.renderActions
 */
export default function AdminTable({ columns, data, className, onEdit, onDelete, renderActions }) {
  return (
    <div className={cn("overflow-x-auto bg-white rounded-3xl border border-stone-200 shadow-sm", className)}>
      <table className="min-w-full divide-y divide-stone-200">
        <thead className="bg-stone-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-4 text-left text-[10px] font-bold text-stone-400 uppercase tracking-widest"
              >
                {column.label}
              </th>
            ))}
            <th scope="col" className="relative px-6 py-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 bg-white">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="hover:bg-stone-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {renderActions ? renderActions(row) : (
                  <>
                    <button 
                      onClick={() => onEdit?.(row)}
                      className="text-stone-400 hover:text-stone-900 transition-colors mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete?.(row)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
