import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const primaryColor = "#2b3513";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  button: {
    padding: "6px 12px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#fff",
    color: primaryColor,
  },
  activeButton: {
    backgroundColor: primaryColor,
    color: "#fff",
    border: `1px solid ${primaryColor}`,
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  ellipsis: {
    padding: "6px 12px",
    fontSize: "14px",
    color: "#888",
  },
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.button,
          ...(currentPage === 1 ? styles.disabledButton : {}),
        }}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      {generatePageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} style={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={page}
            style={{
              ...styles.button,
              ...(currentPage === page ? styles.activeButton : {}),
            }}
            onClick={() => onPageChange(Number(page))}
          >
            {page}
          </button>
        )
      )}

      <button
        style={{
          ...styles.button,
          ...(currentPage === totalPages ? styles.disabledButton : {}),
        }}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
