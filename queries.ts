import {
  queryCache,
  useMutation,
  usePaginatedQuery,
  useQuery,
} from "react-query";
import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import { NextApiResponse } from "next";
import { Name } from "./types";

const fetchData = <Result>(
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  url: string,
  options?: AxiosRequestConfig
) => {
  const source = axios.CancelToken.source();

  const promise = axios({
    ...options,
    url,
    method,
  });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled by React Query");
  };

  return promise as AxiosPromise<Result>;
};

export const useNames = (pagination: {
  go?: "next" | "prev" | "start" | "last";
  perPage: 5 | 10 | 30;
  anchors?: [string, string];
}) =>
  usePaginatedQuery(
    [CACHE_KEYS.namesPaginate, pagination],
    (_, { go, perPage = 5, anchors = [] }) =>
      fetchData<{ items: Name[]; total: number }>(
        "GET",
        `/api/raffle/names?go=${go}&firstAnchorId=${anchors[0]}&lastAnchorId=${anchors[1]}&perPage=${perPage}`
      ),
    {
      retry: false,
      onSuccess: (response) => {
        if (response && response.data.items) {
          response.data.items.map(
            ({ id, name }: { id: string; name: string }) =>
              queryCache.setQueryData([CACHE_KEYS.names, id], name)
          );
        }
      },
    }
  );

export const useCreateName = () =>
  useMutation(
    ({ name }: { name: string }) =>
      fetchData<Name>("POST", "/api/raffle/names", {
        data: { name },
      }),

    {
      onSuccess: (response) => {
        queryCache.setQueryData(
          [CACHE_KEYS.names, response.data.id],
          response.data
        );
        queryCache.invalidateQueries(CACHE_KEYS.names);
      },
    }
  );

export const useDeleteName = () =>
  useMutation(
    ({ ids }: { ids: string[] }) =>
      fetchData("DELETE", `/api/raffle/names`, {
        data: {
          names: ids,
        },
      }),

    {
      onSuccess: (data, param) => {
        queryCache.invalidateQueries(CACHE_KEYS.names);
        param.ids.map((id) =>
          queryCache.setQueryData([CACHE_KEYS.names, id], data)
        );
      },
    }
  );

const CACHE_KEYS = {
  names: "names",
  namesPaginate: "namesPaginate",
  config: "config",
};
