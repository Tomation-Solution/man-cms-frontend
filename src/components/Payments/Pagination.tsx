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
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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

      {pageNumbers.map((page) => (
        <button
          key={page}
          style={{
            ...styles.button,
            ...(currentPage === page ? styles.activeButton : {}),
          }}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

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
