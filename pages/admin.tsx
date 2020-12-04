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
import { AlertType, Settings } from "../enum";
import {
  useConfig,
  useConfigUpdate,
  useCreateName,
  useDeleteName,
  useNames,
} from "../queries";
import { Line } from "rc-progress";
import debounce from "lodash.debounce";
import FileUploader from "../components/dropzone";
import { TwitterPicker } from "react-color";
import Select from "../components/select";
import { storage } from "../lib/firebase-client";

const Admin = () => {
  const [create, { isLoading: isLoadingCreate }] = useCreateName();
  const [remove, { isLoading: isLoadingRemove }] = useDeleteName();
  const {
    isFetching: isLoadingConfig,
    isError: isErrorConfig,
    data: configData,
    error,
  } = useConfig();
  const [update, { isLoading: isLoadingConfigUpdate }] = useConfigUpdate();

  const [page, setPage] = React.useState(1);
  const [anchors, setAnchors] = React.useState<[string, string]>();
  const [perPage, setPerPage] = React.useState<5 | 10 | 30>(5);
  const [name, setName] = React.useState("");
  const [alertType, setAlertType] = React.useState<AlertType>(
    AlertType.success
  );
  const [showImporter, setShowImporter] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertText, setAlertText] = React.useState("");
  const [selectList, setSelectList] = React.useState<string[]>([]);
  const [go, setGo] = React.useState<"next" | "prev" | "start" | "last">();
  const [bgImageFile, setBgImageFile] = React.useState<File | null>(null);
  const [cardLogoFile, setCardLogoFile] = React.useState<File | null>(null);
  const [bgColor, setBgColor] = React.useState("");
  const [bgImage, setBgImage] = React.useState("");
  const [cardBgColor, setCardBgColor] = React.useState<string[]>(["", "", ""]);
  const [cardLogoImage, setCardLogoImage] = React.useState("");
  const [showBgColorPicker, setShowBgColorPicker] = React.useState(false);
  const [showCardBgColorPicker, setShowCardBgColorPicker] = React.useState([
    false,
    false,
    false,
  ]);
  const [gradient, setGradient] = React.useState<{
    text: "Linear (2 Colors)" | "Linear (3 Colors)" | "None";
    value: 2 | 3 | 1;
  }>({ text: "None", value: 1 });
  const [bgImageUploadProgress, setBgImageUploadProgress] = React.useState(0);
  const [cardLogoUploadProgress, setCardLogoUploadProgress] = React.useState(0);
  const cardLogoUploadRef = React.useRef<HTMLInputElement>();
  const bgImageUploadRef = React.useRef<HTMLInputElement>();

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

  const isLoading =
    isLoadingCreate || isLoadingRemove || isLoadingNames || isLoadingConfig;

  // Only runs on first load. Status dictates that
  React.useEffect(() => {
    if (resolvedData && status === "success") {
      setAnchors([
        resolvedData.data.items[0].id,
        resolvedData.data.items[resolvedData.data.items.length - 1].id,
      ]);
    }

    if (configData) {
      setBgColor(configData.data.bgColor);
      setBgImage(configData.data.bgImage);
      setCardBgColor(configData.data.cardBgColor);
      setCardLogoImage(configData.data.cardLogoImage);

      switch (configData.data.gradient) {
        case 3: {
          setGradient({ text: "Linear (3 Colors)", value: 3 });
          break;
        }
        case 2: {
          setGradient({ text: "Linear (2 Colors)", value: 2 });
          break;
        }
        default: {
          setGradient({ text: "None", value: 1 });
          break;
        }
      }
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
      { names: [name] },
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

  const handleFireBaseUpload = (setting: Settings, file: File | null) => {
    if (!file) {
      console.error(`not an image, the image file is a ${typeof file}`);
    } else {
      const uploadTask = storage
        .ref(`/images/${setting}-${file.name}-${file.lastModified}`)
        .put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (setting === Settings.bgImage) {
            setBgImageUploadProgress(progress);
          } else {
            setCardLogoUploadProgress(progress);
          }
        },
        (err) => {
          console.log(err);
        },
        () => {
          storage
            .ref("images")
            .child(`${setting}-${file.name}-${file.lastModified}`)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              console.log(fireBaseUrl);
              update(
                {
                  value: fireBaseUrl,
                  setting,
                },
                {
                  onSuccess: () => {
                    alert(AlertType.success, "Background image updated!");
                    setBgImageUploadProgress(0);
                    setCardLogoUploadProgress(0);
                    if (cardLogoUploadRef.current) {
                      cardLogoUploadRef.current.value = "";
                    }

                    if (bgImageUploadRef.current) {
                      bgImageUploadRef.current.value = "";
                    }
                  },
                }
              );
            });
        }
      );
    }
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
              <div>
                <Button
                  onClick={() => setShowImporter(!showImporter)}
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
                {showImporter && (
                  <div className="left-0 sm:right-0 md:left-auto lg:right-auto absolute bg-white p-6 z-10 shadow-md mt-4">
                    <FileUploader onSuccess={() => setShowImporter(false)} />
                  </div>
                )}
              </div>
            }
          >
            <Card wrapperClass="flex flex-row items-center flex-wrap">
              <div className="hidden lg:flex flex-row items-center flex-grow gap-4 flex-wrap-reverse">
                <div className="flex flex-row gap-4 lg:flex-shrink">
                  <CheckboxInput
                    checked={Boolean(selectList.length)}
                    onChange={selectAll}
                  />
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
                  righticon={
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
                    righticon={
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
                  <div
                    style={{ backgroundColor: bgColor }}
                    className="h-6 w-full my-2 rounded-lg"
                  ></div>
                  <TextInput
                    value={bgColor}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBgColor(e.target.value)
                    }
                    righticon={
                      <a
                        onClick={() => {
                          update(
                            {
                              value: bgColor,
                              setting: Settings.bgColor,
                            },
                            {
                              onSuccess: () => {
                                alert(
                                  AlertType.success,
                                  "Background color updated!"
                                );
                              },
                            }
                          );
                        }}
                      >
                        <svg
                          className={`text-primary h-6 w-6 ${
                            configData?.data.bgColor === bgColor
                              ? "hidden"
                              : "block"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </a>
                    }
                    onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                  />
                  {configData?.data.bgColor !== bgColor && (
                    <span className="text-xs text-grey-500">
                      Click &#10004; to update.
                    </span>
                  )}
                  {showBgColorPicker && (
                    <div className="absolute mt-2">
                      <TwitterPicker
                        onChangeComplete={(color) => {
                          setBgColor(color.hex);
                          setShowBgColorPicker(false);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col mt-6">
                  <label className="font-semibold">Background Image</label>
                  {configData?.data.bgImage && (
                    <img
                      src={configData.data.bgImage}
                      className="rounded-lg mt-4 w-full h-auto"
                    />
                  )}
                  <input
                    type="file"
                    className="my-6"
                    accept="image/*"
                    onChange={(e) =>
                      setBgImageFile(e.target.files ? e.target.files[0] : null)
                    }
                  ></input>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleFireBaseUpload(Settings.bgImage, bgImageFile);
                    }}
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
                    disabled={!bgImageFile}
                  >
                    {bgImageUploadProgress
                      ? `Uploading - ${bgImageUploadProgress}%`
                      : "UPLOAD IMAGE"}
                  </Button>
                  {!!bgImageUploadProgress && (
                    <Line
                      className="my-4"
                      percent={bgImageUploadProgress}
                      strokeWidth={4}
                      trailWidth={4}
                      strokeColor="#ae2c22"
                    />
                  )}
                </div>
              </div>
              <div className="w-full lg:w-1/2 lg:pl-2">
                <div className="mt-6">
                  <span className="font-semibold">Card Background Color</span>
                  <Select
                    options={[
                      { text: "Linear (2 Colors)", value: 2 },
                      { text: "Linear (3 Colors)", value: 3 },
                      { text: "None", value: 1 },
                    ]}
                    value={gradient}
                    onSelect={(option: {
                      text: "Linear (2 Colors)" | "Linear (3 Colors)" | "None";
                      value: 2 | 3 | 1;
                    }) => {
                      setGradient(option);
                      update(
                        {
                          value: option.value,
                          setting: Settings.gradient,
                        },
                        {
                          onSuccess: () => {
                            alert(
                              AlertType.success,
                              "Card background color gradient updated!"
                            );
                          },
                        }
                      );
                    }}
                    label="Gradient"
                  />

                  {/* FIRST COLOR */}

                  <div
                    style={{ backgroundColor: cardBgColor[0] }}
                    className="h-6 w-full my-2 rounded-lg"
                  ></div>

                  <TextInput
                    value={cardBgColor[0]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCardBgColor((prevState) => [
                        e.target.value,
                        prevState[1],
                        prevState[2],
                      ])
                    }
                    onClick={() =>
                      setShowCardBgColorPicker((prevState) => [
                        !showCardBgColorPicker[0],
                        prevState[1],
                        prevState[2],
                      ])
                    }
                    righticon={
                      <a
                        onClick={() => {
                          update(
                            {
                              value: cardBgColor,
                              setting: Settings.cardBgColor,
                            },
                            {
                              onSuccess: () => {
                                alert(
                                  AlertType.success,
                                  "Card background color updated!"
                                );
                              },
                            }
                          );
                        }}
                      >
                        <svg
                          className={`text-primary h-6 w-6 ${
                            configData?.data.cardBgColor[0] === cardBgColor[0]
                              ? "hidden"
                              : "block"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </a>
                    }
                  />
                  {configData?.data.cardBgColor[0] !== cardBgColor[0] ? (
                    <span className="text-xs text-grey-500">
                      Click &#10004; to update.
                    </span>
                  ) : (
                    <span className="text-xs text-grey-500">First color</span>
                  )}
                  {showCardBgColorPicker[0] && (
                    <div className="absolute mt-2 z-10">
                      <TwitterPicker
                        onChangeComplete={(color) => {
                          setCardBgColor((prevState) => [
                            color.hex,
                            prevState[1],
                            prevState[2],
                          ]);
                          setShowCardBgColorPicker((prevState) => [
                            false,
                            prevState[1],
                            prevState[2],
                          ]);
                        }}
                      />
                    </div>
                  )}

                  {/* SECOND COLOR */}

                  {(gradient.text === "Linear (2 Colors)" ||
                    gradient.text === "Linear (3 Colors)") && (
                    <>
                      <div
                        style={{ backgroundColor: cardBgColor[1] }}
                        className="h-6 w-full my-2 rounded-lg"
                      ></div>

                      <TextInput
                        value={cardBgColor[1]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setCardBgColor((prevState) => [
                            prevState[0],
                            e.target.value,
                            prevState[2],
                          ])
                        }
                        onClick={() =>
                          setShowCardBgColorPicker((prevState) => [
                            prevState[0],
                            !showCardBgColorPicker[1],
                            prevState[2],
                          ])
                        }
                        righticon={
                          <a
                            onClick={() => {
                              update(
                                {
                                  value: cardBgColor,
                                  setting: Settings.cardBgColor,
                                },
                                {
                                  onSuccess: () => {
                                    alert(
                                      AlertType.success,
                                      "Card background color updated!"
                                    );
                                  },
                                }
                              );
                            }}
                          >
                            <svg
                              className={`text-primary h-6 w-6 ${
                                configData?.data.cardBgColor[1] ===
                                cardBgColor[1]
                                  ? "hidden"
                                  : "block"
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </a>
                        }
                      />
                      {configData?.data.cardBgColor[1] !== cardBgColor[1] ? (
                        <span className="text-xs text-grey-500">
                          Click &#10004; to update.
                        </span>
                      ) : (
                        <span className="text-xs text-grey-500">
                          Second color
                        </span>
                      )}
                      {showCardBgColorPicker[1] && (
                        <div className="absolute mt-2 z-10">
                          <TwitterPicker
                            onChangeComplete={(color) => {
                              setCardBgColor((prevState) => [
                                prevState[0],
                                color.hex,
                                prevState[2],
                              ]);
                              setShowCardBgColorPicker((prevState) => [
                                prevState[0],
                                false,
                                prevState[1],
                              ]);
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* THIRD COLOR */}

                  {gradient.text === "Linear (3 Colors)" && (
                    <>
                      <div
                        style={{ backgroundColor: cardBgColor[2] }}
                        className="h-6 w-full my-2 rounded-lg"
                      ></div>

                      <TextInput
                        value={cardBgColor[2]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setCardBgColor((prevState) => [
                            prevState[0],
                            prevState[1],
                            e.target.value,
                          ])
                        }
                        onClick={() =>
                          setShowCardBgColorPicker((prevState) => [
                            prevState[0],
                            prevState[1],
                            !showCardBgColorPicker[2],
                          ])
                        }
                        righticon={
                          <a
                            onClick={() => {
                              update(
                                {
                                  value: cardBgColor,
                                  setting: Settings.cardBgColor,
                                },
                                {
                                  onSuccess: () => {
                                    alert(
                                      AlertType.success,
                                      "Card background color updated!"
                                    );
                                  },
                                }
                              );
                            }}
                          >
                            <svg
                              className={`text-primary h-6 w-6 ${
                                configData?.data.cardBgColor[2] ===
                                cardBgColor[2]
                                  ? "hidden"
                                  : "block"
                              }`}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </a>
                        }
                      />
                      {configData?.data.cardBgColor[2] !== cardBgColor[2] ? (
                        <span className="text-xs text-grey-500">
                          Click &#10004; to update.
                        </span>
                      ) : (
                        <span className="text-xs text-grey-500">
                          Third color
                        </span>
                      )}
                      {showCardBgColorPicker[2] && (
                        <div className="absolute mt-2 z-10">
                          <TwitterPicker
                            onChangeComplete={(color) => {
                              setCardBgColor((prevState) => [
                                prevState[0],
                                prevState[1],
                                color.hex,
                              ]);
                              setShowCardBgColorPicker((prevState) => [
                                prevState[0],
                                prevState[1],
                                false,
                              ]);
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-col mt-6">
                  <label className="font-semibold">Card Logo Image</label>
                  {configData?.data.cardLogoImage && (
                    <img
                      src={configData.data.cardLogoImage}
                      className="rounded-lg mt-4 w-full h-auto"
                    />
                  )}
                  <input
                    type="file"
                    ref={cardLogoUploadRef}
                    className="my-6"
                    accept="image/*"
                    onChange={(e) =>
                      setCardLogoFile(e.target.files ? e.target.files[0] : null)
                    }
                  ></input>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleFireBaseUpload(
                        Settings.cardLogoImage,
                        cardLogoFile
                      );
                    }}
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
                    {cardLogoUploadProgress
                      ? `Uploading - ${cardLogoUploadProgress}%`
                      : "UPLOAD IMAGE"}
                  </Button>
                  {!!cardLogoUploadProgress && (
                    <Line
                      className="my-4"
                      percent={cardLogoUploadProgress}
                      strokeWidth={4}
                      trailWidth={4}
                      strokeColor="#ae2c22"
                    />
                  )}
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
