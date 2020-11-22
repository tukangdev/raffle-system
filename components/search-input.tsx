import React from "react";

type SearchInputProps = {
  wrapperClass: string;
  search: string;
  handleSearch: Function;
} & React.HTMLProps<HTMLInputElement>;

const SearchInput = (props: SearchInputProps) => (
  <div className={`relative text-gray-600 ${props.wrapperClass}`}>
    <input
      value={props.search}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        props.handleSearch(e.target.value)
      }
      className="border-2 border-grey-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full"
      type="search"
      name="search"
      placeholder="Search"
    />
    <button type="submit" className="absolute right-0 top-0 mt-2 mr-2">
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  </div>
);

export default SearchInput;
