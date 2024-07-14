export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
};

export interface Medication {
  id: number;
  name: string;
  description: string;
  count: number;
  destination_count: number;
  created_date: string;
}
