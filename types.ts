export type Config = {
  bgColor: string;
  bgImage: string;
  cardBgColor: string;
  cardLogoImage: string;
};

export type ResponseData = {
  data?: FirebaseFirestore.DocumentData[] | FirebaseFirestore.DocumentData;
};

export type Name = {
  id: string;
  name: string;
};
