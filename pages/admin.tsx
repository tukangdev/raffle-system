import React from "react";
import Card from "../components/card";
import CheckboxInput from "../components/checkbox-input";
import Column from "../components/column";
import DropdownInput from "../components/dropdown-input";
import Nav from "../components/nav";
import PaginationInterface from "../components/pagination-interface";
import SearchInput from "../components/search-input";
import TextInput from "../components/text-input";

const Admin = () => {
  return (
    <>
      <Nav />
      <div className="container mx-auto my-6 px-4">
        <h1 className="text-3xl sm:text-5xl font-semibold">Admin Dashboard</h1>
        <div></div>
        <div className="flex flex-row mt-6">
          <Column
            title="Manage names"
            action={
              <button className="bg-primary px-4 py-2 text-white">
                <svg
                  className="h-6 w-6 float-left mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>{" "}
                IMPORT CSV
              </button>
            }
          >
            <Card wrapperClass="flex flex-row items-center flex-wrap">
              <div className="flex flex-row items-center flex-grow gap-4 flex-wrap-reverse">
                <div className="flex flex-row gap-4 lg:w-1/6">
                  <CheckboxInput />
                  <p>Select All</p>
                </div>
                <SearchInput className="w-full lg:w-1/4 md:w-1/3" />
                <TextInput
                  placeholder="Add a name"
                  className="w-full lg:w-1/4 md:w-1/3"
                  rightIcon={
                    <svg
                      className="h-6 w-6 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>
              {/* <p className="text-red-500">Delete Selected</p> */}
            </Card>
            <Card wrapperClass="mt-4 px-0 py-0">
              <ul>
                <li className="py-3 px-6 hover:bg-red-100">
                  <CheckboxInput wrapperClass="inline-block float-left mr-4" />
                  Amin Roslan
                </li>
                <li className="py-3 px-6 hover:bg-red-100">
                  <CheckboxInput wrapperClass="inline-block float-left mr-4" />
                  Maiya Abueg
                </li>
              </ul>
              <PaginationInterface />
            </Card>
          </Column>
        </div>
      </div>
    </>
  );
};

export default Admin;
