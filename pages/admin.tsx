import { resolve } from "path";
import React from "react";
import Alert from "../components/alert";
import Button from "../components/button";
import Card from "../components/card";
import CheckboxInput from "../components/checkbox-input";
import Column from "../components/column";
import Nav from "../components/nav";
import PaginationInterface from "../components/pagination-interface";
import SearchInput from "../components/search-input";
import TextInput from "../components/text-input";
import { AlertType } from "../enum";
import { useCreateName, useDeleteName, useNames } from "../queries";
import debounce from "lodash.debounce";

const Admin = () => {
  const [page, setPage] = React.useState(1);
  const [anchors, setAnchors] = React.useState<[string, string]>();
  const [perPage, setPerPage] = React.useState<5 | 10 | 30>(5);
  const [name, setName] = React.useState("");
  const [alertType, setAlertType] = React.useState<AlertType>(
    AlertType.success
  );
  const [search, setSearch] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertText, setAlertText] = React.useState("");
  const [selectList, setSelectList] = React.useState<string[]>([]);
  const [go, setGo] = React.useState<"next" | "prev" | "start" | "last">();
  const {
    isError,
    resolvedData,
    status,
    isFetching: isLoadingNames,
  } = useNames({
    go,
    perPage,
    anchors,
    search,
  });
  const [create, { isLoading: isLoadingCreate }] = useCreateName();
  const [remove, { isLoading: isLoadingRemove }] = useDeleteName();

  const isLoading = isLoadingCreate || isLoadingRemove || isLoadingNames;

  // Only runs on first load. Status dictates that
  React.useEffect(() => {
    if (resolvedData && status === "success") {
      setAnchors([
        resolvedData.data.items[0].id,
        resolvedData.data.items[resolvedData.data.items.length - 1].id,
      ]);
    }
  }, [status]);

  const selectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectList(
        resolvedData ? resolvedData.data.items.map(({ id }) => id) : []
      );
    } else {
      setSelectList([]);
    }
  };

  const alert = (type: AlertType, text: string) => {
    setAlertText(text);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const submitName = async (name: string) => {
    await create(
      { name },
      {
        onSuccess: () => {
          setName("");
          alert(AlertType.success, `Successfully added ${name}`);
        },
        onError: () => {
          setName("");
          alert(AlertType.error, `Something went wrong while adding ${name}`);
        },
      }
    );
  };

  const removeNames = async () => {
    await remove(
      { ids: selectList },
      {
        onSuccess: () => {
          alert(
            AlertType.success,
            `Successfully deleted ${selectList.length} names`
          );
          setSelectList([]);
        },
        onError: () => {
          alert(
            AlertType.error,
            `Something went wrong while deleting ${selectList.length} names`
          );
          setSelectList([]);
        },
      }
    );
  };
  return (
    <>
      <Nav />
      {isLoading && (
        <Alert
          type={AlertType.warning}
          text={"Loading..."}
          alertState={showAlert}
        />
      )}
      <Alert type={alertType} text={alertText} alertState={showAlert} />

      <div className="mx-auto my-6 px-10 lg:max-w-5xl">
        <h1 className="text-3xl sm:text-5xl font-semibold">Admin Dashboard</h1>
        <div></div>
        <div className="flex flex-row mt-6 gap-12 flex-wrap">
          <Column
            className="lg:max-w-lg"
            title="Manage names"
            action={
              <Button
                leftIcon={
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
                  </svg>
                }
              >
                IMPORT CSV
              </Button>
            }
          >
            <Card wrapperClass="flex flex-row items-center flex-wrap">
              <div className="hidden lg:flex flex-row items-center flex-grow gap-4 flex-wrap-reverse">
                <div className="flex flex-row gap-4 lg:flex-shrink">
                  <CheckboxInput onChange={selectAll} />
                  <p>Select All</p>
                </div>
                <a
                  onClick={() => removeNames()}
                  className={`${
                    !selectList.length && `invisible`
                  } lg:w-1/5 lg:text-center text-red-500 cursor-pointer hover:text-red-700`}
                >
                  Delete{" "}
                  {selectList.length === resolvedData?.data.items.length
                    ? `all`
                    : "selected"}
                </a>
                <SearchInput
                  search={search}
                  handleSearch={(v: string) => setSearch(v)}
                  wrapperClass="w-full lg:w-1/3 md:w-1/3"
                />
                <TextInput
                  value={name}
                  onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
                    event.key === "Enter" ? submitName(name) : null
                  }
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setName(event.target.value)
                  }
                  placeholder="Add a name"
                  className="w-full lg:w-1/4 md:w-1/3"
                  rightIcon={
                    <a onClick={() => submitName(name)}>
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
                    </a>
                  }
                />
              </div>
              <div className="flex lg:hidden flex-col-reverse flex-grow gap-4">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-row gap-4 lg:flex-shrink">
                    <CheckboxInput onChange={selectAll} />
                    <p>Select All</p>
                  </div>
                  <a
                    className={`${
                      !selectList.length && `invisible`
                    } lg:w-1/5 lg:text-center text-red-500 cursor-pointer hover:text-red-700`}
                  >
                    Delete{" "}
                    {selectList.length === resolvedData?.data.items.length
                      ? `all`
                      : "selected"}
                  </a>
                </div>
                <div className="flex gap-4 w-full flex-wrap">
                  <SearchInput
                    search={search}
                    handleSearch={(v: string) =>
                      debounce(() => setSearch(v), 1000)
                    }
                    wrapperClass="w-full md:w-1/2"
                  />
                  <TextInput
                    value={name}
                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
                      event.key === "Enter" ? submitName(name) : null
                    }
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setName(event.target.value)
                    }
                    placeholder="Add a name"
                    className="w-full md:w-1/3"
                    rightIcon={
                      <a onClick={() => submitName(name)}>
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
                      </a>
                    }
                  />
                </div>
              </div>
            </Card>
            {isError ? (
              <div className="mt-4 px-4 py-2 text-white bg-red-300 rounded ">
                Something went wrong. Please try reloading the page.
              </div>
            ) : (
              <Card wrapperClass="mt-4 px-0 py-0">
                <ul>
                  {resolvedData ? (
                    resolvedData.data.items.map(
                      ({ name, id }: { name: string; id: string }) => (
                        <li key={id} className="py-3 px-6 hover:bg-red-100">
                          <CheckboxInput
                            value={id}
                            checked={selectList.includes(id)}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              if (event.target.checked) {
                                selectList.includes(event.target.value)
                                  ? null
                                  : setSelectList([
                                      ...selectList,
                                      event.target.value,
                                    ]);
                              } else {
                                setSelectList(
                                  selectList.filter(
                                    (id) => id !== event.target.value
                                  )
                                );
                              }
                            }}
                            wrapperClass="inline-block float-left mr-4"
                          />
                          {name}
                        </li>
                      )
                    )
                  ) : (
                    <ul>
                      <li className="py-3 px-6 hover:bg-red-100">
                        <span className="skeleton-box h-6 w-6 inline-block mr-4"></span>
                        <span className="skeleton-box h-5 w-2/5 inline-block"></span>
                      </li>
                      <li className="py-3 px-6 hover:bg-red-100">
                        <span className="skeleton-box h-6 w-6 inline-block mr-4"></span>
                        <span className="skeleton-box h-5 w-2/5 inline-block"></span>
                      </li>
                      <li className="py-3 px-6 hover:bg-red-100">
                        <span className="skeleton-box h-6 w-6 inline-block mr-4"></span>
                        <span className="skeleton-box h-5 w-2/5 inline-block"></span>
                      </li>
                      <li className="py-3 px-6 hover:bg-red-100">
                        <span className="skeleton-box h-6 w-6 inline-block mr-4"></span>
                        <span className="skeleton-box h-5 w-2/5 inline-block"></span>
                      </li>
                    </ul>
                  )}
                </ul>

                <PaginationInterface
                  handleGo={(g: "next" | "prev" | "start" | "last") => {
                    setGo(g);
                    resolvedData &&
                      setAnchors([
                        resolvedData.data.items[0].id,
                        resolvedData.data.items[
                          resolvedData.data.items.length - 1
                        ].id,
                      ]);
                  }}
                  isLoading={isLoading}
                  handlePerPage={(p: 5 | 10 | 30) => setPerPage(p)}
                  page={page}
                  handlePage={(p: number) => setPage(p)}
                  dataCount={resolvedData?.data.total || 0}
                />
              </Card>
            )}
          </Column>
          <Column title="Raffle Configuration" className="lg:max-w-sm">
            <div className="flex flex-row flex-wrap">
              <div className="w-full lg:w-1/2 lg:pr-2">
                <div className="mt-6">
                  <label className="font-semibold">Background Color</label>
                  <TextInput />
                </div>
                <div className="flex flex-col mt-6">
                  <label className="font-semibold">Background Image</label>
                  <input type="file" className="my-6"></input>
                  <Button
                    leftIcon={
                      <svg
                        className="h-5 w-5 float-left mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                  >
                    UPLOAD IMAGE
                  </Button>
                </div>
              </div>
              <div className="w-full lg:w-1/2 lg:pl-2">
                <div className="mt-6">
                  <label className="font-semibold">Card Background Color</label>
                  <TextInput />
                </div>
                <div className="flex flex-col mt-6">
                  <label className="font-semibold">Card Logo Image</label>
                  <input type="file" className="my-6"></input>
                  <Button
                    leftIcon={
                      <svg
                        className="h-5 w-5 float-left mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                  >
                    UPLOAD IMAGE
                  </Button>
                </div>
              </div>
            </div>
          </Column>
        </div>
      </div>
    </>
  );
};

export default Admin;
