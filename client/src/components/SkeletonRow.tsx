export function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
      </td>
    </tr>
  );
}
