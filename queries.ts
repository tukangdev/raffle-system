import {
  useMutation,
  usePaginatedQuery,
  useQuery,
  useQueryCache,
} from "react-query";
import axios, { AxiosPromise, AxiosRequestConfig } from "axios";
import { Config, Name } from "./types";
import { Settings } from "./enum";

export const fetchData = <Result>(
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
  search: string;
}) => {
  const queryCache = useQueryCache();

  return usePaginatedQuery(
    [CACHE_KEYS.namesPaginate, pagination],
    (_, { search, go, perPage = 5, anchors = [] }) =>
      fetchData<{ items: Name[]; total: number }>(
        "GET",
        `/api/raffle/names?q=${search}&go=${go}&firstAnchorId=${anchors[0]}&lastAnchorId=${anchors[1]}&perPage=${perPage}`
      ),
    {
      refetchOnMount: "always",
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
};

export const useRandomName = () => {
  const queryCache = useQueryCache();

  return useQuery("", () =>
    fetchData<FirebaseFirestore.DocumentData>("GET", "/api/raffle/names/random")
  );
};

export const useCreateName = () => {
  const queryCache = useQueryCache();

  return useMutation(
    ({ names }: { names: string[] }) => {
      return fetchData<Name>("POST", "/api/raffle/names", {
        data: { names },
      });
    },
    {
      onSuccess: (response) => {
        queryCache.invalidateQueries(CACHE_KEYS.namesPaginate);
        queryCache.invalidateQueries(CACHE_KEYS.names);
      },
    }
  );
};

export const useDeleteName = () => {
  const queryCache = useQueryCache();

  return useMutation(
    ({ ids }: { ids: string[] }) =>
      fetchData("DELETE", `/api/raffle/names`, {
        data: {
          names: ids,
        },
      }),

    {
      onSuccess: (data, param) => {
        queryCache.invalidateQueries(CACHE_KEYS.namesPaginate);
        queryCache.invalidateQueries(CACHE_KEYS.names);
        param.ids.map((id) =>
          queryCache.setQueryData([CACHE_KEYS.names, id], data)
        );
      },
    }
  );
};

export const useConfig = () => {
  // const queryCache = useQueryCache();

  return useQuery(CACHE_KEYS.config, () =>
    fetchData<FirebaseFirestore.DocumentData>("GET", "/api/raffle/config")
  );
};

export const useConfigUpdate = () => {
  const queryCache = useQueryCache();

  return useMutation(
    ({
      value,
      setting,
    }: {
      value: string | string[] | number;
      setting: Settings;
    }) =>
      fetchData("PUT", `/api/raffle/config/${setting}`, {
        data: { value },
      }),

    {
      onSuccess: (data, param) => {
        queryCache.invalidateQueries(CACHE_KEYS.config);
        queryCache.setQueryData([CACHE_KEYS.config, param.setting], data);
      },
    }
  );
};

const CACHE_KEYS = {
  names: "names",
  namesPaginate: "namesPaginate",
  config: "config",
};
