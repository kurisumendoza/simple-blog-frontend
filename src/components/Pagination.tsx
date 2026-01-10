import { Link } from '@tanstack/react-router';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
};

const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const isBackDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="flex justify-center items-center gap-5 pt-8">
      <Link
        to={currentPage === 2 ? '/' : '/page/$pageId'}
        params={{ pageId: String(currentPage - 1) }}
      >
        <button
          className="border rounded py-1 px-2 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
          disabled={isBackDisabled}
        >
          Back
        </button>
      </Link>
      <div className="flex gap-2">
        <span className="font-bold">{currentPage}</span>
        <span>of</span>
        <span className="font-bold">{totalPages}</span>
      </div>
      <Link to="/page/$pageId" params={{ pageId: String(currentPage + 1) }}>
        <button
          className="border rounded py-1 px-2 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
          disabled={isNextDisabled}
        >
          Next
        </button>
      </Link>
    </div>
  );
};

export default Pagination;
