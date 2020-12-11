export type Config = {
  bgColor: string;
  bgImage: string;
  cardBgColor: string;
  cardLogoImage: string;
};

export type ResponseData = {
  data: FirebaseFirestore.DocumentData[] | FirebaseFirestore.DocumentData;
  total: number;
};

export type Name = {
  id: string;
  name: string;
  isWinner: boolean;
  updatedAt: FirebaseFirestore.FieldValue;
  createdAt: FirebaseFirestore.FieldValue;
};
