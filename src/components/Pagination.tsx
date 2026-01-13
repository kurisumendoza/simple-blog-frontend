import { Link, useNavigate } from '@tanstack/react-router';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
};

const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const isBackDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  const navigate = useNavigate();

  const handleBack = () => {
    if (currentPage <= 2) navigate({ to: '/' });
    else navigate({ to: `/page/${currentPage - 1}` });
  };

  const handleNext = () => {
    if (currentPage === totalPages) return;
    else navigate({ to: `/page/${currentPage + 1}` });
  };

  return (
    <div className="flex justify-center items-center gap-5 pt-8">
      <button
        onClick={handleBack}
        className="border rounded py-1 px-2 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
        disabled={isBackDisabled}
      >
        Back
      </button>

      <div className="flex gap-2">
        <span className="font-bold">{currentPage}</span>
        <span>of</span>
        <span className="font-bold">{totalPages}</span>
      </div>

      <button
        onClick={handleNext}
        className="border rounded py-1 px-2 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
        disabled={isNextDisabled}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
