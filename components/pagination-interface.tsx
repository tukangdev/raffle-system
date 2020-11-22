import React from "react";

const PaginationInterface = (props: {
  handlePerPage: Function;
  handleGo: Function;
  page: number;
  handlePage: Function;
  dataCount: number;
}) => {
  const [perPage, setPerPage] = React.useState(5);
  const [go, setGo] = React.useState<"next" | "prev" | "start" | "last">();

  const change = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.handlePerPage(parseInt(event.target.value));
    setPerPage(parseInt(event.target.value));
  };

  const totalPages = Math.round(props.dataCount / perPage);

  const move = (go: "next" | "prev" | "start" | "last") => {
    props.handleGo(go);
    setGo(go);

    console.log(props.page);

    switch (go) {
      case "start": {
        props.handlePage(1);
        break;
      }
      case "next": {
        props.handlePage(
          props.page === totalPages ? totalPages : props.page + 1
        );
        break;
      }
      case "prev": {
        props.handlePage(props.page === 1 ? 1 : props.page - 1);
        break;
      }
      case "last": {
        props.handlePage(totalPages);
        break;
      }
    }
  };

  return (
    <div className="flex flex-row items-center justify-center gap-2 flex-wrap py-3 px-6 text-grey-600">
      <p>Items per page</p>
      <div className={`inline-block relative w-16`}>
        <select
          value={perPage}
          onChange={change}
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={30}>30</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      <p>
        {props.page} - {totalPages} of {props.dataCount}
      </p>
      <div className="flex flex-row items-center">
        <a
          onClick={() => (props.page !== 1 ? move("start") : null)}
          className="cursor-pointer hover:text-grey-900"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <a
          onClick={() => (props.page !== 1 ? move("prev") : null)}
          className="cursor-pointer hover:text-grey-900"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <a
          onClick={() => (props.page !== totalPages ? move("next") : null)}
          className="cursor-pointer hover:text-grey-900"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <a
          onClick={() => (props.page !== totalPages ? move("last") : null)}
          className="cursor-pointer hover:text-grey-900"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default PaginationInterface;
